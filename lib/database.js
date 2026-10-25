// Initialise la base de données SQLite au premier lancement de l'application.
// Appelée une seule fois par SQLiteProvider dans _layout.js.
export async function initDb(db) {
    // Crée les tables seulement si elles n'existent pas déjà (sécuritaire au redémarrage)
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Produit (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            nom         TEXT    NOT NULL UNIQUE,
            description TEXT,
            prix        REAL    NOT NULL,
            image       TEXT
        );

        CREATE TABLE IF NOT EXISTS Client (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            nom      TEXT    NOT NULL UNIQUE,
            mdp      TEXT    NOT NULL,
            admin    INTEGER NOT NULL DEFAULT 0,  -- 1 = administrateur, 0 = client normal
            adresse  TEXT,
            langue   TEXT
        );
    `)

    // Insère les clients par défaut seulement si la table est vide (évite les doublons)
    const { count: clientCount } = await db.getFirstAsync('SELECT COUNT(*) as count FROM Client')
    if (clientCount === 0) {
        await db.execAsync(`
            INSERT INTO Client (nom, mdp, admin, adresse, langue) VALUES
                ('SuperAdmin', 'adminpass', 1, '123 Admin St, Admin City', 'fr'),
        `)
    }

    // Insère les produits par défaut seulement si la table est vide
    const { count: produitCount } = await db.getFirstAsync('SELECT COUNT(*) as count FROM Produit')
    if (produitCount === 0) {
        await db.execAsync(`
            INSERT INTO Produit (nom, description, prix, image) VALUES
                ('Rubber Ducky USB', 'Clé USB qui simule un clavier et injecte automatiquement des scripts sur n''importe quel ordinateur en quelques secondes.', 59.99, 'usb-rubber-ducky_mk2.png'),
                ('Flipper Zero', 'Appareil portable multi-outils capable de lire, copier et émuler des signaux RFID, NFC, infrarouge, et bien plus.', 169.99, 'flipper-zero.png'),
                ('WiFi Pineapple', 'Routeur spécialisé pour l''audit de réseaux Wi-Fi, permettant d''analyser le trafic et de détecter les vulnérabilités sans fil.', 119.99, 'wifi_pineapple.png'),
                ('HackRF One', 'Périphérique radio logicielle (SDR) capable de transmettre et recevoir des signaux radio de 1 MHz à 6 GHz.', 329.99, 'HackRF One.png'),
                ('ProxMark3', 'Outil professionnel pour lire, analyser et cloner des cartes à puce RFID/NFC utilisé en audit de sécurité physique.', 249.99, 'ProxMark3.png'),
                ('LAN Turtle', 'Adaptateur réseau USB discret permettant l''accès à distance et l''interception de trafic réseau local.', 49.99, 'lan-turtle.png'),
                ('Alfa AWUS036ACH', 'Adaptateur Wi-Fi haute puissance avec double antenne, idéal pour la capture de paquets et les tests de pénétration sans fil.', 39.99, 'Alfa.png'),
                ('Bash Bunny', 'Outil d''attaque USB polyvalent capable de simuler plusieurs périphériques à la fois pour automatiser des attaques complexes.', 99.99, 'bash-bunny-mk2.png'),
                ('O.MG Cable', 'Câble USB d''apparence normale qui contient un implant Wi-Fi intégré, permettant l''injection de commandes à distance.', 79.99, 'omgmain.png'),
                ('Shark Jack', 'Petit appareil réseau portable qui s''insère dans un port Ethernet pour effectuer des reconnaissances réseau rapides.', 69.99, 'shark_thumb.png');
        `)
    }
}
