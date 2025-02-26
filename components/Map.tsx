import { View, ActivityIndicator, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import {
    calculateDriverTimes,
    calculateRegion,
    generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";

const Map = () => {
    const {
        data: drivers,
        loading,
        error,
    } = useFetch<Driver[]>("/(api)/driver");
    const mapRef = useRef<MapView | null>(null);
    const {
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
    } = useLocationStore();
    const { selectedDriver, setDrivers } = useDriverStore();
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const region = calculateRegion({
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
    });

    useEffect(() => {
        if (Array.isArray(drivers)) {
            if (!userLatitude || !userLongitude) return;

            const newMarkers = generateMarkersFromData({
                data: drivers,
                userLatitude,
                userLongitude,
            });

            setMarkers(newMarkers);
        }
    }, [drivers, userLatitude, userLongitude]);

    useEffect(() => {
        if (markers.length > 0 && destinationLatitude && destinationLongitude) {
            calculateDriverTimes({
                markers,
                userLatitude,
                userLongitude,
                destinationLatitude,
                destinationLongitude,
            }).then((_drivers) => {
                setDrivers(_drivers as MarkerData[]);
            });
        }
    }, [destinationLatitude, destinationLongitude, markers]);

    useEffect(() => {
        if (mapRef.current && userLatitude && userLongitude) {
            mapRef.current?.animateCamera({
                center: {
                    latitude: userLatitude,
                    longitude: userLongitude,
                },
                zoom: 15, // Set your desired zoom level
            });
        }
    }, [userLatitude, userLongitude]);

    if (loading || !userLatitude || !userLongitude) {
        return (
            <View className="flex w-full items-center justify-between">
                <ActivityIndicator size="small" color="#000" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex w-full items-center justify-between">
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            className="w-full h-full rounded-2xl"
            style={{ width: "100%", height: "100%", flex: 1 }}
            tintColor="black"
            showsPointsOfInterest={false}
            initialRegion={region}
            showsUserLocation={true}
            userInterfaceStyle="light"
            ref={mapRef}
            // mapType="mutedStandard" mutedStandard doesn't work on Android
        >
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                    }}
                    title={marker.title}
                    image={
                        selectedDriver === marker.id
                            ? icons.selectedMarker
                            : icons.marker
                    }
                ></Marker>
            ))}

            {destinationLatitude && destinationLongitude && (
                <>
                    <Marker
                        key="destination"
                        coordinate={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        title="Destination"
                        image={icons.pin}
                    ></Marker>

                    <MapViewDirections
                        origin={{
                            latitude: userLatitude,
                            longitude: userLongitude,
                        }}
                        destination={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
                        strokeWidth={3}
                        strokeColor="#000"
                    />
                </>
            )}
        </MapView>
    );
};

export default Map;
