//https://react.dev/reference/react/useCallback

import { createContext, useContext, useState, useMemo, useCallback } from 'react'

// Contexte global qui gère le contenu du panier pour toute l'application
const CartContext = createContext(null)

export function CartProvider({ children }) {
    // Structure d'un item : { produit: {...}, quantite: number }
    const [items, setItems] = useState([])

    // Ajoute un produit : incrémente la quantité s'il est déjà dans le panier, sinon l'ajoute avec quantité 1
    const addToCart = useCallback((produit) => {
        setItems(prev => {
            const existing = prev.find(i => i.produit.id === produit.id)
            if (existing) {
                return prev.map(i =>
                    i.produit.id === produit.id ? { ...i, quantite: i.quantite + 1 } : i
                )
            }
            return [...prev, { produit, quantite: 1 }]
        })
    }, [])

    // Retire complètement un produit du panier peu importe sa quantité
    const removeFromCart = useCallback((id) => {
        setItems(prev => prev.filter(i => i.produit.id !== id))
    }, [])

    const increaseQty = useCallback((id) => {
        setItems(prev => prev.map(i =>
            i.produit.id === id ? { ...i, quantite: i.quantite + 1 } : i
        ))
    }, [])

    // Diminue la quantité — retire le produit automatiquement si la quantité tombe à 0
    const decreaseQty = useCallback((id) => {
        setItems(prev => {
            const item = prev.find(i => i.produit.id === id)
            if (!item) return prev
            if (item.quantite <= 1) return prev.filter(i => i.produit.id !== id)
            return prev.map(i =>
                i.produit.id === id ? { ...i, quantite: i.quantite - 1 } : i
            )
        })
    }, [])

    const clearCart = useCallback(() => setItems([]), [])

    // Recalcule le total automatiquement à chaque changement du panier
    const total = useMemo(
        () => items.reduce((sum, i) => sum + i.produit.prix * i.quantite, 0),
        [items]
    )

    const value = useMemo(
        () => ({ items, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart, total }),
        [items, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart, total]
    )

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}
