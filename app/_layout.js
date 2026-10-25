import { Stack, Redirect, useSegments } from 'expo-router'
import { SQLiteProvider } from 'expo-sqlite'
import { initDb } from '../lib/database'
import { CartProvider } from '../lib/CartContext'
import { UserProvider, useUser } from '../lib/UserContext'

const SCREEN_OPTIONS = { headerShown: false }

// Protège les routes (tabs) et admin : redirige vers la connexion si l'utilisateur n'est pas connecté.
// useSegments() retourne le chemin actuel ex: ['(tabs)', '(compte)', 'index']
// On redirige seulement si on est DANS une route protégée, pour ne pas boucler sur la page de connexion.
function AuthGuard({ children }) {
    const { user } = useUser()
    const segments = useSegments()
    const inProtectedRoute = segments[0] === '(tabs)' || segments[0] === 'admin'

    if (!user && inProtectedRoute) return <Redirect href="/" />

    return children
}

// Layout racine : initialise la base de données SQLite, les contextes globaux,
// et définit la structure de navigation en pile (Stack).
export default function RootLayout() {
    return (
        <SQLiteProvider databaseName="voidtech.db" onInit={initDb}>
            <UserProvider>
                <CartProvider>
                    <AuthGuard>
                        <Stack screenOptions={SCREEN_OPTIONS}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="admin" />
                        </Stack>
                    </AuthGuard>
                </CartProvider>
            </UserProvider>
        </SQLiteProvider>
    )
}
