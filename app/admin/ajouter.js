import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { playSound } from '../../lib/useSound'

const C = { bg: '#0a0a0b', surface: '#111113', accent: '#00e5a0', text: '#e8e6e0', muted: '#6b6b72', border: '#3a3a40', red: '#ff4d4d' }

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline }) {
    return (
        <View style={styles.fieldWrapper}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && styles.inputMulti]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={C.border}
                keyboardType={keyboardType ?? 'default'}
                autoCapitalize="none"
                autoCorrect={false}
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
                color={C.text}
            />
        </View>
    )
}

export default function AjouterProduit() {
    const db = useSQLiteContext()
    const router = useRouter()
    const [nom, setNom] = useState('')
    const [description, setDescription] = useState('')
    const [prix, setPrix] = useState('')
    const [image, setImage] = useState('')

    async function handleSubmit() {
        playSound('click')
        if (!nom.trim() || !prix.trim()) {
            Alert.alert('Erreur', 'Le nom et le prix sont obligatoires.')
            return
        }
        const prixNum = parseFloat(prix)
        if (isNaN(prixNum) || prixNum < 0) {
            Alert.alert('Erreur', 'Le prix doit être un nombre valide.')
            return
        }
        await db.runAsync(
            'INSERT INTO Produit (nom, description, prix, image) VALUES (?, ?, ?, ?)',
            [nom.trim(), description.trim() || null, prixNum, image.trim() || null]
        )
        router.back()
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Field label="NOM *" value={nom} onChangeText={setNom} placeholder="ex: RTX 5090" />
            <Field label="DESCRIPTION" value={description} onChangeText={setDescription} placeholder="description du produit..." multiline />
            <Field label="PRIX ($) *" value={prix} onChangeText={setPrix} placeholder="0.00" keyboardType="decimal-pad" />
            <Field label="IMAGE (URL)" value={image} onChangeText={setImage} placeholder="https://..." />
            <TouchableOpacity style={styles.btn} onPress={handleSubmit} activeOpacity={0.8}>
                <Text style={styles.btnText}>[ AJOUTER ]</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    content: { padding: 20, gap: 18 },
    fieldWrapper: { gap: 6 },
    label: { fontFamily: 'monospace', fontSize: 10, color: C.muted },
    input: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: 'monospace', color: C.text },
    inputMulti: { height: 90, textAlignVertical: 'top' },
    btn: { backgroundColor: C.accent, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
    btnText: { fontFamily: 'monospace', fontSize: 14, fontWeight: '700', color: '#000' },
})
