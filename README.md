# Site ZYNTROTECH

Site vitrine statique (HTML/CSS/JS, sans build) — bilingue **FR/EN**, **dark mode** par défaut.

## Pages
`index.html` (accueil + produit Sokestra) · `services.html` · `about.html` · `contact.html` · `legal.html`

## Aperçu en local
```bash
python3 -m http.server 8080
# puis http://127.0.0.1:8080
```

## Déploiement (OVH / Apache)
1. Envoyer **tout le contenu** du dossier dans le `www/` de l'hébergement (FTP/SSH), y compris les fichiers cachés `.htaccess` et `.well-known/`.
2. Le `.htaccess` applique automatiquement : HTTPS forcé, redirection `www → zyntrotech.com`, et les en-têtes de sécurité.
3. Activer le **certificat SSL** (gratuit) dans l'espace client OVH.

> Domaine configuré : **https://zyntrotech.com** (sans www).

## À finaliser avant la mise en ligne
- [ ] **Formulaire** : créer un formulaire sur [formspree.io](https://formspree.io) et remplacer `REPLACE_WITH_YOUR_ID` dans `contact.html`.
- [ ] **Logo** : remplacer `assets/logo-mark.svg` par le fichier officiel (le favicon utilise le même).
- [ ] **Mentions légales** : remettre le lien vers `legal.html` dans le pied de page (obligatoire en France) — compléter l'hébergeur dans `legal.html`.
- [ ] Soumettre `sitemap.xml` dans la **Google Search Console**.

## Sécurité
En-têtes via `.htaccess` (Apache) et `_headers` (Netlify/Cloudflare) + CSP en `<meta>` : HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

## SEO
Open Graph + Twitter Card (`assets/og-image.png`), `robots.txt`, `sitemap.xml`, données structurées JSON-LD, balises `canonical` par page.
