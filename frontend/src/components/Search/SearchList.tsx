import React from "react";
import { FlatList } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import SearchCard from "./SearchCard";

type Props = {
    sitters: any[];
    navigation: NativeStackNavigationProp<AppStackParams>;
};

export const SearchList = ({ sitters, navigation }: Props) => {
    return (
        <FlatList
            data={sitters}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
                <SearchCard
                    sitter={item}
                    onPress={() => navigation.navigate("SitterScreen", { sitterId: item.id })}
                />
            )}
        />
    );
};
