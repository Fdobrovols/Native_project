import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

export default function MapScreen({ route }) {
    const latitude = route.params.geoLocation?.latitude ?? 50.45033004843756;
    const longitude = route.params.geoLocation?.longitude ?? 30.523874329583546;

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.mapStyle}
                region={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.010,
                }}
                mapType="standard"
                minZoomLevel={22}
                showsUserLocation={true}
            >
                {route.params && (
                    <Marker
                        title={route.params?.photoLocation ?? 'I`m here, looking at me'}
                        coordinate={{ latitude: latitude, longitude: longitude }}
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2e923d',
        justifyContent: 'center',
    },
    mapStyle: {
        flex: 1,
    },
});
