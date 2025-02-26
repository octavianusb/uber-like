import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import * as NavigationBar from "expo-navigation-bar";
import "react-native-get-random-values";

const Home = () => {
    const { isSignedIn } = useAuth();

    const changeNavBarVisibility = async () => {
        await NavigationBar.setPositionAsync("absolute");
        await NavigationBar.setBackgroundColorAsync("#ffffff00");
    };

    useEffect(() => {
        changeNavBarVisibility();
    });

    if (isSignedIn) {
        return <Redirect href={"/(root)/(tabs)/home"} />;
    }

    return <Redirect href="/(auth)/welcome" />;
};

export default Home;
