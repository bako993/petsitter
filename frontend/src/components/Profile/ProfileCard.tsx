import React from 'react';
import { View, Text } from 'react-native';
import { profileStyles as styles } from '@/src/theme/profileStyles';

type Props = {
  title: string;
  children?: React.ReactNode;
  content?: string;
  onPress?: () => void;
};

export default function ProfileCard({ title, children, content }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children ?? <Text style={styles.cardContent}>{content}</Text>}
    </View>
  );
}
