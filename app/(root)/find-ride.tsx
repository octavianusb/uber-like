import { Text, View } from "react-native";

import RideLayout from "@/components/RideLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import CustomButton from "@/components/CustomButton";
import { useLocationStore } from "@/store";
import { icons } from "@/constants";
import { router } from "expo-router";

const FindRide = () => {
    const {
        userAddress,
        destinationAddress,
        setUserLocation,
        setDestinationLocation,
    } = useLocationStore();

    return (
        <RideLayout title="Ride" snapPoints={["85%"]}>
            <View className="my-3">
                <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>
                <GoogleTextInput
                    handlePress={(location) => setUserLocation(location)}
                    icon={icons.target}
                    initialLocation={userAddress!}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="#f5f5f5"
                />
            </View>

            <View className="my-3">
                <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>
                <GoogleTextInput
                    handlePress={(location) => setDestinationLocation(location)}
                    icon={icons.map}
                    initialLocation={destinationAddress!}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="transparent"
                />
            </View>

            <CustomButton
                title="Find now"
                onPress={() => router.push("/(root)/confirm-ride")}
                className="mt-5"
            />
        </RideLayout>
    );
};

export default FindRide;
