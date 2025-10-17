import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TextInput, Pressable } from "react-native";
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
                                    profile.offerings.map((o: any) => (
                                        <View key={o.id} style={styles.serviceBadge}>
                                            <Text style={styles.serviceText}>{o.offering_type}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.infoText}>No services offered</Text>
                                )}
                            </View>
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
    serviceBadge: {
        backgroundColor: Theme.COLORS.accent,
        paddingHorizontal: Theme.SPACING.sm,
        paddingVertical: Theme.SPACING.xs,
        borderRadius: 20,
        marginRight: Theme.SPACING.xs,
        marginBottom: Theme.SPACING.xs,
    },
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
});






// import React, { useEffect, useState} from "react";
// import {View, Text, Image, FlatList, StyleSheet, TextInput, Pressable} from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { Theme } from "@/src/theme/theme";
// import { AppStackParams } from "@/src/types/types";
// import ScreenWrapper from "@/src/components/ScreenWrapper";
// import { useProfiles } from "@/src/hooks/useProfiles";
// import { useLocations } from "@/src/hooks/useLocations";
// import { useReviews} from "@/src/hooks/useReviews";
// import { getFullPhotoUri } from "@/src/utils/getFullPhotoUri";
// import { ICONS } from "@/src/constants/icons";
// import { Ionicons } from "@expo/vector-icons";
// import {Loading} from "@/src/components/Loading";
// import {loadSittersFromStorage, saveSittersToStorage} from "@/src/utils/storage";
// import {useUsers} from "@/src/hooks/useUsers";
//
// type Props = NativeStackScreenProps<AppStackParams, "SitterScreen">;
//
// export default function SitterScreen({ route }: Props) {
//     const { sitterId } = route.params;
//     const { user, loadStoredUser } = useUsers();
//     const { getProfileById } = useProfiles();
//     const { getLocations } = useLocations();
//     const { createReview } = useReviews();
//
//     const [profile, setProfile] = useState<any>(null);
//     const [location, setLocation] = useState<any>(null);
//     const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
//     const [submittingReview, setSubmittingReview] = useState(false);
//
//     useEffect(() => { (async () => { await loadStoredUser(); })(); }, [loadStoredUser]);
//     useEffect(() => {
//         (async () => {
//             try {
//                 const offlineSitters = await loadSittersFromStorage();
//
//                 if (offlineSitters?.length) {
//                     const cachedSitter = offlineSitters.find((s: any) => s.id === sitterId);
//                     if (cachedSitter) {
//                         setProfile(cachedSitter.__rawProfile);
//                     }
//                 }
//
//                 const fetchedProfile = await getProfileById(sitterId);
//
//                 setProfile(fetchedProfile);
//
//                 const allLocations = await getLocations();
//                 const userLocation = allLocations.find(
//                     (loc: any) => loc.user?.id === fetchedProfile.user_id
//                 );
//                 setLocation(userLocation);
//
//                 if (offlineSitters) {
//                     const updated = offlineSitters.map((s: any) =>
//                         s.id === sitterId
//                             ? { ...s, __rawProfile: fetchedProfile }
//                             : s
//                     );
//                     await saveSittersToStorage(updated);
//                 }
//             } catch (err) {
//                 console.error("Error fetching sitter details:", err);
//             }
//         })();
//     }, [sitterId, getProfileById, getLocations]);
//
//     console.log(user)
//     const handleSubmitReview = async () => {
//         if (!user || !newReview.rating || !newReview.comment.trim()) return;
//         try {
//             setSubmittingReview(true);
//
//             const payload = {
//                 profile_id: profile.id,
//                 user_id: user.id,
//                 rating: newReview.rating,
//                 comment: newReview.comment,
//             }
//             const create = await createReview(payload);
//             console.log("create", create);
//
//             const updatedProfile = await getProfileById(profile.id);
//             setProfile(updatedProfile);
//
//             setNewReview({ rating: 0, comment: '' });
//         } catch (err) {
//             console.error('Error submitting review:', err);
//         } finally {
//             setSubmittingReview(false);
//         }
//     };
//
//
//     if (!profile) return <Loading />;
//
//     const fullPhotoUri = getFullPhotoUri(profile?.profile_photo);
//     const averageRating =
//         profile.reviews?.length > 0
//             ? (
//                 profile.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
//                 profile.reviews.length
//             ).toFixed(1)
//             : "N/A";
//
//     return (
//         <ScreenWrapper style={{ backgroundColor: Theme.COLORS.background }} scrollable={false}>
//             <FlatList
//                 data={profile.reviews || []}
//                 keyExtractor={(item) => item.id.toString()}
//                 ListHeaderComponent={
//                     <View style={{ marginBottom: Theme.SPACING.page }}>
//                         {/* Photo Section */}
//                         <View style={styles.heroContainer}>
//                             <Image source={fullPhotoUri ? { uri: fullPhotoUri } : require("@/assets/images/avatar.jpg")} style={styles.heroImage} />
//                             <View style={styles.heroOverlay}>
//                                 <Text style={styles.name}>{profile?.user?.name || "Unknown"}</Text>
//                                 <View style={styles.ratingContainer}>
//                                     <Ionicons name={ICONS.star} size={Theme.FONTS.sizes.medium} color={Theme.COLORS.yellow} />
//                                     <Text style={styles.ratingText}>{averageRating}</Text>
//                                     <Text style={styles.ratingCount}>({profile.reviews?.length || 0} reviews)</Text>
//                                 </View>
//                             </View>
//                         </View>
//
//                         {/* Info Cards */}
//                         <View style={styles.infoCard}>
//                             <Text style={styles.infoTitle}>Experience</Text>
//                             <Text style={styles.infoText}>{profile.experience || "No experience info"}</Text>
//                         </View>
//
//                         <View style={styles.infoCard}>
//                             <Text style={styles.infoTitle}>Location</Text>
//                             <Text style={styles.infoText}>{location?.full_address || location?.city || "Not available"}</Text>
//                         </View>
//
//                         <View style={styles.infoCard}>
//                             <Text style={styles.infoTitle}>Bio</Text>
//                             <Text style={styles.infoText}>{profile.bio || "No bio available"}</Text>
//                         </View>
//
//                         {/* Services */}
//                         <View style={styles.infoCard}>
//                             <Text style={styles.infoTitle}>Services</Text>
//                             <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: Theme.SPACING.xs }}>
//                                 {profile.offerings?.length > 0 ? (
//                                     profile.offerings.map((o: any) => (
//                                         <View key={o.id} style={styles.serviceBadge}>
//                                             <Text style={styles.serviceText}>{o.offering_type}</Text>
//                                         </View>
//                                     ))
//                                 ) : (
//                                     <Text style={styles.infoText}>No services offered</Text>
//                                 )}
//                             </View>
//                         </View>
//
//                         {/* Reviews Header */}
//                         <Text style={styles.sectionHeader}>Reviews</Text>
//                         <View style={styles.reviewForm}>
//                             <Text style={styles.infoTitle}>Leave a Review</Text>
//
//                             {/* Rating input (simplest: 1-5 stars) */}
//                             <View style={{ flexDirection: 'row', marginBottom: Theme.SPACING.sm }}>
//                                 {[1,2,3,4,5].map((star) => (
//                                     <Ionicons
//                                         key={star}
//                                         name={ICONS.star}
//                                         size={24}
//                                         color={star <= newReview.rating ? Theme.COLORS.yellow : Theme.COLORS.card}
//                                         onPress={() => setNewReview(prev => ({ ...prev, rating: star }))}
//                                         style={{ marginRight: 4 }}
//                                     />
//                                 ))}
//                             </View>
//
//                             {/* Comment input */}
//                             <TextInput
//                                 style={styles.textInput}
//                                 placeholder="Write your review..."
//                                 value={newReview.comment}
//                                 onChangeText={(text) => setNewReview(prev => ({ ...prev, comment: text }))}
//                             />
//
//                             {/* Submit button */}
//                             <Pressable
//                                 style={styles.submitButton}
//                                 onPress={handleSubmitReview}
//                                 disabled={submittingReview || !user || newReview.rating === 0 || !newReview.comment.trim()}
//                             >
//                                 <Text style={styles.submitButtonText}>
//                                     {submittingReview ? 'Submitting...' : 'Submit Review'}
//                                 </Text>
//                             </Pressable>
//                         </View>
//
//                     </View>
//                 }
//                 renderItem={({ item }) => (
//                     <View style={styles.reviewCard}>
//                         <View style={{ flexDirection: "row", alignItems: "center", marginBottom: Theme.SPACING.xs }}>
//                             <Text style={styles.reviewUser}>{item.user?.name || `User ${item.user_id}`}</Text>
//                             <Ionicons name={ICONS.star} size={Theme.FONTS.sizes.body} color={Theme.COLORS.yellow} style={{ marginLeft: Theme.SPACING.xs }} />
//                             <Text style={styles.reviewRating}>{item.rating}</Text>
//                         </View>
//                         <Text style={styles.reviewComment}>{item.comment}</Text>
//                     </View>
//                 )}
//                 contentContainerStyle={{ padding: Theme.SPACING.page }}
//
//             />
//         </ScreenWrapper>
//     );
// }
//
// const styles = StyleSheet.create({
//     heroContainer: {
//         position: "relative",
//         marginBottom: Theme.SPACING.section,
//     },
//     heroImage: {
//         width: "100%",
//         height: 250,
//         borderRadius: 16,
//     },
//     heroOverlay: {
//         position: "absolute",
//         bottom: Theme.SPACING.sm,
//         left: Theme.SPACING.sm,
//         right: Theme.SPACING.sm,
//         backgroundColor: Theme.COLORS.overlayBackground,
//         padding: Theme.SPACING.sm,
//         borderRadius: 12,
//     },
//     name: {
//         fontSize: Theme.FONTS.sizes.title,
//         fontWeight: Theme.FONTS.weights.bold,
//         color: Theme.COLORS.background,
//     },
//     ratingContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: Theme.SPACING.xs
//     },
//     ratingText: {
//         color: Theme.COLORS.yellow,
//         fontWeight: Theme.FONTS.weights.bold,
//         marginLeft: 4
//     },
//     ratingCount: {
//         color: Theme.COLORS.background,
//         marginLeft: Theme.SPACING.xs
//     },
//     infoCard: {
//         backgroundColor: Theme.COLORS.card,
//         padding: Theme.SPACING.section,
//         borderRadius: 12,
//         marginBottom: Theme.SPACING.section,
//     },
//     infoTitle: {
//         fontWeight: Theme.FONTS.weights.bold,
//         fontSize: Theme.FONTS.sizes.body,
//         marginBottom: Theme.SPACING.xs,
//         color: Theme.COLORS.text,
//     },
//     infoText: {
//         fontSize: Theme.FONTS.sizes.body,
//         color: Theme.COLORS.textSecondary
//     },
//     serviceBadge: {
//         backgroundColor: Theme.COLORS.accent,
//         paddingHorizontal: Theme.SPACING.sm,
//         paddingVertical: Theme.SPACING.xs,
//         borderRadius: 20,
//         marginRight: Theme.SPACING.xs,
//         marginBottom: Theme.SPACING.xs,
//     },
//     serviceText: {
//         color: Theme.COLORS.background,
//         fontSize: Theme.FONTS.sizes.body
//     },
//     sectionHeader: {
//         fontSize: Theme.FONTS.sizes.subtitle,
//         fontWeight: Theme.FONTS.weights.bold,
//         marginBottom: Theme.SPACING.sm,
//         color: Theme.COLORS.text,
//     },
//     reviewCard: {
//         backgroundColor: Theme.COLORS.card,
//         borderRadius: 12,
//         padding: Theme.SPACING.sm,
//         marginBottom: Theme.SPACING.sm,
//     },
//     reviewUser: {
//         fontWeight: Theme.FONTS.weights.bold,
//         fontSize: Theme.FONTS.sizes.body,
//         color: Theme.COLORS.text,
//     },
//     reviewRating: {
//         fontSize: Theme.FONTS.sizes.body,
//         marginLeft: Theme.SPACING.xs,
//         fontWeight: Theme.FONTS.weights.bold,
//         color: Theme.COLORS.yellow
//     },
//     reviewComment: {
//         fontSize: Theme.FONTS.sizes.body,
//         color: Theme.COLORS.textSecondary
//     },
//     reviewForm: {
//         backgroundColor: Theme.COLORS.card,
//         padding: Theme.SPACING.section,
//         borderRadius: 12,
//         marginBottom: Theme.SPACING.page,
//     },
//     textInput: {
//         borderWidth: 1,
//         borderColor: Theme.COLORS.textSecondary,
//         borderRadius: 8,
//         padding: Theme.SPACING.sm,
//         fontSize: Theme.FONTS.sizes.body,
//         marginBottom: Theme.SPACING.sm,
//         color: Theme.COLORS.text,
//     },
//     submitButton: {
//         backgroundColor: Theme.COLORS.primary,
//         padding: Theme.SPACING.sm,
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     submitButtonText: {
//         color: Theme.COLORS.background,
//         fontWeight: Theme.FONTS.weights.bold,
//     },
// });
