import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox";

// Profile screen
const Profile = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Get user from global user context
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  // Fetch posts using useAppwrite hook
  const { data: posts, refetch } = useAppwrite(() => {
    // Make sure user exists before accessing properties
    if (!user) return Promise.resolve([]);
    
    // Get user ID - check for both possible property names
    const userId = user.$id || user.id;
    
    // If we still don't have a valid userId, return empty array
    if (!userId) return Promise.resolve([]);
    
    return getUserPosts(userId);
  });

  // Handle logout
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  // Reload data on refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id || Math.random().toString()}
        renderItem={({ item }) => {
          // Safely extract creator information
          const creator = item.creator || {};
          const username = typeof creator === 'object' ? creator.username : 'Unknown User';
          const avatar = typeof creator === 'object' ? creator.avatar : 'https://ui-avatars.com/api/?name=Unknown+User';
          
          return (
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              video={item.video}
              creator={username}
              avatar={avatar}
            />
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
            btnText="Back to Explore"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
