import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import ScreenWrapper from '@/src/components/ScreenWrapper';
import { Theme } from '@/src/theme/theme';
import { ProfileHeader } from '@/src/components/Profile/ProfileHeader';
import ProfileCard from '@/src/components/Profile/ProfileCard';
import ProfileButton from '@/src/components/Profile/ProfileButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams, Offering, User } from '@/src/types/types';
import { useAuth } from '@/src/hooks/useAuth';
import ProfileEditModal from '@/src/components/Profile/ProfileEditModal';
import UserEditModal from '@/src/components/Profile/UserEditModal';
import { useProfiles } from '@/src/hooks/useProfiles';
import { Loading } from '@/src/components/Loading';
import { useUsers } from '@/src/hooks/useUsers';
import OfferingCreateModal from '@/src/components/Profile/OfferingCreateModal';
import OfferingEditModal from '@/src/components/Profile/OfferingEditModal';
import OfferingEditDetailModal from '@/src/components/Profile/OfferingEditDetailModal'; // new modal
import { useOfferings } from '@/src/hooks/useOfferings';
import { saveUserToStorage } from '@/src/utils/storage';
import { getFullPhotoUri } from '@/src/utils/getFullPhotoUri';

export default function SitterProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParams>>();
  const { logout } = useAuth();
  const { user, setUser, fetchUserById, loadStoredUser } = useUsers();
  const { profile, getProfileById, loading } = useProfiles();
  const {
    data: offeringsData,
    setData: setOfferings,
    createOffering,
    updateOffering,
    deleteOffering,
  } = useOfferings();

  const [modalVisible, setModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const [createOfferingModalVisible, setCreateOfferingModalVisible] = useState(false);
  const [editOfferingsModalVisible, setEditOfferingsModalVisible] = useState(false);
  const [offeringEditDetailModalVisible, setOfferingEditDetailModalVisible] = useState(false);

  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      await loadStoredUser();
    })();
  }, [loadStoredUser]);
  useEffect(() => {
    (async () => {
      if (!user?.profile?.id) return;
      const prof = await getProfileById(user.profile.id);
      if (prof.offerings) setOfferings(prof.offerings);
    })();
  }, [user, getProfileById]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.id) await fetchUserById(user.id);
    if (user?.profile?.id) await getProfileById(user.profile.id);
    setRefreshing(false);
  };

  const handleDeleteOffering = async (offering: Offering) => {
    if (!user?.id) return;
    Alert.alert('Delete Offering', `Are you sure you want to delete "${offering.offering_type}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteOffering(offering.id);
            const updatedUser = await fetchUserById(user.id);

            setUser(updatedUser);
            await saveUserToStorage(updatedUser);

            if (updatedUser.profile?.offerings) {
              setOfferings(updatedUser.profile.offerings);
            }
          } catch (err) {
            console.warn('Failed to delete offering:', err);
          }
        },
      },
    ]);
  };
  const handleCreateOffering = async (data: any) => {
    if (!user?.id || !user?.profile?.id) return;

    try {
      await createOffering({ ...data, profile_id: user.profile.id });

      const updatedUser = await fetchUserById(user.id);

      setUser(updatedUser);
      await saveUserToStorage(updatedUser);

      if (updatedUser.profile?.offerings) {
        setOfferings(updatedUser.profile.offerings);
      }
    } catch (err) {
      console.warn('Failed to create offering:', err);
    } finally {
      setCreateOfferingModalVisible(false);
    }
  };

  const handleEditOffering = async (data: any) => {
    if (!user?.id || !selectedOffering) return;

    try {
      await updateOffering(selectedOffering.id, data);

      const updatedUser = await fetchUserById(user.id);

      setUser(updatedUser);
      await saveUserToStorage(updatedUser);

      if (updatedUser.profile?.offerings) {
        setOfferings(updatedUser.profile.offerings);
      }
    } catch (err) {
      console.warn('Failed to update offering:', err);
    } finally {
      setOfferingEditDetailModalVisible(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({ index: 0, routes: [{ name: 'WelcomeScreen' }] });
    } catch (err) {
      console.warn('Logout failed', err);
    }
  };

  if (loading || !user) return <Loading />;

  const profilePhotoUri = getFullPhotoUri(profile?.profile_photo);

  return (
    <ScreenWrapper
      style={{ backgroundColor: Theme.COLORS.background }}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <ProfileHeader
        name={user.name || 'unknown'}
        email={user.email || 'No email'}
        profileImage={
          profilePhotoUri ? { uri: profilePhotoUri } : require('@/assets/images/avatar.jpg')
        }
      />

      <ProfileButton
        text="Edit Personal Info"
        type="primary"
        onPress={() => setUserModalVisible(true)}
      />
      <ProfileCard title="Bio" content={profile?.bio || 'No bio yet'} />
      <ProfileCard title="Experience" content={profile?.experience || 'No experience info'} />
      <ProfileCard title="Availability" content={profile?.availability || 'No availability set'} />
      <ProfileCard title="Phone" content={profile?.phone || 'No phone number'} />
      <ProfileButton text="Edit Sitter Info" type="primary" onPress={() => setModalVisible(true)} />

      {offeringsData.length > 0 ? (
        offeringsData.map((offering: Offering) => (
          <ProfileCard
            key={offering.id}
            title={offering.offering_type || 'Unnamed Offering'}
            content={`Price: $${offering.price}${offering.duration ? ` / ${offering.duration} min` : ''}\n${offering.conditions?.join(', ') || ''}`}
            onPress={() => {
              setSelectedOffering(offering);
              setOfferingEditDetailModalVisible(true);
            }}
          />
        ))
      ) : (
        <ProfileCard key="no-offerings" title="Offerings" content="No offerings added yet" />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ProfileButton
          text="Add Offering"
          type="primary"
          onPress={() => {
            setSelectedOffering(null);
            setCreateOfferingModalVisible(true);
          }}
        />
        <ProfileButton
          text="Edit Offering"
          type="secondary"
          onPress={() => setEditOfferingsModalVisible(true)}
        />
      </View>

      <ProfileButton text="Logout" type="secondary" onPress={handleLogout} />

      {/* Modals */}
      {modalVisible && (
        <ProfileEditModal
          visible={modalVisible}
          profileData={profile}
          onClose={() => setModalVisible(false)}
          onProfileUpdated={async () => {
            if (user?.profile?.id) await getProfileById(user.profile.id);
          }}
        />
      )}
      {userModalVisible && (
        <UserEditModal
          visible={userModalVisible}
          userData={user}
          onClose={() => setUserModalVisible(false)}
          onUserUpdated={async () => {
            if (user?.id) await fetchUserById(user.id);
          }}
        />
      )}
      {createOfferingModalVisible && (
        <OfferingCreateModal
          visible={createOfferingModalVisible}
          existingOfferings={offeringsData}
          onClose={() => setCreateOfferingModalVisible(false)}
          onOfferingSaved={handleCreateOffering}
        />
      )}
      {editOfferingsModalVisible && (
        <OfferingEditModal
          visible={editOfferingsModalVisible}
          offerings={offeringsData}
          onClose={() => setEditOfferingsModalVisible(false)}
          onSelectOffering={(offering) => {
            setSelectedOffering(offering);
            setOfferingEditDetailModalVisible(true);
            setEditOfferingsModalVisible(false);
          }}
          onDeleteOffering={handleDeleteOffering}
        />
      )}
      {offeringEditDetailModalVisible && selectedOffering && (
        <OfferingEditDetailModal
          visible={offeringEditDetailModalVisible}
          offering={selectedOffering}
          existingOfferings={offeringsData}
          onClose={() => setOfferingEditDetailModalVisible(false)}
          onOfferingSaved={handleEditOffering}
        />
      )}
    </ScreenWrapper>
  );
}
