//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat

export const translations = {
    fr: {
        // Login
        connexion: 'CONNEXION',
        label_nom: "NOM D'UTILISATEUR",
        label_mdp: 'MOT DE PASSE',
        placeholder_nom: 'entrez votre pseudonyme...',
        btn_login: '[ ACCÉDER ]',
        err_champs: 'Veuillez remplir tous les champs.',
        err_identifiants: "Nom d'utilisateur ou mot de passe incorrect.",

        // Produits
        titre_produits: '// PRODUITS',
        aucun_produit: 'Aucun produit disponible.',
        btn_ajouter_panier: 'AJOUTER AU PANIER',
        btn_ajoute: 'AJOUTÉ !',

        // Panier
        titre_panier: '// PANIER',
        panier_vide: 'Votre panier est vide.',
        label_total: 'TOTAL',
        btn_commander: '[ COMMANDER ]',
        btn_vider: 'Vider le panier',
        par_unite: '/ unité',
        modal_titre: 'COMMANDE CONFIRMÉE',
        modal_articles: (n) => `${n} article${n > 1 ? 's' : ''} commandé${n > 1 ? 's' : ''}`,
        modal_sub: 'Votre commande a été transmise.\nMerci de votre achat chez VoidTech.',
        btn_fermer: '[ FERMER ]',

        // Compte
        titre_compte: '// COMPTE',
        label_adresse: 'ADRESSE',
        label_langue: 'LANGUE',
        placeholder_mdp: 'nouveau mot de passe',
        placeholder_adresse: 'votre adresse...',
        btn_sauvegarder: '[ SAUVEGARDER ]',
        btn_entrepots: 'Voir les entrepôts',
        btn_deconnecter: 'Se déconnecter',
        err_mdp_vide: 'Le mot de passe ne peut pas être vide.',
        alerte_titre: 'Sauvegardé',
        alerte_msg: 'Vos informations ont été mises à jour.',

        // Tabs
        tab_produits: 'Produits',
        tab_panier: 'Panier',
        tab_compte: 'Compte',
    },

    en: {
        // Login
        connexion: 'LOGIN',
        label_nom: 'USERNAME',
        label_mdp: 'PASSWORD',
        placeholder_nom: 'enter your username...',
        btn_login: '[ ACCESS ]',
        err_champs: 'Please fill in all fields.',
        err_identifiants: 'Incorrect username or password.',

        // Produits
        titre_produits: '// PRODUCTS',
        aucun_produit: 'No products available.',
        btn_ajouter_panier: 'ADD TO CART',
        btn_ajoute: 'ADDED!',

        // Panier
        titre_panier: '// CART',
        panier_vide: 'Your cart is empty.',
        label_total: 'TOTAL',
        btn_commander: '[ CHECKOUT ]',
        btn_vider: 'Clear cart',
        par_unite: '/ unit',
        modal_titre: 'ORDER CONFIRMED',
        modal_articles: (n) => `${n} item${n > 1 ? 's' : ''} ordered`,
        modal_sub: 'Your order has been placed.\nThank you for shopping at VoidTech.',
        btn_fermer: '[ CLOSE ]',

        // Compte
        titre_compte: '// ACCOUNT',
        label_adresse: 'ADDRESS',
        label_langue: 'LANGUAGE',
        placeholder_mdp: 'new password',
        placeholder_adresse: 'your address...',
        btn_sauvegarder: '[ SAVE ]',
        btn_entrepots: 'View warehouses',
        btn_deconnecter: 'Log out',
        err_mdp_vide: 'Password cannot be empty.',
        alerte_titre: 'Saved',
        alerte_msg: 'Your information has been updated.',

        // Tabs
        tab_produits: 'Products',
        tab_panier: 'Cart',
        tab_compte: 'Account',
    },
}
