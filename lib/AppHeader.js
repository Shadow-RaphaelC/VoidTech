//https://docs.expo.dev/versions/unversioned/sdk/safe-area-context/

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useUser } from './UserContext'
import { useCart } from './CartContext'

const C = { surface: '#111113', accent: '#00e5a0', text: '#e8e6e0', border: '#1a1a1f', red: '#ff4d4d' }

// Badge affiché dans le header de navigation des pages de détail produit et entrepôts
export function UserBadge() {
    const { user } = useUser()
    if (!user) return null
    return (
        <View style={badge.row}>
            <Text style={badge.name}>{user.nom}</Text>
            <View style={badge.pill}>
                <Text style={badge.pillText}>{(user.langue ?? 'fr').toUpperCase()}</Text>
            </View>
        </View>
    )
}

const badge = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 8 },
    name: { fontFamily: 'monospace', fontSize: 11, color: '#e8e6e0' },
    pill: { backgroundColor: 'rgba(0,229,160,0.1)', borderWidth: 1, borderColor: '#00e5a0', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
    pillText: { fontFamily: 'monospace', fontSize: 9, color: '#00e5a0' },
})

// Header global affiché en haut des pages Produits, Panier et Compte.
// Affiche le nom de l'utilisateur connecté et un bouton de déconnexion rapide.
export default function AppHeader() {
    const { user, logout } = useUser()
    const { clearCart } = useCart()
    // useSafeAreaInsets adapte le padding selon l'encoche ou la barre de statut du téléphone
    const insets = useSafeAreaInsets()

    if (!user) return null

    // Vide le panier et déconnecte — AuthGuard redirige automatiquement vers la connexion
    function handleLogout() {
        clearCart()
        logout()
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
            <UserBadge />
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.7}>
                <Ionicons name="log-out-outline" size={18} color={C.red} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: C.surface,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    logoutBtn: { padding: 4 },
})
