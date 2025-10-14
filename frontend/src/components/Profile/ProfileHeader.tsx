import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { profileStyles as styles } from '@/src/theme/profileStyles';

export interface ProfileHeaderProps {
    name: string;
    email: string;
    profileImage?: ImageSourcePropType;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, profileImage }) => {
    return (
        <View style={styles.header}>
            {profileImage && <Image source={profileImage} style={styles.profileImage} />}
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
        </View>
    );
};






// import React from 'react';
// import { View, Text, Image, ImageSourcePropType } from 'react-native';
// import { profileStyles as styles } from '@/src/theme/profileStyles';
// import { ICONS } from '@/src/constants/icons';
// import { Ionicons } from '@expo/vector-icons';
//
// type Props = {
//     name: string;
//     email: string;
//     profileImage?: ImageSourcePropType;
//     onEditUser: () => void;
// };
//
// export default function ProfileHeader({ name, email, profileImage, onEditUser }: Props) {
//     return (
//         <View style={styles.header}>
//             {profileImage && <Image source={profileImage} style={styles.profileImage} />}
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <Text style={styles.name}>{name}</Text>
//                 {onEditUser && (
//                     <TouchableOpacity onPress={onEditUser} style={{ marginLeft: 8 }}>
//                         <Ionicons name={ICONS.edit} size={18} color="#555" />
//                     </TouchableOpacity>
//                 )}
//             </View>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <Text style={styles.email}>{email}</Text>
//                 {onEditUser && (
//                     <TouchableOpacity onPress={onEditUser} style={{ marginLeft: 8 }}>
//                         <Ionicons name={ICONS.edit} size={16} color="#555" />
//                     </TouchableOpacity>
//                 )}
//             </View>
//         </View>
//     );
// }


