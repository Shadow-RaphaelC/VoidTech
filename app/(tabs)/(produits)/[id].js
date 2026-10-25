//https://docs.expo.dev/router/reference/hooks/#uselocalsearchparams

import { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { Ionicons } from '@expo/vector-icons'
import { getImage } from '../../../lib/images'
import { useCart } from '../../../lib/CartContext'
import { UserBadge } from '../../../lib/AppHeader'
import { useTranslation } from '../../../lib/useTranslation'
import { playSound } from '../../../lib/useSound'

const C = { bg: '#0a0a0b', surface: '#111113', accent: '#00e5a0', text: '#e8e6e0', muted: '#6b6b72', border: '#1a1a1f' }

export default function ProduitDetail() {
    // Récupère l'ID du produit depuis l'URL de navigation (ex: /(tabs)/(produits)/3 → id = "3")
    const { id } = useLocalSearchParams()
    const db = useSQLiteContext()
    const { addToCart } = useCart()
    const { t, formatPrix } = useTranslation()
    const [produit, setProduit] = useState(null)
    // Contrôle l'état visuel du bouton après ajout au panier (icône + couleur changent pendant 1.5s)
    const [added, setAdded] = useState(false)

    // Charge le produit correspondant à l'ID depuis SQLite
    useEffect(() => {
        db.getFirstAsync('SELECT * FROM Produit WHERE id = ?', [id])
            .then(setProduit)
    }, [id])

    function handleAddToCart() {
        playSound('add')
        addToCart(produit) // Ajoute au panier via le contexte global (incrémente si déjà présent)
        setAdded(true)
        // Remet le bouton à son état normal après 1.5 secondes
        setTimeout(() => setAdded(false), 1500)
    }

    if (!produit) {
        return <View style={styles.center}><ActivityIndicator color={C.accent} /></View>
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Injecte le badge utilisateur dans le header de navigation de cet écran */}
            <Stack.Screen options={{ headerRight: () => <UserBadge /> }} />
            {produit.image ? (
                <Image source={getImage(produit.image)} style={styles.image} resizeMode="contain" />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={48} color={C.muted} />
                </View>
            )}
            <View style={styles.body}>
                <Text style={styles.nom}>{produit.nom}</Text>
                <Text style={styles.prix}>{formatPrix(produit.prix)}</Text>
                {produit.description ? (
                    <Text style={styles.desc}>{produit.description}</Text>
                ) : null}
                {/* Bouton ajouter au panier — change d'apparence 1.5s après le clic pour confirmer */}
                <TouchableOpacity
                    style={[styles.btn, added && styles.btnAdded]}
                    onPress={handleAddToCart}
                    activeOpacity={0.8}
                >
                    <Ionicons name={added ? 'checkmark' : 'cart-outline'} size={18} color="#000" />
                    <Text style={styles.btnText}>
                        {added ? t('btn_ajoute') : t('btn_ajouter_panier')}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    content: { paddingBottom: 40 },
    center: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
    image: { width: '100%', height: 280, backgroundColor: C.surface },
    imagePlaceholder: { width: '100%', height: 280, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
    body: { padding: 20, gap: 12 },
    nom: { fontSize: 22, fontWeight: '800', color: C.text },
    prix: { fontSize: 24, fontWeight: '800', color: C.accent },
    desc: { fontSize: 14, color: C.muted, fontFamily: 'monospace', lineHeight: 22 },
    btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.accent, borderRadius: 8, paddingVertical: 14, marginTop: 8 },
    btnAdded: { backgroundColor: '#00b37e' },
    btnText: { fontFamily: 'monospace', fontSize: 14, fontWeight: '700', color: '#000' },
})
