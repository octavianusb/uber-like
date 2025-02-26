import React, { useState } from "react";
import ReactNativeModal from "react-native-modal";
import {
    Image,
    ScrollView,
    Text,
    View,
    TextInput,
    Button,
    Alert,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";

import CustomButton from "@/components/CustomButton";
import InputFiled from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { images, icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [verification, setVerification] = useState({
        state: "default",
        code: "",
        error: "",
    });

    const handleSignUpPress = async () => {
        if (!isLoaded) return;

        try {
            await signUp.create({
                emailAddress: values.email,
                password: values.password,
            });

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setVerification((prev) => ({ ...prev, state: "pending" }));
        } catch (err) {
            Alert.alert("Error", err?.errors[0]?.longMessage);
            console.error(JSON.stringify(err, null, 2));
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded) return;

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            });

            if (signUpAttempt.status === "complete") {
                // TODO: Create a database record for the user
                await fetchAPI("/(api)/user", {
                    method: "POST",
                    body: JSON.stringify({
                        name: values.name,
                        email: values.email,
                        clerkId: signUpAttempt.createdUserId,
                    }),
                });
                await setActive({ session: signUpAttempt.createdSessionId });
                setVerification((prev) => ({
                    ...prev,
                    state: "success",
                }));
            } else {
                setVerification((prev) => ({
                    ...prev,
                    state: "failed",
                    error: "Verification failed",
                }));
            }
        } catch (err) {
            Alert.alert("Error", err?.errors[0]?.longMessage);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image
                        source={images.signUpCar}
                        className="z-0 w-full h-[250px]"
                    />
                    <Text className="absolute bottom-5 left-5 text-black text-2xl font-JakartaSemiBold">
                        Create your account
                    </Text>
                </View>

                <View className="p-5">
                    <InputFiled
                        label="Name"
                        labelStyle="text-black"
                        placeholder="Enter your name"
                        icon={icons.person}
                        value={values.name}
                        onChangeText={(name) =>
                            setValues((prev) => ({ ...prev, name }))
                        }
                    />
                    <InputFiled
                        label="Email"
                        labelStyle="text-black"
                        placeholder="Enter your email"
                        icon={icons.email}
                        value={values.email}
                        onChangeText={(email) =>
                            setValues((prev) => ({ ...prev, email }))
                        }
                    />
                    <InputFiled
                        label="Password"
                        labelStyle="text-black"
                        placeholder="Enter your password"
                        icon={icons.lock}
                        value={values.password}
                        secureTextEntry
                        onChangeText={(password) =>
                            setValues((prev) => ({ ...prev, password }))
                        }
                    />

                    <CustomButton
                        title="Sign Up"
                        onPress={handleSignUpPress}
                        className="mt-6"
                    />

                    <OAuth />

                    <Link
                        href="/sign-in"
                        className="text-lg text-center text-general-200 mt-10"
                    >
                        <Text>Already have an account? </Text>
                        <Text className="text-primary-500">Log In</Text>
                    </Link>

                    {/* Verification modal */}
                    <ReactNativeModal
                        isVisible={verification.state === "pending"}
                        onModalHide={() =>
                            setVerification((prev) => ({
                                ...prev,
                                state: "success",
                            }))
                        }
                    >
                        <View className="bg-white px-8 py-9 rounded-2xl min-h-[300px]">
                            <Text className="text-2xl font-JakartaExtraBold mb-2 placeholder:color-gray-300">
                                Verification
                            </Text>
                            <Text className="text-base text-gray-400 mb-5 font-Jakarta">
                                We've sent a verification code to {values.email}
                            </Text>

                            <InputFiled
                                label="Code"
                                icon={icons.lock}
                                value={verification.code}
                                placeholder="123456"
                                keyboardType="numeric"
                                onChangeText={(code) =>
                                    setVerification((prev) => ({
                                        ...prev,
                                        code,
                                    }))
                                }
                            />
                            {verification.error && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {verification.error}
                                </Text>
                            )}

                            <CustomButton
                                title="Verify email"
                                onPress={onVerifyPress}
                                className="mt-5 bg-success-500"
                            />
                        </View>
                    </ReactNativeModal>

                    <ReactNativeModal
                        isVisible={verification.state === "success"}
                    >
                        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                            <Image
                                source={images.check}
                                className="w-[110px] h-[110px] mx-auto my-5"
                            />
                            <Text className="text-3xl font-JakartaBold text-center">
                                Verified
                            </Text>
                            <Text className="text-base text-center text-gray-400 mt-2 font-Jakarta">
                                You successfully verified your account.
                            </Text>
                            <CustomButton
                                title="Browse Home"
                                onPress={() => {
                                    setVerification((prev) => ({
                                        ...prev,
                                        state: "default",
                                    }));
                                    router.push("/(root)/(tabs)/home");
                                }}
                                className="mt-5"
                            />
                        </View>
                    </ReactNativeModal>
                </View>
            </View>
        </ScrollView>
    );
};

export default SignUp;
