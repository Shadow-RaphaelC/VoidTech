import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { Ionicons } from '@expo/vector-icons'
import { useUser } from '../../../lib/UserContext'
import { useCart } from '../../../lib/CartContext'
import AppHeader from '../../../lib/AppHeader'
import { useTranslation } from '../../../lib/useTranslation'
import { playSound } from '../../../lib/useSound'

const C = { bg: '#0a0a0b', surface: '#111113', accent: '#00e5a0', text: '#e8e6e0', muted: '#6b6b72', border: '#1a1a1f', red: '#ff4d4d' }

const LANGUES = ['fr', 'en', 'auto']

// Groupe de boutons radio pour sélectionner la langue de l'interface
function RadioGroup({ selected, onChange }) {
    return (
        <View style={styles.radioRow}>
            {LANGUES.map(lang => (
                <TouchableOpacity
                    key={lang}
                    style={[styles.radioBtn, selected === lang && styles.radioBtnActive]}
                    onPress={() => { playSound('click'); onChange(lang) }}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.radioText, selected === lang && styles.radioTextActive]}>
                        {lang.toUpperCase()}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default function Compte() {
    const router = useRouter()
    const db = useSQLiteContext()
    const { user, logout, updateUser } = useUser()
    const { clearCart } = useCart()
    const { t } = useTranslation()

    const [mdp, setMdp] = useState('')
    const [adresse, setAdresse] = useState('')
    const [langue, setLangue] = useState('fr')
    const [saving, setSaving] = useState(false)

    // Pré-remplit les champs avec les données actuelles de l'utilisateur connecté
    useEffect(() => {
        if (user) {
            setMdp(user.mdp ?? '')
            setAdresse(user.adresse ?? '')
            setLangue(user.langue ?? 'fr')
        }
    }, [user])

    // Met à jour le mot de passe, l'adresse et la langue dans SQLite,
    // puis synchronise le contexte global pour refléter les changements sans recharger
    async function handleSave() {
        playSound('click')
        if (!mdp.trim()) {
            Alert.alert('Erreur', t('err_mdp_vide'))
            return
        }
        setSaving(true)
        await db.runAsync(
            'UPDATE Client SET mdp = ?, adresse = ?, langue = ? WHERE id = ?',
            [mdp.trim(), adresse.trim() || null, langue, user.id]
        )
        updateUser({ mdp: mdp.trim(), adresse: adresse.trim() || null, langue })
        setSaving(false)
        Alert.alert(t('alerte_titre'), t('alerte_msg'))
    }

    // Vide le panier et déconnecte l'utilisateur.
    // AuthGuard dans _layout.js détecte que user = null et redirige automatiquement vers la connexion.
    function handleLogout() {
        playSound('click')
        clearCart()
        logout()
    }

    // Protège contre un bref re-rendu avec user=null pendant la redirection de déconnexion
    if (!user) return null

    return (
        <View style={{ flex: 1, backgroundColor: C.bg }}>
        <AppHeader />
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.header}>{t('titre_compte')}</Text>

            {/* Nom d'utilisateur en lecture seule (non modifiable) */}
            <View style={styles.field}>
                <Text style={styles.label}>{t('label_nom')}</Text>
                <View style={styles.inputReadonly}>
                    <Text style={styles.inputReadonlyText}>{user?.nom ?? '—'}</Text>
                    <Ionicons name="lock-closed-outline" size={14} color={C.muted} />
                </View>
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>{t('label_mdp')}</Text>
                <TextInput
                    style={styles.input}
                    value={mdp}
                    onChangeText={setMdp}
                    placeholder={t('placeholder_mdp')}
                    placeholderTextColor={C.muted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    color={C.text}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>{t('label_adresse')}</Text>
                <TextInput
                    style={styles.input}
                    value={adresse}
                    onChangeText={setAdresse}
                    placeholder={t('placeholder_adresse')}
                    placeholderTextColor={C.muted}
                    autoCorrect={false}
                    color={C.text}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>{t('label_langue')}</Text>
                <RadioGroup selected={langue} onChange={setLangue} />
            </View>

            <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.8}
            >
                <Text style={styles.saveBtnText}>{saving ? '...' : t('btn_sauvegarder')}</Text>
            </TouchableOpacity>

            {/* Clic → navigue vers la page de carte des entrepôts (/(tabs)/(compte)/entrepots) */}
            <TouchableOpacity
                style={styles.entrepotBtn}
                onPress={() => { playSound('click'); router.push('/(tabs)/(compte)/entrepots') }}
                activeOpacity={0.8}
            >
                <Ionicons name="map-outline" size={18} color={C.accent} />
                <Text style={styles.entrepotBtnText}>{t('btn_entrepots')}</Text>
                <Ionicons name="chevron-forward-outline" size={16} color={C.muted} />
            </TouchableOpacity>

            {/* Clic → déconnexion + redirection automatique vers la page de connexion */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                <Ionicons name="log-out-outline" size={18} color={C.red} />
                <Text style={styles.logoutText}>{t('btn_deconnecter')}</Text>
            </TouchableOpacity>
        </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    content: { padding: 20, gap: 20, paddingBottom: 48 },
    header: { fontFamily: 'monospace', fontSize: 11, color: C.accent, marginBottom: 4 },

    field: { gap: 6 },
    label: { fontFamily: 'monospace', fontSize: 10, color: C.muted },

    input: {
        backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
        borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12,
        fontSize: 14, fontFamily: 'monospace',
    },
    inputReadonly: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
        borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12,
    },
    inputReadonlyText: { fontSize: 14, fontFamily: 'monospace', color: C.text },

    radioRow: { flexDirection: 'row', gap: 10 },
    radioBtn: {
        flex: 1, paddingVertical: 10, borderRadius: 8,
        borderWidth: 1, borderColor: C.border, alignItems: 'center',
    },
    radioBtnActive: { borderColor: C.accent, backgroundColor: 'rgba(0,229,160,0.08)' },
    radioText: { fontFamily: 'monospace', fontSize: 13, color: C.muted },
    radioTextActive: { color: C.accent },

    saveBtn: { backgroundColor: C.accent, borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
    saveBtnDisabled: { opacity: 0.6 },
    saveBtnText: { fontFamily: 'monospace', fontSize: 14, fontWeight: '700', color: '#000' },

    entrepotBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: C.surface, borderRadius: 8, borderWidth: 1,
        borderColor: C.border, padding: 14,
    },
    entrepotBtnText: { flex: 1, fontFamily: 'monospace', fontSize: 13, color: C.accent },

    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14,
        borderRadius: 8, borderWidth: 1, borderColor: C.red, justifyContent: 'center',
    },
    logoutText: { fontFamily: 'monospace', fontSize: 13, color: C.red },
})
