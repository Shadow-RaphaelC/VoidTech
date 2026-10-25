import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useUser } from '../lib/UserContext';
import { useTranslation } from '../lib/useTranslation';
import { playSound } from '../lib/useSound';

import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, StatusBar, ActivityIndicator,
} from 'react-native';

// Génère une grille de lignes horizontales et verticales en arrière-plan (effet décoratif)
function GridBackground() {
  const horizontalLines = [];
  const verticalLines = [];

  for (let i = 0; i < 20; i++) {
    horizontalLines.push(
      <View key={`h${i}`} style={[styles.gridHeight, { top: i * 44 }]} />
    );
  }

  for (let i = 0; i < 12; i++) {
    verticalLines.push(
      <View key={`v${i}`} style={[styles.gridVertical, { left: i * 44 }]} />
    );
  }

  return <>{horizontalLines}{verticalLines}</>;
}

function LogoSection() {
  return (
    <View style={styles.logoSection}>
      <View style={styles.logoBox}>
        <Text style={styles.logoGlyph}>V_</Text>
      </View>
      <Text style={styles.companyName}>
        Void<Text style={styles.accent}>Tech</Text>
      </Text>
      <Text style={styles.tagline}>// ADVANCED HARDWARE MARKETPLACE</Text>
    </View>
  );
}

function FormField({ label, value, onChangeText, placeholder, secureTextEntry }) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#3a3a40"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

function LoginButton({ onPress, loading }) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading
        ? <ActivityIndicator color="#000" size="small" />
        : <Text style={styles.loginBtnText}>{t('btn_login')}</Text>
      }
    </TouchableOpacity>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerLine} />
      <Text style={styles.footerText}>Raph · 420-KBC-LG · Hiver 2026</Text>
    </View>
  );
}

// ─── Écran principal de connexion ───────────────────────────────────────────

export default function Index() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { login } = useUser();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Simule un délai de connexion pour montrer le loader
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    playSound('click')
    setError('');
    if (!username.trim() || !password.trim()) {
      setError(t('err_champs'));
      return;
    }
    setLoading(true);
    // Délai artificiel de 600ms pour l'effet visuel du chargement
    setTimeout(async () => {
      // Recherche le client dans SQLite par nom et mot de passe
      const user = await db.getFirstAsync(
        "SELECT * FROM Client WHERE nom = ? AND mdp = ?", [username, password]
      );
      setLoading(false);

      if (!user) { setError(t('err_identifiants')); return; }

      login(user); // Sauvegarde l'utilisateur dans le contexte global

      // Redirige vers le panneau admin si admin=1, sinon vers les onglets principaux
      if (user.admin) {
        router.replace('/admin');
      } else {
        router.replace('/(tabs)');
      }
    }, 600);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.bg}>
        <GridBackground />
        <View style={styles.container}>
          <LogoSection />
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>{t('connexion')}</Text>
            <FormField
              label={t('label_nom')}
              placeholder={t('placeholder_nom')}
              value={username}
              onChangeText={t => { setUsername(t); setError(''); }}
            />
            <FormField
              label={t('label_mdp')}
              placeholder="********"
              value={password}
              onChangeText={t => { setPassword(t); setError(''); }}
              secureTextEntry
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <LoginButton onPress={handleLogin} loading={loading} />
          </View>
          <Footer />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles

const C = {
  accent: '#00e5a0',
  bg: '#0a0a0b',
  surface: '#111113',
  border: '#3a3a40',
  text: '#e8e6e0',
  muted: '#6b6b72',
  red: '#ff4d4d',
};

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },

  bg: {
    flex: 1,
    backgroundColor: C.bg,
    overflow: 'hidden'
  },

  gridHeight: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,229,160,0.04)'
  },

  gridVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0,229,160,0.04)'
  },

  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 28,
    justifyContent: 'space-between'
  },

  logoSection: {
    alignItems: 'center',
    gap: 8
  },

  logoBox: {
    width: 56,
    height: 56,
    borderWidth: 1.5,
    borderColor: C.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,229,160,0.05)',
    marginBottom: 4
  },

  logoGlyph: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: C.accent,
    fontWeight: '700'
  },

  companyName: {
    fontSize: 34,
    fontWeight: '800',
    color: C.text
  },

  accent: {
    color: C.accent
  },

  tagline: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: C.muted,
    marginTop: 2
  },

  formSection: {
    gap: 14
  },

  formTitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: C.accent,
    marginBottom: 2
  },

  inputWrapper: {
    gap: 5
  },
  inputLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: C.muted
  },

  input: {
    backgroundColor:
      C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: C.text,
    fontFamily: 'monospace'
  },

  errorText: {
    fontSize: 12,
    color: C.red,
    fontFamily: 'monospace'
  },

  loginBtn: {
    backgroundColor: C.accent,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4
  },

  loginBtnDisabled: {
    opacity: 0.6
  },

  loginBtnText: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '700',
    color: '#000'
  },

  footer: {
    alignItems: 'center',
    gap: 8
  },

  footerLine: {
    width: 40,
    height: 1,
    backgroundColor: C.border
  },

  footerText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: C.muted
  },
});
