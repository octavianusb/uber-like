import React from "react";
import { View, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { GoogleInputProps } from "@/types/type";
import { icons } from "@/constants";

const GoogleTextInput = ({
    icon,
    containerStyle,
    textInputBackgroundColor,
    handlePress,
    initialLocation,
}: GoogleInputProps) => {
    return (
        <View
            className={`flex flex-row items-center justify-center relative z-50 rounded-xl mb-5 ${containerStyle}`}
            style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.04)" }}
        >
            <GooglePlacesAutocomplete
                fetchDetails
                placeholder="Where you wanna go?"
                debounce={200}
                query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
                    language: "en",
                }}
                styles={{
                    textInputContainer: {
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 20,
                        marginHorizontal: 20,
                        position: "relative",
                        shadowColor: "#d4d4d4",
                    },
                    textInput: {
                        backgroundColor: textInputBackgroundColor || "white",
                        fontSize: 16,
                        fontWeight: "600",
                        marginTop: 5,
                        width: "100%",
                        borderRadius: 200,
                    },
                    listView: {
                        backgroundColor: textInputBackgroundColor || "white",
                        position: "relative",
                        top: 0,
                        width: "100%",
                        borderRadius: 10,
                        shadowColor: "#d4d4d4",
                        zIndex: 99,
                    },
                }}
                onPress={(data, details = null) =>
                    handlePress({
                        latitude: details?.geometry.location.lat!,
                        longitude: details?.geometry.location.lng!,
                        address: data.description,
                    })
                }
                renderLeftButton={() => (
                    <View className="justify-center items-center size-6">
                        <Image
                            source={icon ? icon : icons.search}
                            className="size-6"
                            resizeMode="contain"
                            alt="Search icon"
                        />
                    </View>
                )}
                textInputProps={{
                    placeholderTextColor: "gray",
                    placeholder: initialLocation ?? "Where do you want to go?",
                }}
            />
        </View>
    );
};

export default GoogleTextInput;
