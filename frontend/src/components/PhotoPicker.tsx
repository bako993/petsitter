import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from '@/src/theme/theme';

interface Props {
    imageUri: string | null;
    onImagePicked: (uri: string) => void;
    placeholder?: string;
    size?: number;
}

export default function PhotoPicker({
                                        imageUri,
                                        onImagePicked,
                                        placeholder = "Add Photo",
                                        size = 120,
                                    }: Props) {
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permission required");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0].uri) {
            onImagePicked(result.assets[0].uri);
        }
    };

    return (
        <TouchableOpacity style={[styles.container, { width: size, height: size, borderRadius: size/2 }]} onPress={pickImage}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={[styles.image, { width: size, height: size, borderRadius: size/2 }]} />
            ) : (
                <View style={[styles.placeholderContainer, { width: size, height: size, borderRadius: size/2 }]}>
                    <Text style={styles.placeholder}>{placeholder}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: Theme.COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: Theme.SPACING.section,
    },
    image: {
        resizeMode: 'cover',
    },
    placeholderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.COLORS.background,
    },
    placeholder: {
        color: Theme.COLORS.textSecondary,
        textAlign: 'center',
    },
});
