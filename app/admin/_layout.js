import { Stack, useRouter } from 'expo-router'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { UserBadge } from '../../lib/AppHeader'
import { useUser } from '../../lib/UserContext'
import { useCart } from '../../lib/CartContext'

const C = { bg: '#0a0a0b', accent: '#00e5a0', red: '#ff4d4d' }

function AdminHeaderRight() {
    const { logout } = useUser()
    const { clearCart } = useCart()
    const router = useRouter()

    function handleLogout() {
        router.replace('/')
        clearCart()
        logout()
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 8 }}>
            <UserBadge />
            <TouchableOpacity onPress={handleLogout} style={{ padding: 4 }}>
                <Ionicons name="log-out-outline" size={18} color={C.red} />
            </TouchableOpacity>
        </View>
    )
}

const renderAdminHeaderRight = () => <AdminHeaderRight />

const SCREEN_OPTIONS = {
    headerStyle: { backgroundColor: C.bg },
    headerTintColor: C.accent,
    headerTitleStyle: { fontFamily: 'monospace', fontSize: 13 },
    contentStyle: { backgroundColor: C.bg },
    headerRight: renderAdminHeaderRight,
}

const INDEX_OPTIONS = { title: '// ADMIN — PRODUITS' }
const AJOUTER_OPTIONS = { title: '// AJOUTER UN PRODUIT' }

export default function AdminLayout() {
    return (
        <Stack screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="index" options={INDEX_OPTIONS} />
            <Stack.Screen name="ajouter" options={AJOUTER_OPTIONS} />
        </Stack>
    )
}
