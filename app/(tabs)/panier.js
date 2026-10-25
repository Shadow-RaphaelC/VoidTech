import { useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useCart } from '../../lib/CartContext'
import { getImage } from '../../lib/images'
import AppHeader from '../../lib/AppHeader'
import { useTranslation } from '../../lib/useTranslation'
import { playSound } from '../../lib/useSound'

const C = { bg: '#0a0a0b', surface: '#111113', accent: '#00e5a0', text: '#e8e6e0', muted: '#6b6b72', border: '#1a1a1f', red: '#ff4d4d' }

// Ligne d'un produit dans le panier avec contrôles de quantité et bouton suppression
function CartItem({ item, onRemove, onIncrease, onDecrease }) {
    const { t, formatPrix } = useTranslation()
    const unitaire = parseFloat(item.produit.prix)
    // Calcule le sous-total de cette ligne (prix × quantité)
    const totalItem = unitaire * item.quantite

    return (
        <View style={styles.row}>
            {item.produit.image ? (
                <Image source={getImage(item.produit.image)} style={styles.thumb} resizeMode="cover" />
            ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                    <Ionicons name="image-outline" size={20} color={C.muted} />
                </View>
            )}
            <View style={styles.rowInfo}>
                <Text style={styles.nom} numberOfLines={1}>{item.produit.nom}</Text>
                <Text style={styles.unitaire}>{formatPrix(unitaire)} {t('par_unite')}</Text>
                <View style={styles.qtyRow}>
                    {/* Bouton − : diminue la quantité (retire le produit si quantité = 1) */}
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => { playSound('add'); onDecrease(item.produit.id) }} activeOpacity={0.7}>
                        <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyVal}>{item.quantite}</Text>
                    {/* Bouton + : augmente la quantité */}
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => { playSound('add'); onIncrease(item.produit.id) }} activeOpacity={0.7}>
                        <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.totalItem}>{formatPrix(totalItem)}</Text>
                </View>
            </View>
            {/* Bouton poubelle : retire complètement le produit du panier */}
            <TouchableOpacity style={styles.removeBtn} onPress={() => { playSound('click'); onRemove(item.produit.id) }} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={18} color={C.red} />
            </TouchableOpacity>
        </View>
    )
}

