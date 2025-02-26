import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View, Platform } from "react-native";

const TabIcon = ({
    focused,
    source,
}: {
    focused: boolean;
    source: ImageSourcePropType;
}) => {
    return (
        <View className="flex flex-row items-center justify-center rounded-full">
            <View
                className={`rounded-full size-12 items-center justify-center ${focused ? "bg-general-400" : ""}`}
            >
                <Image
                    source={source}
                    tintColor="white"
                    resizeMode="contain"
                    className="w-7 h-7"
                />
            </View>
        </View>
    );
};

const Layout = () => {
    const isIos = Platform.OS === "ios";

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "white",
                tabBarShowLabel: false,
                tabBarStyle: {
                    ...(isIos ? { paddingBottom: 0 } : { paddingBottom: 28 }),
                    backgroundColor: "#333333",
                    borderRadius: 50,
                    overflow: "hidden",
                    marginHorizontal: 20,
                    marginBottom: 25,
                    height: 78,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    position: "absolute",
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.home} />
                    ),
                }}
            />

            <Tabs.Screen
                name="rides"
                options={{
                    title: "Rides",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.list} />
                    ),
                }}
            />

            <Tabs.Screen
                name="chat"
                options={{
                    title: "Chat",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.chat} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.profile} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default Layout;
