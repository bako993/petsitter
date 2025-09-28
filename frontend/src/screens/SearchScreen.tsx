import React, { useState } from "react";
import {View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Theme } from "@/src/theme/theme";

type NavigationProp = NativeStackNavigationProp<AppStackParams, "MainTabs">;

type Sitter = {
    id: number;
    name: string;
    city: string;
    rating: number;
    reviews: number;
    image: any;
    services: string[];
    availableDurations: string[];
    conditions: string[];
};

const dummySitters: Sitter[] = [
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

export default function SearchScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [query, setQuery] = useState("");
    const [selectedService, setSelectedService] = useState<string | null>(null);

    const filteredSitters = dummySitters.filter((s) => {
        const matchesQuery =
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.city.toLowerCase().includes(query.toLowerCase());

        const matchesService = !selectedService || s.services.includes(selectedService);

        return matchesQuery && matchesService;
    });

    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }} scrollable={false}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color={Theme.COLORS.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by sitter name or city"
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            {/* Services Filter */}
            <View style={styles.filterContainer}>
                {servicesList.map((service) => (
                    <TouchableOpacity
                        key={service}
                        style={[
                            styles.filterButton,
                            selectedService === service && styles.filterButtonSelected,
                        ]}
                        onPress={() =>
                            setSelectedService(selectedService === service ? null : service)
                        }
                    >
                        <Text
                            style={[
                                styles.filterText,
                                selectedService === service && styles.filterTextSelected,
                            ]}
                        >
                            {service}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Sitters List */}
            {filteredSitters.length > 0 ? (
                <FlatList
                    data={filteredSitters}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: Theme.SPACING.page }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate("SitterProfile", { sitterId: item.id })
                            }
                        >
                            <Image source={item.image} style={styles.cardImage} />
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardName}>{item.name}</Text>
                                <Text style={styles.cardCity}>{item.city}</Text>
                                <Text style={styles.cardRating}>
                                    ⭐ {item.rating} ({item.reviews} reviews)
                                </Text>
                                <Text style={styles.cardServices}>
                                    Services: {item.services.join(", ")}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={40}
                        color={Theme.COLORS.textSecondary}
                    />
                    <Text style={styles.emptyText}>No sitters found</Text>
                </View>
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Theme.COLORS.card,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: Theme.SPACING.page,
        ...Theme.SHADOWS.default,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.text,
    },
    filterContainer: {
        flexDirection: "row",
        marginVertical: Theme.SPACING.section,
    },
    filterButton: {
        backgroundColor: Theme.COLORS.card,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
    },
    filterButtonSelected: {
        backgroundColor: Theme.COLORS.primary,
    },
    filterText: {
        color: Theme.COLORS.textSecondary,
        fontSize: Theme.FONTS.sizes.small,
    },
    filterTextSelected: {
        color: Theme.COLORS.background,
        fontWeight: Theme.FONTS.weights.bold,
    },
    card: {
        flexDirection: "row",
        backgroundColor: Theme.COLORS.card,
        borderRadius: 10,
        padding: 10,
        marginBottom: Theme.SPACING.section,
        alignItems: "center",
        ...Theme.SHADOWS.default,
    },
    cardImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    cardName: {
        fontSize: Theme.FONTS.sizes.subtitle,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.text,
    },
    cardCity: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
    },
    cardRating: {
        fontSize: Theme.FONTS.sizes.small,
        color: Theme.COLORS.textSecondary,
        marginTop: 2,
    },
    cardServices: {
        fontSize: Theme.FONTS.sizes.small,
        color: Theme.COLORS.textSecondary,
        marginTop: 2,
        fontStyle: "italic",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: {
        marginTop: 10,
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
    },
});