import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { searchPosts } from "../../lib/appwrite";
import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";

// Search screen
const Search = () => {
  const { query } = useLocalSearchParams();

  // Fetch searched posts using useAppwrite hook
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

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
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput
                  initialQuery={query}
                  refetch={refetch}
                  placeholder="Search a video topic"
                />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
            btnText="Back to Explore"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
