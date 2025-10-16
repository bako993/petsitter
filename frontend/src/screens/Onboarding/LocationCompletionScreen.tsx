import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams, Offering } from "@/src/types/types";
import { Theme } from "@/src/theme/theme";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { useOfferings } from "@/src/hooks/useOfferings";
import { useUsers } from "@/src/hooks/useUsers";

export default function LocationCompletionScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { user, setUser, fetchUserById, loadStoredUser } = useUsers();
    const { data: offeringsData, setData: setOfferings, createOffering, deleteOffering } = useOfferings();

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => { (async () => { await loadStoredUser(); })(); }, [loadStoredUser]);

    useEffect(() => {
        (async () => {
            if (!user?.profile?.id) return;
            const updatedUser = await fetchUserById(user.id);
            if (updatedUser.profile?.offerings) {
                setOfferings(updatedUser.profile.offerings);
            }
        })();
    }, [user]);

    const handleSkip = () => {
        // navigation.navigate("NextStepScreen"); // placeholder
    };

    // return (
    //     <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }}>
    //
    //     </ScreenWrapper>
    // );
}
