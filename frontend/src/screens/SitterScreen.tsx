import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Theme } from "@/src/theme/theme";
import { AppStackParams } from "@/src/types/types";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { useProfiles } from "@/src/hooks/useProfiles";
import { useLocations } from "@/src/hooks/useLocations";
import { useReviews } from "@/src/hooks/useReviews";
import { useUsers } from "@/src/hooks/useUsers";
import { getFullPhotoUri } from "@/src/utils/getFullPhotoUri";
import { Loading } from "@/src/components/Loading";
import { loadSittersFromStorage, saveSittersToStorage } from "@/src/utils/storage";
import { SitterCard } from "@/src/components/Sitter/SitterCard";
import {InfoCard} from "@/src/components/Sitter/InfoCard";
import {OfferingsSection} from "@/src/components/Sitter/OfferingsSection";
import {ReviewForm} from "@/src/components/Sitter/ReviewForm";
import {ReviewCard } from "@/src/components/Sitter/ReviewCard";

type Props = NativeStackScreenProps<AppStackParams, "SitterScreen">;

export default function SitterScreen({ route }: Props) {
    const { sitterId } = route.params;
    const { user, loadStoredUser } = useUsers();
    const { getProfileById } = useProfiles();
    const { getLocations } = useLocations();
    const { createReview } = useReviews();

    const [profile, setProfile] = useState<any>(null);
    const [location, setLocation] = useState<any>(null);
    const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => { (async () => { await loadStoredUser(); })(); }, [loadStoredUser]);

    useEffect(() => {
        (async () => {
            try {
                const offlineSitters = await loadSittersFromStorage();
                if (offlineSitters?.length) {
                    const cachedSitter = offlineSitters.find((s: any) => s.id === sitterId);
                    if (cachedSitter) setProfile(cachedSitter.__rawProfile);
                }

                const fetchedProfile = await getProfileById(sitterId);
                setProfile(fetchedProfile);

                const allLocations = await getLocations();
                const userLocation = allLocations.find(
                    (loc: any) => loc.user?.id === fetchedProfile.user_id
                );
                setLocation(userLocation);

                if (offlineSitters) {
                    const updated = offlineSitters.map((s: any) =>
                        s.id === sitterId ? { ...s, __rawProfile: fetchedProfile } : s
                    );
                    await saveSittersToStorage(updated);
                }
            } catch (err) {
                console.error("Error fetching sitter details:", err);
            }
        })();
    }, [sitterId, getProfileById, getLocations]);

    if (!profile) return <Loading />;

    const fullPhotoUri = getFullPhotoUri(profile?.profile_photo);
    const averageRating =
        profile.reviews?.length > 0
            ? (profile.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / profile.reviews.length).toFixed(1)
            : "N/A";

    const handleSubmitReview = async () => {
        if (!user || !newReview.rating || !newReview.comment.trim()) return;
        try {
            setSubmittingReview(true);

            const payload = {
                profile_id: profile.id,
                user_id: user.id,
                rating: newReview.rating,
                comment: newReview.comment,
            };
            await createReview(payload);

            const updatedProfile = await getProfileById(profile.id);
            setProfile(updatedProfile);
            setNewReview({ rating: 0, comment: "" });
        } catch (err) {
            console.error("Error submitting review:", err);
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }} scrollable={false}>
            <FlatList
                data={profile.reviews || []}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View style={{ paddingBottom: Theme.SPACING.page }}>
                        <SitterCard profile={profile} fullPhotoUri={fullPhotoUri} averageRating={averageRating} />

                        <InfoCard title="Experience" content={profile.experience || "No experience info"} />
                        <InfoCard title="Location" content={location?.full_address || location?.city || "Not available"} />
                        <InfoCard title="Bio" content={profile.bio || "No bio available"} />

                        <OfferingsSection offerings={profile.offerings || []} />

                        {/* Review Form */}
                        <ReviewForm
                            rating={newReview.rating}
                            comment={newReview.comment}
                            onChangeRating={(star) => setNewReview(prev => ({ ...prev, rating: star }))}
                            onChangeComment={(text) => setNewReview(prev => ({ ...prev, comment: text }))}
                            onSubmit={handleSubmitReview}
                            submitting={submittingReview}
                        />

                        <Text style={styles.sectionHeader}>Reviews</Text>
                    </View>
                }

                renderItem={({ item }) => (
                    <ReviewCard userName={item.user?.name} rating={item.rating} comment={item.comment} />
                )}

                contentContainerStyle={{ padding: Theme.SPACING.page }}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    averageRating: {
        fontWeight: Theme.FONTS.weights.bold,
        marginLeft: 6,
        color: Theme.COLORS.yellow,
    },
    sectionHeader: {
        fontSize: Theme.FONTS.sizes.subtitle,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.text,
        marginBottom: Theme.SPACING.sm,
    }
});
