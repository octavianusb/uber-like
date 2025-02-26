import React from "react";
import { View } from "react-native";

import { ButtonProps } from "@/types/type";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
    switch (variant) {
        case "primary":
            return "bg-[#0286ff]";
        case "secondary":
            return "bg-grey-500";
        case "danger":
            return "bg-red-500";
        case "success":
            return "bg-green-500";
        case "outline":
            return "bg-transparent border-[0.5px] border-neutral-300";
        default:
            return "bg-[#e2e8f0]";
    }
};

type SwiperDotProps = {
    variant?: ButtonProps["bgVariant"];
};

const SwiperDot = ({ variant }: SwiperDotProps) => {
    return (
        <View
            className={`w-[32px] h-[4px] mx-1 ${getBgVariantStyle(variant)}  rounded-full`}
        />
    );
};

export default SwiperDot;
