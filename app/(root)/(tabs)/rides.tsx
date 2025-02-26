import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, FlatList, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RideCard from "@/components/RideCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import type { Ride } from "@/types/type";

const Rides = () => {
    const { user } = useUser();
    const { data, loading } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

    return (
        <SafeAreaView>
            <FlatList
                data={data}
                renderItem={({ item }) => <RideCard ride={item} />}
                className="px-5"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 90 }}
                ListEmptyComponent={() => (
                    <View className="flex flex-col justify-center items-center">
                        {loading ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <>
                                <Image
                                    source={images.noResult}
                                    className="size-40"
                                    resizeMode="contain"
                                    alt="No recent rides found"
                                />
                                <Text className="text-sm">
                                    No recent rides found
                                </Text>
                            </>
                        )}
                    </View>
                )}
                ListHeaderComponent={() => (
                    <Text className="text-2xl font-JakartaBold my-5">
                        All rides 🚕
                    </Text>
                )}
            />
        </SafeAreaView>
    );
};

export default Rides;
