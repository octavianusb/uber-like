import React, { type ReactNode, useRef } from "react";
import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import Map from "@/components/Map";
import { icons } from "@/constants";

type RideLayoutProps = {
    children: ReactNode;
    title: string;
    snapPoints?: string[];
};

const RideLayout = ({ children, title, snapPoints }: RideLayoutProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    return (
        <GestureHandlerRootView className="flex-1">
            <View className="flex-1 bg-white">
                <View className="flex flex-col h-screen bg-blue-500">
                    <View className="flex flex-row absolute z-10 top-16 items-center justify-start px-5">
                        <TouchableOpacity onPress={() => router.back()}>
                            <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                                <Image
                                    source={icons.backArrow}
                                    resizeMode="contain"
                                    className="size-6"
                                />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-xl font-JakartaSemiBold ml-5">
                            {title || "Go Back"}
                        </Text>
                    </View>

                    <Map />
                </View>

                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints || ["40%", "85%"]}
                    index={0}
                    keyboardBehavior="interactive"
                >
                    <BottomSheetView
                        style={{
                            flex: 1,
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                        }}
                    >
                        {children}
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
};

export default RideLayout;
