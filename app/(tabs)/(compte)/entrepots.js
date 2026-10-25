import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import MapView, { Marker, Circle, Polyline } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import data from '../../../assets/entrepots.json'
import { playSound } from '../../../lib/useSound'

const C = { bg: '#0a0a0b', surface: '#111113', accent: '#00e5a0', text: '#e8e6e0', muted: '#6b6b72', border: '#1a1a1f' }

// Données importées du fichier JSON : liste des entrepôts, position de la maison, chemin vers l'entrepôt le plus proche
const ENTREPOTS = data.entrepots
const MAISON = data.maison
const CHEMIN = data.chemin

// Région initiale de la carte centrée sur la grande région de Montréal
const REGION = {
    latitude: 45.62,
    longitude: -73.74,
    latitudeDelta: 0.45,
    longitudeDelta: 0.65,
}

export default function Entrepots() {
    // ID de l'entrepôt sélectionné — null = aucun sélectionné (marqueur maison actif)
    const [selectedId, setSelectedId] = useState(null)

    return (
        <View style={styles.container}>

            {/* Bande du haut (25%) : liste horizontale des entrepôts — clic sélectionne l'entrepôt */}
            <View style={styles.listSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                >
                    {ENTREPOTS.map(e => (
                        <Pressable
                            key={e.id}
                            style={[styles.btn, selectedId === e.id && styles.btnActive]}
                            onPress={() => { playSound('click'); setSelectedId(e.id) }}
                        >
                            <Text
                                style={[styles.btnText, selectedId === e.id && styles.btnTextActive]}
                                numberOfLines={1}
                            >
                                {e.nom}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Zone principale (75%) : carte Google Maps interactive */}
            <View style={{ flex: 1 }}>
                <MapView style={styles.map} initialRegion={REGION}>

                    {/* Marqueur maison — clic désélectionne l'entrepôt actif */}
                    <Marker
                        coordinate={{
                            latitude: MAISON.latitude,
                            longitude: MAISON.longitude,
                        }}
                        title={MAISON.titre}
                        onPress={() => setSelectedId(null)}>
                        <View style={styles.homeMarker}>
                            <Ionicons name="home" size={18} color="#000" />
                        </View>
                    </Marker>

                    {/* Marqueurs des entrepôts — le marqueur sélectionné change de couleur */}
                    {ENTREPOTS.map(e => {
                        const isSelected = selectedId === e.id
                        return (
                            <Marker
                                key={`m${e.id}`}
                                coordinate={{ latitude: e.latitude, longitude: e.longitude }}
                                title={e.nom}
                                onPress={() => setSelectedId(e.id)}
                            >
                                <View style={[styles.entrepotMarker, isSelected && styles.entrepotMarkerActive]}>
                                    <Ionicons name="cube" size={16} color={isSelected ? '#000' : C.accent} />
                                </View>
                            </Marker>
                        )
                    })}

                    {/* Cercles de 5 km de rayon autour de chaque entrepôt */}
                    {ENTREPOTS.map(e => (
                        <Circle
                            key={`c${e.id}`}
                            center={{ latitude: e.latitude, longitude: e.longitude }}
                            radius={5000}
                            strokeColor="rgba(0,229,160,0.35)"
                            fillColor="rgba(0,229,160,0.05)"
                            strokeWidth={1}
                        />
                    ))}

                    {/* Tracé du chemin prédéfini de la maison vers l'entrepôt VoidTech Laval (le plus proche) */}
                    <Polyline
                        coordinates={CHEMIN}
                        strokeColor={C.accent}
                        strokeWidth={3}
                    />

                </MapView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },

    listSection: {
        flex: 0.25,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: C.border,
    },
    listContent: {
        paddingHorizontal: 12,
        marginRight: 8,
        alignItems: 'center',
    },
    btn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: C.border,
        backgroundColor: C.surface,
    },
    btnActive: { borderColor: C.accent, backgroundColor: 'rgba(0,229,160,0.1)' },
    btnText: {fontSize: 12, color: C.muted },
    btnTextActive: { color: C.accent },

    map: { flex: 1 },

    homeMarker: {
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: C.accent,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#fff',
    },
    entrepotMarker: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: C.surface,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: C.accent,
    },
    entrepotMarkerActive: { backgroundColor: C.accent },
})
