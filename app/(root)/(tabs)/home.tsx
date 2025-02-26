import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import * as Location from "expo-location";

import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import { useFetch } from "@/lib/fetch";
import type { DestinationProps } from "@/types/home";
import { Ride } from "@/types/type";

const Home = () => {
    const {
        setUserLocation,
        setDestinationLocation,
        userLatitude,
        userLongitude,
    } = useLocationStore();
    const { user } = useUser();
    const { signOut } = useAuth();
    const [hasPermission, setHasPermission] = useState(false);
    const { data, loading } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

    const handleSignOut = async () => {
        signOut();

        router.replace("/(auth)/sign-in");
    };
    const handleDestinationPress = async (location: DestinationProps) => {
        setDestinationLocation(location);
        router.push("/(root)/find-ride");
    };

    useEffect(() => {
        const requestLoacation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setHasPermission(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync();
            let address = await Location.reverseGeocodeAsync({
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
            });

            if (address?.length > 0) {
                const locationParams = {
                    // latitude: location?.coords?.latitude,
                    // longitude: location?.coords?.longitude,
                    latitude: 37.78825,
                    longitude: -122.4324,
                    address: address[0].formattedAddress || "",
                };
                if (
                    locationParams?.latitude &&
                    locationParams?.longitude &&
                    setUserLocation
                ) {
                    setUserLocation(locationParams);
                }
            }
        };

        requestLoacation();
    }, [setUserLocation]);

    return (
        <SafeAreaView className="bg-general-500">
            <FlatList
                data={data?.slice(0, 5)}
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
                    <>
                        <View className="flex flex-row items-center justify-between my-5">
                            <Text className="text-2xl font-JakartaBold">
                                Welcome,{" "}
                                {user?.fullName ||
                                    ((user?.emailAddresses?.length ?? 0) > 0
                                        ? user?.emailAddresses[0]?.emailAddress
                                        : "")}{" "}
                                👋
                            </Text>
                            <TouchableOpacity
                                onPress={handleSignOut}
                                className="justify-center items-center size-10 rounded-full bg-white"
                            >
                                <Image source={icons.out} className="size-5" />
                            </TouchableOpacity>
                        </View>

                        <GoogleTextInput
                            icon={icons.search}
                            containerStyle="bg-white"
                            handlePress={handleDestinationPress}
                        />

                        <>
                            <Text className="text-xl font-JakartaBold mt-5 mb-3">
                                Your current location
                            </Text>
                            <View className="flex flex-row items-center bg-transparent h-[300px]">
                                <Map />
                            </View>
                        </>

                        <Text className="text-xl font-JakartaBold mt-5 mb-3">
                            Recent rides
                        </Text>
                    </>
                )}
            />
        </SafeAreaView>
    );
};

export default Home;
