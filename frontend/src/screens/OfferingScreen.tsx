import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    TextInput,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParams } from "@/src/types/types";
import { Theme } from "@/src/theme/theme";
import { useOfferings } from "@/src/hooks/useOfferings";
import { useUsers } from "@/src/hooks/useUsers";
import { Picker } from "@react-native-picker/picker";

export default function OfferingScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
    const { user } = useUsers();
    const { data: offerings, getAllOfferings, createOffering, updateOffering, deleteOffering } = useOfferings();

    const [modalVisible, setModalVisible] = useState(false);
    const [editingOffering, setEditingOffering] = useState<any | null>(null);
    const [form, setForm] = useState({
        offering_type: "dog_walking",
        price: "",
        duration: "",
        conditions: "",
    });
    const [loading, setLoading] = useState(false);

    // Load offerings on mount
    useEffect(() => {
        getAllOfferings();
    }, [getAllOfferings]);

    const openAddModal = () => {
        setEditingOffering(null);
        setForm({
            offering_type: "dog_walking",
            price: "",
            duration: "",
            conditions: "",
        });
        setModalVisible(true);
    };

    const openEditModal = (offering: any) => {
        setEditingOffering(offering);
        setForm({
            offering_type: offering.offering_type,
            price: offering.price?.toString() || "",
            duration: offering.duration?.toString() || "",
            conditions: offering.conditions ? offering.conditions.join(", ") : "",
        });
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!form.price || isNaN(Number(form.price))) {
            return Alert.alert("Error", "Please enter a valid price.");
        }

        setLoading(true);
        try {
            const payload = {
                offering_type: form.offering_type,
                price: Number(form.price),
                duration: form.duration ? Number(form.duration) : undefined,
                conditions: form.conditions ? form.conditions.split(",").map(c => c.trim()) : undefined,
                profile_id: user?.profile?.id,
            };

            if (editingOffering) {
                await updateOffering(editingOffering.id, payload);
            } else {
                await createOffering(payload);
            }
            setModalVisible(false);
        } catch (err) {
            console.warn("Error saving offering:", err);
            Alert.alert("Error", "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert("Delete offering?", "Are you sure you want to remove this service?", [
            { text: "Cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    await deleteOffering(id);
                },
            },
        ]);
    };

    const renderOffering = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.offering_type.replace("_", " ").toUpperCase()}</Text>
                <Text style={styles.cardText}>Price: ${item.price}</Text>
                {item.duration && <Text style={styles.cardText}>Duration: {item.duration} min</Text>}
                {item.conditions && item.conditions.length > 0 && (
                    <Text style={styles.cardText}>Conditions: {item.conditions.join(", ")}</Text>
                )}
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const goToProfile = () => {
        navigation.reset({ index: 0, routes: [{ name: "MainTabs", params: { screen: "Profile" } }] });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>What services do you offer?</Text>
            <Text style={styles.subtitle}>Owners will see these when requesting your help.</Text>

            <FlatList
                data={offerings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOffering}
                ListEmptyComponent={<Text style={styles.emptyText}>No services added yet.</Text>}
                contentContainerStyle={{ paddingVertical: 10 }}
            />

            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                <Text style={styles.addButtonText}>Add Service</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.continueButton} onPress={goToProfile}>
                <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>

            {/* Add / Edit Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingOffering ? "Edit Service" : "Add Service"}</Text>

                        <Picker
                            selectedValue={form.offering_type}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, offering_type: value }))}
                            style={styles.picker}
                        >
                            <Picker.Item label="Dog Walking" value="dog_walking" />
                            <Picker.Item label="Sitting" value="sitting" />
                            <Picker.Item label="Grooming" value="grooming" />
                            <Picker.Item label="Night Stay" value="night_stay" />
                        </Picker>

                        <TextInput
                            style={styles.input}
                            placeholder="Price"
                            keyboardType="numeric"
                            value={form.price}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, price: text }))}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Duration (minutes)"
                            keyboardType="numeric"
                            value={form.duration}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, duration: text }))}
                        />

                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            placeholder="Conditions (comma separated)"
                            value={form.conditions}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, conditions: text }))}
                            multiline
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: Theme.COLORS.primary }]}
                                onPress={handleSave}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>Save</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: Theme.SPACING.page },
    title: {
        fontSize: Theme.FONTS.sizes.title,
        fontWeight: Theme.FONTS.weights.bold,
        color: Theme.COLORS.primary,
        textAlign: "center",
        marginBottom: Theme.SPACING.section,
    },
    subtitle: {
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
        textAlign: "center",
        marginBottom: Theme.SPACING.section,
    },
    emptyText: { textAlign: "center", color: Theme.COLORS.textSecondary, marginTop: 20 },
    card: {
        backgroundColor: Theme.COLORS.background,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        ...Theme.SHADOWS.default,
    },
    cardTitle: { fontWeight: "bold", fontSize: Theme.FONTS.sizes.body, marginBottom: 5 },
    cardText: { fontSize: Theme.FONTS.sizes.body, color: Theme.COLORS.textSecondary },
    cardActions: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
    editText: { color: Theme.COLORS.primary, marginRight: 10 },
    deleteText: { color: Theme.COLORS.error },
    addButton: {
        backgroundColor: Theme.COLORS.primary,
        paddingVertical: 15,
        borderRadius: 10,
        marginVertical: Theme.SPACING.section,
        alignItems: "center",
    },
    addButtonText: { color: Theme.COLORS.background, fontWeight: "bold", fontSize: Theme.FONTS.sizes.body },
    continueButton: {
        backgroundColor: Theme.COLORS.secondary,
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    continueButtonText: { color: Theme.COLORS.background, fontWeight: "bold", fontSize: Theme.FONTS.sizes.body },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
    modalContent: { backgroundColor: Theme.COLORS.background, borderRadius: 10, padding: 20 },
    modalTitle: { fontWeight: "bold", fontSize: Theme.FONTS.sizes.title, marginBottom: 15, textAlign: "center" },
    input: {
        borderWidth: 1,
        borderColor: Theme.COLORS.primary,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        fontSize: Theme.FONTS.sizes.body,
        color: Theme.COLORS.textSecondary,
    },
    picker: { marginBottom: 10 },
    modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 5,
        backgroundColor: Theme.COLORS.background,
        borderWidth: 1,
        borderColor: Theme.COLORS.primary,
    },
});




// import React, { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
//     Alert,
//     Modal,
//     TextInput,
//     ActivityIndicator,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { AppStackParams } from "@/src/types/types";
// import { Theme } from "@/src/theme/theme";
// import { useOfferings } from "@/src/hooks/useOfferings";
// import { useUsers } from "@/src/hooks/useUsers";
//
// export default function OfferingScreen() {
//     const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
//     const { user } = useUsers();
//     const { data: offerings, getAllOfferings, getOfferingById, createOffering, updateOffering, deleteOffering } = useOfferings();
//
//     const [modalVisible, setModalVisible] = useState(false);
//     const [editingOffering, setEditingOffering] = useState<any | null>(null);
//     const [form, setForm] = useState({ name: "", price: "", description: "" });
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         if (user?.profile?.id) {
//             getAllOfferings();
//         }
//     }, [user, getAllOfferings]);
//
//     const openAddModal = () => {
//         setEditingOffering(null);
//         setForm({ name: "", price: "", description: "" });
//         setModalVisible(true);
//     };
//
//     const openEditModal = (offering: any) => {
//         setEditingOffering(offering);
//         setForm({
//             name: offering.name,
//             price: offering.price?.toString() || "",
//             description: offering.description || "",
//         });
//         setModalVisible(true);
//     };
//
//     const handleSave = async () => {
//         if (!form.name.trim()) return Alert.alert("Error", "Service name is required.");
//         setLoading(true);
//         try {
//             if (editingOffering) {
//                 await updateOffering(editingOffering.id, form);
//             } else {
//                 await createOffering({ ...form, profile_id: user?.profile?.id });
//             }
//             await getOfferingById(user!.profile!.id); // refresh
//             setModalVisible(false);
//         } catch (err) {
//             console.warn("Error saving offering:", err);
//             Alert.alert("Error", "Something went wrong.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleDelete = (id: number) => {
//         Alert.alert("Delete offering?", "Are you sure you want to remove this service?", [
//             { text: "Cancel" },
//             {
//                 text: "Delete",
//                 style: "destructive",
//                 onPress: async () => {
//                     if (!user?.profile?.id) return;
//                     await deleteOffering(id);
//                     await getOfferingById(user.profile.id);
//                 },
//             },
//         ]);
//     };
//
//     const renderOffering = ({ item }: { item: any }) => (
//         <View style={styles.card}>
//             <View style={{ flex: 1 }}>
//                 <Text style={styles.cardTitle}>{item.name}</Text>
//                 {item.price ? <Text style={styles.cardText}>Price: ${item.price}</Text> : null}
//                 {item.description ? <Text style={styles.cardText}>{item.description}</Text> : null}
//             </View>
//             <View style={styles.cardActions}>
//                 <TouchableOpacity onPress={() => openEditModal(item)}>
//                     <Text style={styles.editText}>Edit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => handleDelete(item.id)}>
//                     <Text style={styles.deleteText}>Delete</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
//
//     const goToProfile = () => {
//         navigation.reset({ index: 0, routes: [{ name: "MainTabs", params: { screen: "Profile" } }] });
//     };
//
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>What services do you offer?</Text>
//             <Text style={styles.subtitle}>Owners will see these when requesting your help.</Text>
//
//             <FlatList
//                 data={offerings}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={renderOffering}
//                 ListEmptyComponent={<Text style={styles.emptyText}>No services added yet.</Text>}
//                 contentContainerStyle={{ paddingVertical: 10 }}
//             />
//
//             <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
//                 <Text style={styles.addButtonText}>Add Offering</Text>
//             </TouchableOpacity>
//
//             <TouchableOpacity style={styles.continueButton} onPress={goToProfile}>
//                 <Text style={styles.continueButtonText}>Continue</Text>
//             </TouchableOpacity>
//
//             <Modal visible={modalVisible} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalTitle}>{editingOffering ? "Edit Service" : "Add Service"}</Text>
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Service Name"
//                             value={form.name}
//                             onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
//                         />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Price"
//                             keyboardType="numeric"
//                             value={form.price}
//                             onChangeText={(text) => setForm((prev) => ({ ...prev, price: text }))}
//                         />
//                         <TextInput
//                             style={[styles.input, { height: 80 }]}
//                             placeholder="Description"
//                             value={form.description}
//                             onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
//                             multiline
//                         />
//                         <View style={styles.modalButtons}>
//                             <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
//                                 <Text>Cancel</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={[styles.modalButton, { backgroundColor: Theme.COLORS.primary }]} onPress={handleSave}>
//                                 {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>Save</Text>}
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: { flex: 1, padding: Theme.SPACING.page },
//     title: { fontSize: Theme.FONTS.sizes.title, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
//     subtitle: { fontSize: Theme.FONTS.sizes.body, color: Theme.COLORS.textSecondary, marginBottom: 20, textAlign: "center" },
//     card: { flexDirection: "row", backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, ...Theme.SHADOWS.default },
//     cardTitle: { fontWeight: "bold", fontSize: Theme.FONTS.sizes.body },
//     cardText: { fontSize: Theme.FONTS.sizes.small, color: Theme.COLORS.textSecondary },
//     cardActions: { justifyContent: "space-around", alignItems: "flex-end" },
//     editText: { color: Theme.COLORS.primary, marginBottom: 5 },
//     deleteText: { color: Theme.COLORS.error },
//     addButton: { backgroundColor: Theme.COLORS.primary, padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
//     addButtonText: { color: "#fff", fontWeight: "bold" },
//     continueButton: { backgroundColor: Theme.COLORS.secondary, padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
//     continueButtonText: { color: "#fff", fontWeight: "bold" },
//     emptyText: { textAlign: "center", color: Theme.COLORS.textSecondary, marginTop: 20 },
//     modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
//     modalContent: { width: "90%", backgroundColor: "#fff", borderRadius: 10, padding: 20 },
//     modalTitle: { fontSize: Theme.FONTS.sizes.title, fontWeight: "bold", marginBottom: 15 },
//     input: { borderWidth: 1, borderColor: Theme.COLORS.primary, borderRadius: 10, padding: 10, marginBottom: 10, fontSize: Theme.FONTS.sizes.body },
//     modalButtons: { flexDirection: "row", justifyContent: "space-between" },
//     modalButton: { padding: 12, borderRadius: 10, alignItems: "center", flex: 1, marginHorizontal: 5, backgroundColor: "#eee" },
// });
