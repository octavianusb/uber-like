import {
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    View,
    Text,
    Image,
    TextInput,
    Platform,
    Keyboard,
} from "react-native";
import React from "react";

import { InputFieldProps } from "@/types/type";

const InputFiled = ({
    label,
    labelStyle,
    icon,
    secureTextEntry = false,
    containerStyle,
    inputStyle,
    iconStyle,
    className,
    ...props
}: InputFieldProps) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="my-2 w-full">
                    <Text
                        className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}
                    >
                        {label}
                    </Text>

                    <View
                        className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full ${containerStyle}`}
                        focusable
                    >
                        {icon && (
                            <Image
                                source={icon}
                                className={`size-6 ml-4 absolute ${iconStyle}`}
                            />
                        )}
                        <TextInput
                            className={`rounded-full p-4 font-JakartaSemiBold flex-1 text-left text-[15px] pl-12
                                border border-neutral-200 focus:border-primary-500 ${inputStyle}`}
                            secureTextEntry={secureTextEntry}
                            {...props}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default InputFiled;
