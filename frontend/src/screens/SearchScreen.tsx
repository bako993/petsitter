import React, {useEffect, useState, useMemo, use} from "react";
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
import { BASE_URL } from "@env";
import { useProfiles } from "@/src/hooks/useProfiles";
import { useLocations } from "@/src/hooks/useLocations";

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
                // Step 1: Fetch profiles
                const profilesData = await getProfiles();
                console.log("📦 (DEBUG) profilesData length:", profilesData?.length);

                // Step 2: Fetch locations
                const locationsData = await getLocations();
                console.log("📦 (DEBUG) locationsData length:", locationsData?.length);

                // Step 3: Map profiles with location info
                const mapped = (profilesData || []).map((profile: any) => {
                    const fullPhotoUri = profile?.profile_photo
                        ? `${BASE_URL.replace(/\/api$/, "")}${profile.profile_photo}`
                        : undefined;

                    const userLocation = locationsData.find(
                        (loc: any) => loc.user?.id === profile.user_id
                    );

                    const userName = profile?.user?.name || "Unknown";
                    console.log("userName::::", userName)
                    return {
                        id: profile.id,
                        name: userName,
                        city: userLocation?.full_address || userLocation?.city || "Unknown",
                        rating: "N/A",
                        reviews: 0,
                        image: fullPhotoUri
                            ? { uri: fullPhotoUri }
                            : require("../../assets/images/slider/slider1.jpg"),
                        services: profile.offerings?.map((o: any) => o.offering_type) || [],
                        __rawProfile: profile,
                    };
                });

                setSitters(mapped);
            } catch (err) {
                console.error("Error fetching profiles or locations:", err);
            }
        })();
    }, [getProfiles, getLocations]);



    // 🔹 Filter logic
    const filteredSitters = sitters.filter((s) => {
        const matchesQuery =
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.city.toLowerCase().includes(query.toLowerCase());
        const matchesService = !selectedService || s.services.includes(selectedService);
        return matchesQuery && matchesService;
    });

    const servicesList = Array.from(new Set(sitters.flatMap((s) => s.services)));

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







// import React, { useState } from "react";
// import { FlatList } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import ScreenWrapper from "@/src/components/ScreenWrapper";
// import { Theme } from "@/src/theme/theme";
// import { AppStackParams } from "@/src/types/types";
// import SearchBar from "@/src/components/Search/SearchBar";
// import ServiceFilters from "@/src/components/Search/ServiceFilters";
// import SitterCard from "@/src/components/Search/SitterCard";
// import EmptyState from "@/src/components/Search/EmptyState";
//
// type NavigationProp = NativeStackNavigationProp<AppStackParams, "MainTabs">;
//
// export default function SearchScreen() {
//     const navigation = useNavigation<NavigationProp>();
//     const [query, setQuery] = useState("");
//     const [selectedService, setSelectedService] = useState<string | null>(null);
//
//     const dummySitters = [
//         {
//             id: 1,
//             name: "Alice",
//             city: "Doorwerth",
//             rating: 4.8,
//             reviews: 20,
//             image: require("../../assets/images/slider/slider1.jpg"),
//             services: ["pet sitting", "dog walking"],
//             availableDurations: ["1 hour", "2 hours"],
//             conditions: ["cats & dogs", "vaccinated pets only"],
//         },
//         {
//             id: 2,
//             name: "Bob",
//             city: "Arnhem",
//             rating: 4.5,
//             reviews: 12,
//             image: require("../../assets/images/slider/slider2.jpg"),
//             services: ["grooming", "dog walking"],
//             availableDurations: ["1 hour", "overnight"],
//             conditions: ["dogs only"],
//         },
//         {
//             id: 3,
//             name: "Daisy",
//             city: "Amsterdam",
//             rating: 5.0,
//             reviews: 5,
//             image: require("../../assets/images/slider/slider3.jpg"),
//             services: ["pet sitting", "grooming"],
//             availableDurations: ["2 hours", "overnight"],
//             conditions: ["cats only"],
//         },
//     ];
//     const servicesList = ["pet sitting", "dog walking", "grooming"];
//
//     const filteredSitters = dummySitters.filter((s) => {
//         const matchesQuery =
//             s.name.toLowerCase().includes(query.toLowerCase()) ||
//             s.city.toLowerCase().includes(query.toLowerCase());
//         const matchesService = !selectedService || s.services.includes(selectedService);
//         return matchesQuery && matchesService;
//     });
//
//     return (
//         <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }} scrollable={false}>
//             <SearchBar query={query} setQuery={setQuery} />
//             <ServiceFilters
//                 services={servicesList}
//                 selectedService={selectedService}
//                 setSelectedService={setSelectedService}
//             />
//             {filteredSitters.length > 0 ? (
//                 <FlatList
//                     data={filteredSitters}
//                     keyExtractor={(item) => item.id.toString()}
//                     contentContainerStyle={{ paddingBottom: Theme.SPACING.page }}
//                     renderItem={({ item }) => (
//                         <SitterCard sitter={item} onPress={() => navigation.navigate("SitterScreen", { sitterId: item.id })} />
//                     )}
//                 />
//             ) : (
//                 <EmptyState />
//             )}
//         </ScreenWrapper>
//     );
// }
