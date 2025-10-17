import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, FlatList, StyleSheet, TextInput, Pressable, Easing, Animated } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/src/theme/theme";
import { AppStackParams } from "@/src/types/types";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { useProfiles } from "@/src/hooks/useProfiles";
import { useLocations } from "@/src/hooks/useLocations";
import { useReviews } from "@/src/hooks/useReviews";
import { useUsers } from "@/src/hooks/useUsers";
import { getFullPhotoUri } from "@/src/utils/getFullPhotoUri";
import { ICONS } from "@/src/constants/icons";
import { Loading } from "@/src/components/Loading";
import { loadSittersFromStorage, saveSittersToStorage } from "@/src/utils/storage";

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
    const [selectedOffering, setSelectedOffering] = useState<any>(null);
    const animationHeight = useRef(new Animated.Value(0)).current;

    const handlePress = (offering: any) => {
        if (selectedOffering?.id === offering.id) {
            // Hide details
            Animated.timing(animationHeight, {
                toValue: 0,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start(() => setSelectedOffering(null));
        } else {
            setSelectedOffering(offering);
        }
    };

    useEffect(() => {
        if (selectedOffering) {
            Animated.timing(animationHeight, {
                toValue: 150,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start();
        }
    }, [selectedOffering]);

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
                        {/* ====== Profile Photo & Name ====== */}
                        <View style={styles.profileCard}>
                            <Image
                                source={fullPhotoUri ? { uri: fullPhotoUri } : require("@/assets/images/avatar.jpg")}
                                style={styles.profileImage}
                            />
                            <Text style={styles.profileName}>{profile?.user?.name || "Unknown"}</Text>
                            <View style={styles.ratingContainer}>
                                <Ionicons name={ICONS.star} size={20} color={Theme.COLORS.yellow} />
                                <Text style={styles.averageRating}>{averageRating}</Text>
                                <Text style={styles.reviewCount}>({profile.reviews?.length || 0} reviews)</Text>
                            </View>
                        </View>

                        {/* ====== Info Cards ====== */}
                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Experience</Text>
                            <Text style={styles.infoText}>{profile.experience || "No experience info"}</Text>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Location</Text>
                            <Text style={styles.infoText}>{location?.full_address || location?.city || "Not available"}</Text>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Bio</Text>
                            <Text style={styles.infoText}>{profile.bio || "No bio available"}</Text>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Services</Text>

                            <View style={styles.servicesRow}>
                                {profile.offerings?.length > 0 ? (
                                    profile.offerings.map((o: any) => {
                                        const isSelected = selectedOffering?.id === o.id;
                                        return (
                                            <Pressable
                                                key={o.id}
                                                style={[
                                                    styles.serviceBadge,
                                                    isSelected && { backgroundColor: Theme.COLORS.primary },
                                                ]}
                                                onPress={() => handlePress(o)}
                                            >
                                                <Text style={styles.serviceText}>{o.offering_type}</Text>
                                                <Ionicons
                                                    name={isSelected ? ICONS.chevronUp : ICONS.info}
                                                    size={Theme.FONTS.sizes.body}
                                                    color={Theme.COLORS.background}
                                                    style={{ marginLeft: 6 }}
                                                />
                                            </Pressable>
                                        );
                                    })
                                ) : (
                                    <Text style={styles.infoText}>No services offered</Text>
                                )}
                            </View>

                            {profile.offerings?.length > 0 && (
                                <Text style={styles.hintText}>Tap a service for more details</Text>
                            )}

                            {/* Offering details */}
                            {selectedOffering && (
                                <Animated.View
                                    style={[
                                        styles.offeringDetails,
                                        { height: animationHeight, overflow: "hidden" },
                                    ]}
                                >
                                    <Text style={styles.offeringInfo}>Price: ${selectedOffering.price}</Text>
                                    <Text style={styles.offeringInfo}>Duration: {selectedOffering.duration}</Text>
                                    {selectedOffering.conditions && (
                                        <Text style={styles.offeringInfo}>Conditions: {selectedOffering.conditions}</Text>
                                    )}
                                </Animated.View>
                            )}
                        </View>

                        {/* Review Form */}
                        <View style={styles.reviewForm}>
                            <Text style={styles.sectionHeader}>Leave a Review</Text>

                            <View style={styles.starRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Pressable key={star} onPress={() => setNewReview(prev => ({ ...prev, rating: star }))}>
                                        <Ionicons
                                            name={ICONS.star}
                                            size={32}
                                            color={star <= newReview.rating ? Theme.COLORS.yellow : Theme.COLORS.textSecondary}
                                            style={{ marginHorizontal: 4 }}
                                        />
                                    </Pressable>
                                ))}
                            </View>

                            <TextInput
                                style={styles.commentInput}
                                placeholder="Write your review..."
                                placeholderTextColor={Theme.COLORS.textSecondary}
                                value={newReview.comment}
                                onChangeText={(text) => setNewReview(prev => ({ ...prev, comment: text }))}
                                multiline
                            />

                            <Pressable
                                style={[
                                    styles.submitButton,
                                    (submittingReview || !newReview.rating || !newReview.comment.trim()) && { opacity: 0.6 },
                                ]}
                                onPress={handleSubmitReview}
                                disabled={submittingReview || !newReview.rating || !newReview.comment.trim()}
                            >
                                <Text style={styles.submitButtonText}>
                                    {submittingReview ? "Submitting..." : "Submit Review"}
                                </Text>
                            </Pressable>
                        </View>

                        <Text style={styles.sectionHeader}>Reviews</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewUser}>{item.user?.name || `User ${item.user_id}`}</Text>
                            <View style={styles.reviewStars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Ionicons
                                        key={star}
                                        name={ICONS.star}
                                        size={20}
                                        color={star <= item.rating ? Theme.COLORS.yellow : Theme.COLORS.textSecondary}
                                    />
                                ))}
                            </View>
                        </View>
                        <Text style={styles.reviewComment}>{item.comment}</Text>
                    </View>
                )}
                contentContainerStyle={{ padding: Theme.SPACING.page }}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    profileCard: {
        alignItems: "center",
        marginBottom: Theme.SPACING.page,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: Theme.SPACING.sm,
    },
    profileName: {
        fontSize: Theme.FONTS.sizes.title,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.text,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: Theme.SPACING.xs,
    },
    averageRating: {
        fontWeight: Theme.FONTS.weights.bold,
        marginLeft: 6,
        color: Theme.COLORS.yellow,
    },
    reviewCount: {
        marginLeft: 6,
        color: Theme.COLORS.textSecondary,
    },
    infoCard: {
        backgroundColor: Theme.COLORS.card,
        padding: Theme.SPACING.section,
        borderRadius: 16,
        marginBottom: Theme.SPACING.section,
    },
    infoTitle: {
        fontWeight: Theme.FONTS.weights.bold,
        fontSize: Theme.FONTS.sizes.body,
        marginBottom: Theme.SPACING.xs,
        color: Theme.COLORS.text,
    },
    infoText: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
    },
    servicesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: Theme.SPACING.xs,
    },
    // serviceBadge: {
        // backgroundColor: Theme.COLORS.accent,
        // paddingHorizontal: Theme.SPACING.sm,
        // paddingVertical: Theme.SPACING.xs,
        // borderRadius: 20,
        // marginRight: Theme.SPACING.xs,
        // marginBottom: Theme.SPACING.xs,
    // },
    serviceText: {
        color: Theme.COLORS.background,
        fontSize: Theme.FONTS.sizes.body,
    },
    reviewForm: {
        backgroundColor: Theme.COLORS.card,
        padding: Theme.SPACING.section,
        borderRadius: 16,
        marginVertical: Theme.SPACING.page,
    },
    sectionHeader: {
        fontSize: Theme.FONTS.sizes.subtitle,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.text,
        marginBottom: Theme.SPACING.sm,
    },
    starRow: {
        flexDirection: "row",
        marginBottom: Theme.SPACING.sm,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: Theme.COLORS.textSecondary,
        borderRadius: 12,
        padding: Theme.SPACING.sm,
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.text,
        minHeight: 80,
        textAlignVertical: "top",
        marginBottom: Theme.SPACING.sm,
    },
    submitButton: {
        backgroundColor: Theme.COLORS.primary,
        paddingVertical: Theme.SPACING.sm,
        borderRadius: 12,
        alignItems: "center",
    },
    submitButtonText: {
        color: Theme.COLORS.background,
        fontWeight: Theme.FONTS.weights.bold,
        fontSize: Theme.FONTS.sizes.body,
    },
    reviewCard: {
        backgroundColor: Theme.COLORS.card,
        borderRadius: 16,
        padding: Theme.SPACING.sm,
        marginBottom: Theme.SPACING.sm,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: Theme.SPACING.xs,
    },
    reviewUser: {
        fontWeight: Theme.FONTS.weights.bold,
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.text,
    },
    reviewStars: {
        flexDirection: "row",
    },
    reviewComment: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
    },
    offeringCard: {
        backgroundColor: Theme.COLORS.accent,
        padding: Theme.SPACING.sm,
        borderRadius: 12,
        marginBottom: Theme.SPACING.xs,
    },
    offeringType: {
        fontSize: Theme.FONTS.sizes.body,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.background,
        marginBottom: 4,
    },
    offeringDetails: {
        backgroundColor: Theme.COLORS.card,
        padding: Theme.SPACING.sm,
        borderRadius: 12,
        marginTop: Theme.SPACING.xs,
    },
    offeringInfo: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
        marginBottom: 2,
    },
    hintText: {
        fontSize: Theme.FONTS.sizes.small,
        color: Theme.COLORS.textSecondary,
        marginTop: Theme.SPACING.xs,
        marginLeft: Theme.SPACING.xs,
        fontStyle: "italic",
    },
    serviceBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Theme.COLORS.accent,
        paddingHorizontal: Theme.SPACING.sm,
        paddingVertical: Theme.SPACING.xs,
        borderRadius: 20,
        marginRight: Theme.SPACING.xs,
        marginBottom: Theme.SPACING.xs,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
    },
    offeringHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: Theme.SPACING.xs,
    },
});