// Modale de confirmation qui s'affiche après avoir cliqué sur "Commander"
// La fermer vide automatiquement le panier
function PurchaseModal({ visible, total, itemCount, onClose }) {
    const { t, formatPrix } = useTranslation()
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>

                    
                    <View style={styles.modalIconRow}>
                        <Ionicons name="checkmark-circle" size={52} color={C.accent} />
                    </View>
                    <Text style={styles.modalTitle}>{t('modal_titre')}</Text>
                    <View style={styles.modalDivider} />
                    <Text style={styles.modalLine}>{t('modal_articles', itemCount)}</Text>
                    <Text style={styles.modalTotal}>{formatPrix(total)}</Text>
                    <Text style={styles.modalSub}>{t('modal_sub')}</Text>
                    {/* Fermer la modale vide aussi le panier (handleCloseModal) */}
                    <TouchableOpacity style={styles.modalBtn} onPress={onClose} activeOpacity={0.8}>
                        <Text style={styles.modalBtnText}>{t('btn_fermer')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default function Panier() {
    const { items, removeFromCart, increaseQty, decreaseQty, clearCart, total } = useCart()
    const { t, formatPrix } = useTranslation()
    const [modalVisible, setModalVisible] = useState(false)

    // Nombre total d'articles (somme des quantités de chaque ligne)
    const itemCount = items.reduce((s, i) => s + i.quantite, 0)

    // Ouvre la modale de confirmation de commande
    function handleCheckout() {
        playSound('buy')
        setModalVisible(true)
    }

    // Ferme la modale ET vide le panier
    function handleCloseModal() {
        setModalVisible(false)
        clearCart()
    }

    return (
        <View style={styles.container}>
            <AppHeader />
            <Text style={styles.header}>{t('titre_panier')}</Text>

            {items.length === 0 ? (
                <View style={styles.emptyBody}>
                    <Ionicons name="cart-outline" size={48} color={C.muted} />
                    <Text style={styles.emptyText}>{t('panier_vide')}</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={items}
                        keyExtractor={item => String(item.produit.id)}
                        renderItem={({ item }) => (
                            <CartItem
                                item={item}
                                onRemove={removeFromCart}
                                onIncrease={increaseQty}
                                onDecrease={decreaseQty}
                            />
                        )}
                        contentContainerStyle={styles.list}
                    />
                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>{t('label_total')}</Text>
                            <Text style={styles.totalValue}>{formatPrix(total)}</Text>
                        </View>
                        {/* Bouton Commander → ouvre la modale de confirmation */}
                        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.8}>
                            <Text style={styles.checkoutText}>{t('btn_commander')}</Text>
                        </TouchableOpacity>
                        {/* Bouton Vider → retire tous les articles sans confirmation */}
                        <TouchableOpacity style={styles.clearBtn} onPress={() => { playSound('click'); clearCart() }} activeOpacity={0.8}>
                            <Text style={styles.clearText}>{t('btn_vider')}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <PurchaseModal
                visible={modalVisible}
                total={total.toFixed(2)}
                itemCount={itemCount}
                onClose={handleCloseModal}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    header: { fontFamily: 'monospace', fontSize: 11, color: C.accent, paddingHorizontal: 20, marginBottom: 16, marginTop: 16 },
    emptyBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    emptyText: { fontFamily: 'monospace', fontSize: 13, color: C.muted },
    list: { paddingHorizontal: 16, paddingBottom: 8, gap: 10 },

    row: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
    thumb: { width: 80, height: 80 },
    thumbPlaceholder: { backgroundColor: '#1a1a1f', alignItems: 'center', justifyContent: 'center' },
    rowInfo: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 4 },
    nom: { fontSize: 13, fontWeight: '600', color: C.text },
    unitaire: { fontFamily: 'monospace', fontSize: 10, color: C.muted },
    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
    qtyBtn: { width: 26, height: 26, borderRadius: 6, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1f' },
    qtyBtnText: { fontSize: 16, color: C.accent, lineHeight: 20 },
    qtyVal: { fontFamily: 'monospace', fontSize: 14, color: C.text, minWidth: 20, textAlign: 'center' },
    totalItem: { fontFamily: 'monospace', fontSize: 13, color: C.accent, marginLeft: 4 },
    removeBtn: { padding: 16 },

    footer: { padding: 20, borderTopWidth: 1, borderTopColor: C.border, gap: 12 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontFamily: 'monospace', fontSize: 12, color: C.muted },
    totalValue: { fontSize: 22, fontWeight: '800', color: C.text },
    checkoutBtn: { backgroundColor: C.accent, borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
    checkoutText: { fontFamily: 'monospace', fontSize: 14, fontWeight: '700', color: '#000' },
    clearBtn: { alignItems: 'center', paddingVertical: 4 },
    clearText: { fontFamily: 'monospace', fontSize: 12, color: C.muted },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center', padding: 32 },
    modalBox: { backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 28, width: '100%', alignItems: 'center', gap: 12 },
    modalIconRow: { marginBottom: 4 },
    modalTitle: { fontFamily: 'monospace', fontSize: 15, fontWeight: '700', color: C.text, letterSpacing: 1 },
    modalDivider: { width: 40, height: 1, backgroundColor: C.border },
    modalLine: { fontFamily: 'monospace', fontSize: 12, color: C.muted },
    modalTotal: { fontSize: 32, fontWeight: '800', color: C.accent },
    modalSub: { fontFamily: 'monospace', fontSize: 11, color: C.muted, textAlign: 'center', lineHeight: 18 },
    modalBtn: { marginTop: 8, backgroundColor: C.accent, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 28 },
    modalBtnText: { fontFamily: 'monospace', fontSize: 13, fontWeight: '700', color: '#000' },
})
