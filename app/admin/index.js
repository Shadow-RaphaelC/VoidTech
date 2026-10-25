import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { Ionicons } from '@expo/vector-icons'
import { getImage } from '../../lib/images'
import { playSound } from '../../lib/useSound'

const C = { bg: '#0a0a0b', surface: '#111113', accent: '#00e5a0', text: '#e8e6e0', muted: '#6b6b72', border: '#1a1a1f', red: '#ff4d4d' }

function ProduitRow({ item, onDelete }) {
    return (
        <View style={styles.row}>
            {item.image ? (
                <Image source={getImage(item.image)} style={styles.thumb} resizeMode="cover" />
            ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                    <Ionicons name="image-outline" size={20} color={C.muted} />
                </View>
            )}
            <View style={styles.rowInfo}>
                <Text style={styles.nom} numberOfLines={1}>{item.nom}</Text>
                <Text style={styles.prix}>{parseFloat(item.prix).toFixed(2)} $</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => { playSound('click'); onDelete(item) }} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={18} color={C.red} />
            </TouchableOpacity>
        </View>
    )
}

export default function AdminProduits() {
    const db = useSQLiteContext()
    const router = useRouter()
    const [produits, setProduits] = useState([])
    const [loading, setLoading] = useState(true)

    async function load() {
        const rows = await db.getAllAsync('SELECT * FROM Produit ORDER BY nom ASC')
        setProduits(rows)
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    function handleDelete(item) {
        Alert.alert(
            'Supprimer',
            `Supprimer « ${item.nom} » ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer', style: 'destructive',
                    onPress: async () => {
                        await db.runAsync('DELETE FROM Produit WHERE id = ?', [item.id])
                        load()
                    }
                },
            ]
        )
    }

    if (loading) {
        return <View style={styles.center}><ActivityIndicator color={C.accent} /></View>
    }

    return (
        <View style={styles.container}>
            {produits.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.empty}>Aucun produit.</Text>
                </View>
            ) : (
                <FlatList
                    data={produits}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => <ProduitRow item={item} onDelete={handleDelete} />}
                    contentContainerStyle={styles.list}
                />
            )}
            <TouchableOpacity style={styles.fab} onPress={() => { playSound('click'); router.push('/admin/ajouter') }} activeOpacity={0.8}>
                <Ionicons name="add" size={28} color="#000" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    center: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
    list: { padding: 20, gap: 10 },
    empty: { fontFamily: 'monospace', fontSize: 13, color: C.muted },
    row: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
    thumb: { width: 64, height: 64 },
    thumbPlaceholder: { backgroundColor: '#1a1a1f', alignItems: 'center', justifyContent: 'center' },
    rowInfo: { flex: 1, paddingHorizontal: 12, gap: 4 },
    nom: { fontSize: 14, fontWeight: '600', color: C.text },
    prix: { fontFamily: 'monospace', fontSize: 12, color: C.accent },
    deleteBtn: { padding: 16 },
    fab: { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', elevation: 6 },
})
