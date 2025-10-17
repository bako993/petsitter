import React, {useEffect, useState} from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Theme } from "@/src/theme/theme";
import { AppStackParams } from "@/src/types/types";
import SearchBar from "@/src/components/Search/SearchBar";
import ServiceFilters from "@/src/components/Search/ServiceFilters";
import SitterCard from "@/src/components/Search/SitterCard";
import EmptyState from "@/src/components/Search/EmptyState";
import { useProfiles } from "@/src/hooks/useProfiles";
import { useLocations } from "@/src/hooks/useLocations";
import { getFullPhotoUri} from "@/src/utils/getFullPhotoUri";
import {loadSittersFromStorage, saveSittersToStorage} from "@/src/utils/storage";
import {Loading} from "@/src/components/Loading";

export default function SearchScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const [query, setQuery] = useState("");
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [sitters, setSitters] = useState<any[]>([]);

    const { getProfiles } = useProfiles();
    const { getLocations } = useLocations();

    useEffect(() => {
        (async () => {
            try {
                const offlineSitters = await loadSittersFromStorage();
                if (offlineSitters) setSitters(offlineSitters);

                const profilesData = await getProfiles();
                const locationsData = await getLocations();

                const mapped = (profilesData || []).map((profile: any) => {

                    const fullPhotoUri = getFullPhotoUri(profile.profile_photo);
                    const userLocation = locationsData.find(
                        (loc: any) => loc.user?.id === profile.user_id
                    );
                    const userName = profile?.user?.name || "Unknown";

                    return {
                        id: profile.id,
                        name: userName,
                        city: userLocation?.full_address || userLocation?.city || "Unknown",
                        rating: "N/A",
                        reviews: 0,
                        image: fullPhotoUri
                            ? { uri: fullPhotoUri }
                            : require("@/assets/images/avatar.jpg"),
                        services: profile.offerings?.map((o: any) => o.offering_type) || [],
                        __rawProfile: profile,
                    };
                });

                setSitters(mapped);
                await saveSittersToStorage(mapped);
            } catch (err) {
                console.error("Error fetching profiles or locations:", err);
            }
        })();
    }, [getProfiles, getLocations]);

    const filteredSitters = sitters.filter((s) => {
        const matchesQuery =
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.city.toLowerCase().includes(query.toLowerCase());
        const matchesService = !selectedService || s.services.includes(selectedService);
        return matchesQuery && matchesService;
    });

    const servicesList = Array.from(new Set(sitters.flatMap((s) => s.services)));

    if (!sitters) return <Loading />;

    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }} scrollable={false}>
            <SearchBar query={query} setQuery={setQuery} />
            <ServiceFilters
                services={servicesList}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
            />

            {filteredSitters.length > 0 ? (
                <FlatList
                    data={filteredSitters}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: Theme.SPACING.page }}
                    renderItem={({ item }) => (
                        <SitterCard
                            sitter={item}
                            onPress={() => navigation.navigate("SitterScreen", { sitterId: item.id })}
                        />
                    )}
                />
            ) : (
                <EmptyState />
            )}
        </ScreenWrapper>
    );
}
