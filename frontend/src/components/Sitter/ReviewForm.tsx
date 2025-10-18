import React from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/src/theme/theme";
import { ICONS } from "@/src/constants/icons";

interface ReviewFormProps {
    rating: number;
    comment: string;
    onChangeRating: (star: number) => void;
    onChangeComment: (text: string) => void;
    onSubmit: () => void;
    submitting: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ rating, comment, onChangeRating, onChangeComment, onSubmit, submitting }) => (
    <View style={styles.form}>
        <Text style={styles.header}>Leave a Review</Text>

        <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => onChangeRating(star)}>
                    <Ionicons
                        name={ICONS.star}
                        size={32}
                        color={star <= rating ? Theme.COLORS.yellow : Theme.COLORS.textSecondary}
                        style={{ marginHorizontal: 4 }}
                    />
                </Pressable>
            ))}
        </View>

        <TextInput
            style={styles.input}
            placeholder="Write your review..."
            placeholderTextColor={Theme.COLORS.textSecondary}
            value={comment}
            onChangeText={onChangeComment}
            multiline
        />

        <Pressable
            style={[styles.submit, (submitting || !rating || !comment.trim()) && { opacity: 0.6 }]}
            onPress={onSubmit}
            disabled={submitting || !rating || !comment.trim()}
        >
            <Text style={styles.submitText}>{submitting ? "Submitting..." : "Submit Review"}</Text>
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    form: {
        backgroundColor: Theme.COLORS.card,
        padding: Theme.SPACING.section,
        borderRadius: 16,
        marginVertical: Theme.SPACING.page,
    },
    header: {
        fontSize: Theme.FONTS.sizes.subtitle,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.text,
        marginBottom: Theme.SPACING.sm,
    },
    starRow: { flexDirection: "row", marginBottom: Theme.SPACING.sm },
    input: {
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
    submit: {
        backgroundColor: Theme.COLORS.primary,
        paddingVertical: Theme.SPACING.sm,
        borderRadius: 12,
        alignItems: "center",
    },
    submitText: { color: Theme.COLORS.background, fontWeight: Theme.FONTS.weights.bold, fontSize: Theme.FONTS.sizes.body },
});
