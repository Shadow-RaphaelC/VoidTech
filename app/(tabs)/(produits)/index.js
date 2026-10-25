import { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, Pressable, StyleSheet, ActivityIndicator, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { getImage } from '../../../lib/images'
import AppHeader from '../../../lib/AppHeader'
import { useTranslation } from '../../../lib/useTranslation'
import { playSound } from '../../../lib/useSound'

const C = { bg: '#0a0a0b', surface: '#111113', accent: '#00e5a0', text: '#e8e6e0', muted: '#6b6b72', border: '#1a1a1f' }

// Carte d'un produit dans la grille — clic redirige vers la page de détail du produit
function ProduitCard({ item, onPress }) {
    const { formatPrix } = useTranslation()
    return (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={onPress}
        >
            <View style={styles.thumbContainer}>
                {item.image ? (
                    <Image source={getImage(item.image)} style={styles.thumb} resizeMode="contain" />
                ) : (
                    <Text style={styles.placeholderText}>NO IMG</Text>
                )}
            </View>
            <View style={styles.info}>
                <Text style={styles.nom} numberOfLines={2}>{item.nom}</Text>
                <Text style={styles.prix}>{formatPrix(item.prix)}</Text>
            </View>
        </Pressable>
    )
}

export default function Produits() {
    const db = useSQLiteContext()
    const router = useRouter()
    const { t, formatPrix } = useTranslation()
    const [produits, setProduits] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    // Charge tous les produits depuis SQLite au premier rendu, triés par nom
    useEffect(() => {
        db.getAllAsync('SELECT id, nom, prix, image FROM Produit ORDER BY nom ASC')
            .then(rows => { setProduits(rows); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return <View style={styles.center}><ActivityIndicator color={C.accent} /></View>
    }

    return (
        <View style={styles.container}>
            <AppHeader />
            <Text style={styles.header}>{t('titre_produits')}</Text>
            <TextInput
                style={styles.search}
                placeholder="// rechercher..."
                placeholderTextColor={C.muted}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
            />
            {produits.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.empty}>{t('aucun_produit')}</Text>
                </View>
            ) : (
                // Filtre les produits en temps réel selon la saisie dans la barre de recherche
                <FlatList
                    data={produits.filter(p => p.nom.toLowerCase().includes(search.toLowerCase()))}
                    keyExtractor={item => String(item.id)}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <ProduitCard
                            item={item}
                            // Clic → navigue vers la page de détail du produit (/(tabs)/(produits)/[id])
                            onPress={() => { playSound('click'); router.push(`/(tabs)/(produits)/${item.id}`) }}
                        />
                    )}
                    contentContainerStyle={styles.list}
                    columnWrapperStyle={styles.row}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    center: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
    header: { fontFamily: 'monospace', fontSize: 11, color: C.accent, paddingHorizontal: 20, marginBottom: 16 },
    list: { paddingHorizontal: 12, paddingBottom: 20 },
    row: { gap: 10, marginBottom: 10 },
    card: { flex: 1, backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
    cardPressed: { opacity: 0.7 },
    thumbContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#0f0f11', alignItems: 'center', justifyContent: 'center', padding: 10 },
    thumb: { width: '100%', height: '100%' },
    thumbPlaceholder: { backgroundColor: '#1a1a1f', alignItems: 'center', justifyContent: 'center' },
    placeholderText: { fontFamily: 'monospace', fontSize: 10, color: C.muted },
    info: { padding: 8, gap: 2 },
    nom: { fontSize: 12, fontWeight: '600', color: C.text },
    prix: { fontFamily: 'monospace', fontSize: 11, color: C.accent },
    empty: { fontFamily: 'monospace', fontSize: 13, color: C.muted },
    search: { marginHorizontal: 12, marginBottom: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontFamily: 'monospace', fontSize: 12, color: C.text },
})
