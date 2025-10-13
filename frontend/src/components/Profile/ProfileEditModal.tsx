import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from '@/src/theme/theme';
import { useProfiles } from '@/src/hooks/useProfiles';
import avatar from '@/assets/images/avatar.jpg';

type Props = {
    visible: boolean;
    onClose: () => void;
    profileData: any;
    onProfileUpdated?: () => void; // callback for parent
};

export default function ProfileEditModal({ visible, onClose, profileData, onProfileUpdated }: Props) {
    const { updateProfile } = useProfiles();

    const [bio, setBio] = useState(profileData.bio || '');
    const [experience, setExperience] = useState(profileData.experience || '');
    const [phone, setPhone] = useState(profileData.phone || '');
    const [availability, setAvailability] = useState(profileData.availability || '');
    const [profilePhoto, setProfilePhoto] = useState(profileData.profile_photo || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setBio(profileData.bio || '');
        setExperience(profileData.experience || '');
        setPhone(profileData.phone || '');
        setAvailability(profileData.availability || '');
        setProfilePhoto(profileData.profile_photo || null);
    }, [profileData]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0].uri) {
            setProfilePhoto(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfile(profileData.id, {
                bio,
                experience,
                phone,
                availability,
                profilePhoto,
            });

            // Refetch profile immediately
            onProfileUpdated?.();
            onClose();
        } catch (err) {
            console.warn('Error in handleSave:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <View style={[styles.container, Theme.SHADOWS.default]}>
                        <ScrollView keyboardShouldPersistTaps="handled">
                            <Text style={styles.title}>Edit Profile</Text>

                            <TouchableOpacity onPress={pickImage}>
                                <Image source={{ uri: profilePhoto || avatar }} style={styles.image} />
                                <Text style={styles.changePhoto}>Change Photo</Text>
                            </TouchableOpacity>

                            <TextInput style={styles.input} placeholder="Bio" value={bio} onChangeText={setBio} multiline />
                            <TextInput style={styles.input} placeholder="Experience" value={experience} onChangeText={setExperience} multiline />
                            <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                            <TextInput style={styles.input} placeholder="Availability" value={availability} onChangeText={setAvailability} />

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose} disabled={loading}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave} disabled={loading}>
                                    <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save'}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}






// import React, { useState, useEffect } from 'react';
// import {
//     Modal,
//     View,
//     TextInput,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     Image,
//     ScrollView,
//     TouchableWithoutFeedback,
//     Keyboard,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { Theme } from '@/src/theme/theme';
// import { useProfiles } from '@/src/hooks/useProfiles';
// import avatar from '@/assets/images/avatar.jpg';
//
// type Props = {
//     visible: boolean;
//     onClose: () => void;
//     profileData: any;
// };
//
// export default function ProfileEditModal({ visible, onClose, profileData }: Props) {
//     const { updateProfile } = useProfiles();
//
//     const [bio, setBio] = useState(profileData.bio || '');
//     const [experience, setExperience] = useState(profileData.experience || '');
//     const [phone, setPhone] = useState(profileData.phone || '');
//     const [availability, setAvailability] = useState(profileData.availability || '');
//     const [profilePhoto, setProfilePhoto] = useState(profileData.profile_photo || null);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         setBio(profileData.bio || '');
//         setExperience(profileData.experience || '');
//         setPhone(profileData.phone || '');
//         setAvailability(profileData.availability || '');
//         setProfilePhoto(profileData.profile_photo || null);
//     }, [profileData]);
//
//     const pickImage = async () => {
//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: 'images',
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 0.8,
//         });
//
//         if (!result.canceled && result.assets?.[0].uri) {
//             setProfilePhoto(result.assets[0].uri);
//         }
//     };
//
//     const handleSave = async () => {
//         console.log("➡️ Saving profile...", { bio, experience, phone, availability, profilePhoto });
//         setLoading(true);
//         try {
//             const res = await updateProfile(profileData.id, {
//                 bio,
//                 experience,
//                 phone,
//                 availability,
//                 profilePhoto: profilePhoto
//             });
//             onClose();
//         } catch (err) {
//             console.warn('Error in handleSave:', err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <Modal
//             visible={visible}
//             animationType="slide"
//             transparent
//             onRequestClose={onClose}
//         >
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                 <View style={styles.overlay}>
//                     <View style={[styles.container, Theme.SHADOWS.default]}>
//                         <ScrollView keyboardShouldPersistTaps="handled">
//                             <Text style={styles.title}>Edit Profile</Text>
//
//                             <TouchableOpacity onPress={pickImage}>
//                                 <Image
//                                     source={{ uri: profilePhoto || avatar }}
//                                     style={styles.image}
//                                 />
//                                 <Text style={styles.changePhoto}>Change Photo</Text>
//                             </TouchableOpacity>
//
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="Bio"
//                                 value={bio}
//                                 onChangeText={setBio}
//                                 multiline
//                             />
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="Experience"
//                                 value={experience}
//                                 onChangeText={setExperience}
//                                 multiline
//                             />
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="Phone"
//                                 value={phone}
//                                 onChangeText={setPhone}
//                                 keyboardType="phone-pad"
//                             />
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="Availability"
//                                 value={availability}
//                                 onChangeText={setAvailability}
//                             />
//
//                             <View style={styles.buttonRow}>
//                                 <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose} disabled={loading}>
//                                     <Text style={styles.buttonText}>Cancel</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave} disabled={loading}>
//                                     <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save'}</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </ScrollView>
//                     </View>
//                 </View>
//             </TouchableWithoutFeedback>
//         </Modal>
//     );
// }

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: Theme.COLORS.background,
        borderRadius: 20,
        width: '90%',
        maxHeight: '90%',
        padding: 20,
    },
    title: {
        fontSize: Theme.FONTS.sizes.subtitle,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.text,
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: Theme.COLORS.primary,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: Theme.COLORS.background,
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 5,
        borderWidth: 2,
        borderColor: Theme.COLORS.primary,
    },
    changePhoto: {
        textAlign: 'center',
        color: Theme.COLORS.primary,
        fontWeight: Theme.FONTS.weights.semiBold,
        marginBottom: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancel: {
        backgroundColor: Theme.COLORS.secondary
    },
    save: {
        backgroundColor: Theme.COLORS.primary
    },
    buttonText: {
        color: Theme.COLORS.background,
        fontWeight: Theme.FONTS.weights.semiBold,
        fontSize: Theme.FONTS.sizes.body,
    },
});

