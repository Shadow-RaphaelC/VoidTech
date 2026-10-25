import { Stack } from 'expo-router'

const C = { bg: '#0a0a0b', accent: '#00e5a0' }

const SCREEN_OPTIONS = {
    headerStyle: { backgroundColor: C.bg },
    headerTintColor: C.accent,
    headerTitleStyle: { fontFamily: 'monospace', fontSize: 13 },
    contentStyle: { backgroundColor: C.bg },
}

const INDEX_OPTIONS = { headerShown: false }
const DETAIL_OPTIONS = { title: '// DÉTAILS' }

export default function ProduitsLayout() {
    return (
        <Stack screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="index" options={INDEX_OPTIONS} />
            <Stack.Screen name="[id]" options={DETAIL_OPTIONS} />
        </Stack>
    )
}
