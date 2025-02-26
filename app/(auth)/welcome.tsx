import { useRef, useState } from "react";
import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

import CustomButton from "@/components/CustomButton";
import SwiperDot from "@/components/SwiperDot";
import { welcomeArray } from "@/constants";

const Welcome = () => {
    const swiperRef = useRef<Swiper>(null);
    const [activeindex, setActiveIndex] = useState(0);
    const isLastSlide = activeindex === welcomeArray.length - 1;

    const handlePressNext = () => {
        if (isLastSlide) {
            router.replace("/(auth)/sign-up");
        } else {
            swiperRef.current?.scrollBy(1);
        }
    };

    return (
        <SafeAreaView className="flex items-center justify-between h-full bg-white p-2">
            <TouchableOpacity
                onPress={() => router.replace("/(auth)/sign-up")}
                className="w-full flex justify-center items-end p-5"
            >
                <Text className="text-black text-md font-JakartaBold">
                    Skip
                </Text>
            </TouchableOpacity>

            <Swiper
                ref={swiperRef}
                loop={false}
                dot={<SwiperDot />}
                activeDot={<SwiperDot variant="primary" />}
                onIndexChanged={(index) => setActiveIndex(index)}
            >
                {welcomeArray.map((item) => (
                    <View
                        className="flex flex-col items-center justify-center p-5"
                        key={item.id}
                    >
                        <Image
                            source={item.image}
                            className="w-full h-[300px]"
                            resizeMode="contain"
                        />
                        <View className="flex flex-row items-center w-full mt-10 justify-center">
                            <Text className="text-black text-3xl font-bold mx-10 text-center font-JakartaBold">
                                {item.title}
                            </Text>
                        </View>
                        <Text className="text-lg text-center font-JakartaSemiBold text-[#858585] mx-10 mt-3">
                            {item.description}
                        </Text>
                    </View>
                ))}
            </Swiper>

            <CustomButton
                onPress={handlePressNext}
                title={isLastSlide ? "Get Started" : "Next"}
                bgVariant="primary"
                className="w-9/12 mt-10"
            />
        </SafeAreaView>
    );
};

export default Welcome;
