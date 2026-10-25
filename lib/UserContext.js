//https://react.dev/reference/react/useCallback

import { createContext, useContext, useState, useMemo, useCallback } from 'react'

// Contexte global qui stocke l'utilisateur connecté et le partage à toute l'application
const UserContext = createContext(null)

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)

    // useCallback évite de recréer ces fonctions à chaque rendu, ce qui évite des re-rendus inutiles
    const login = useCallback((userData) => setUser(userData), [])
    const logout = useCallback(() => setUser(null), [])

    // Met à jour partiellement l'utilisateur sans écraser les autres champs
    const updateUser = useCallback((changes) => {
        setUser(prev => prev ? { ...prev, ...changes } : prev)
    }, [])

    // useMemo évite de recréer l'objet de valeur à chaque rendu (optimisation des performances)
    const value = useMemo(
        () => ({ user, login, logout, updateUser }),
        [user, login, logout, updateUser]
    )

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}
