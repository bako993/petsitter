import React, { useState } from "react";
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

type NavigationProp = NativeStackNavigationProp<AppStackParams, "MainTabs">;

export default function SearchScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [query, setQuery] = useState("");
    const [selectedService, setSelectedService] = useState<string | null>(null);

    const dummySitters = [
        {
            id: 1,
            name: "Alice",
            city: "Doorwerth",
            rating: 4.8,
            reviews: 20,
            image: require("../../assets/images/slider/slider1.jpg"),
            services: ["pet sitting", "dog walking"],
            availableDurations: ["1 hour", "2 hours"],
            conditions: ["cats & dogs", "vaccinated pets only"],
        },
        {
            id: 2,
            name: "Bob",
            city: "Arnhem",
            rating: 4.5,
            reviews: 12,
            image: require("../../assets/images/slider/slider2.jpg"),
            services: ["grooming", "dog walking"],
            availableDurations: ["1 hour", "overnight"],
            conditions: ["dogs only"],
        },
        {
            id: 3,
            name: "Daisy",
            city: "Amsterdam",
            rating: 5.0,
            reviews: 5,
            image: require("../../assets/images/slider/slider3.jpg"),
            services: ["pet sitting", "grooming"],
            availableDurations: ["2 hours", "overnight"],
            conditions: ["cats only"],
        },
    ];
    const servicesList = ["pet sitting", "dog walking", "grooming"];

    const filteredSitters = dummySitters.filter((s) => {
        const matchesQuery =
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.city.toLowerCase().includes(query.toLowerCase());
        const matchesService = !selectedService || s.services.includes(selectedService);
        return matchesQuery && matchesService;
    });

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
                        <SitterCard sitter={item} onPress={() => navigation.navigate("SitterScreen", { sitterId: item.id })} />
                    )}
                />
            ) : (
                <EmptyState />
            )}
        </ScreenWrapper>
    );
}
