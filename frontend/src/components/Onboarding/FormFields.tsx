import React from "react";
import { View } from "react-native";
import { FormInput } from "@/src/components/FormInput";

type Props = {
    bio: string;
    setBio: (text: string) => void;
    experience: string;
    setExperience: (text: string) => void;
    phone: string;
    setPhone: (text: string) => void;
    availability: string;
    setAvailability: (text: string) => void;
};

export default function FormFields({
                                              bio, setBio,
                                              experience, setExperience,
                                              phone, setPhone,
                                              availability, setAvailability
                                          }: Props) {
    return (
        <View>
            <FormInput label="Bio" value={bio} onChange={setBio} placeholder="Tell us about yourself" />
            <FormInput label="Experience" value={experience} onChange={setExperience} placeholder="Your experience with pets" />
            <FormInput label="Phone" value={phone} onChange={setPhone} placeholder="Your phone number" keyboardType="phone-pad" />
            <FormInput label="Availability" value={availability} onChange={setAvailability} placeholder="e.g. Weekdays 9–5" />
        </View>
    );
}
