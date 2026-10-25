import { useUser } from './UserContext'
import { translations } from './i18n'

function getAutoLang() {
    try {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale
        return locale.startsWith('fr') ? 'fr' : 'en'
    } catch {
        return 'fr'
    }
}

export function useTranslation() {
    const { user } = useUser()
    const langue = user?.langue ?? 'fr'
    const lang = langue === 'auto' ? getAutoLang() : langue
    const dict = translations[lang] ?? translations.fr

    function t(key, ...args) {
        const val = dict[key] ?? translations.fr[key] ?? key
        if (typeof val === 'function') return val(...args)
        return val
    }

    function formatPrix(prix) {
        return new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
            style: 'currency',
            currency: 'CAD',
        }).format(prix)
    }

    return { t, formatPrix, lang }
}
