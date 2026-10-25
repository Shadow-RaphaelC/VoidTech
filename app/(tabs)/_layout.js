import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useCart } from '../../lib/CartContext'
import { useUser } from '../../lib/UserContext'
import { useTranslation } from '../../lib/useTranslation'
import { playSound } from '../../lib/useSound'
import { View, Text, StyleSheet } from 'react-native'

const C = { bg: '#0a0a0b', accent: '#00e5a0', muted: '#6b6b72', border: '#1a1a1f', red: '#ff4d4d' }

const SCREEN_OPTIONS = {
    headerShown: false,
    tabBarStyle: { backgroundColor: C.bg, borderTopColor: C.border },
    tabBarActiveTintColor: C.accent,
    tabBarInactiveTintColor: C.muted,
}

const SCREEN_LISTENERS = { tabPress: () => playSound('tab') }

function CartBadge() {
    const { items } = useCart()
    const count = items.reduce((s, i) => s + i.quantite, 0)
    if (count === 0) return null
    return (
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
    )
}

function ProduitIcon({ color, size }) {
    return <Ionicons name="storefront-outline" size={size} color={color} />
}

function PanierIcon({ color, size }) {
    return (
        <View>
            <Ionicons name="cart-outline" size={size} color={color} />
            <CartBadge />
        </View>
    )
}

function CompteIcon({ color, size }) {
    return <Ionicons name="person-outline" size={size} color={color} />
}

export default function TabsLayout() {
    const { user } = useUser()
    const { t } = useTranslation()

    return (
        <Tabs screenListeners={SCREEN_LISTENERS} screenOptions={SCREEN_OPTIONS}>
            <Tabs.Screen
                name="(produits)"
                options={{ title: t('tab_produits'), tabBarIcon: ProduitIcon }}
            />
            <Tabs.Screen
                name="panier"
                options={{ title: t('tab_panier'), tabBarIcon: PanierIcon }}
            />
            <Tabs.Screen
                name="(compte)"
                options={{ title: t('tab_compte'), tabBarIcon: CompteIcon }}
            />
        </Tabs>
    )
}

const styles = StyleSheet.create({
    badge: { position: 'absolute', top: -4, right: -8, backgroundColor: C.red, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
})
