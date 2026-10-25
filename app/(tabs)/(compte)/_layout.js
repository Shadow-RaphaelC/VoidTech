import { Stack } from 'expo-router'
import { UserBadge } from '../../../lib/AppHeader'

const C = { bg: '#0a0a0b', accent: '#00e5a0' }

const SCREEN_OPTIONS = {
    headerStyle: { backgroundColor: C.bg },
    headerTintColor: C.accent,
    headerTitleStyle: { fontFamily: 'monospace', fontSize: 13 },
    contentStyle: { backgroundColor: C.bg },
}

const INDEX_OPTIONS = { headerShown: false }
const renderUserBadge = () => <UserBadge />
const ENTREPOTS_OPTIONS = { title: '// ENTREPÔTS', headerRight: renderUserBadge }

export default function CompteLayout() {
    return (
        <Stack screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="index" options={INDEX_OPTIONS} />
            <Stack.Screen name="entrepots" options={ENTREPOTS_OPTIONS} />
        </Stack>
    )
}
