# Maquette de l'application BVMAC (49 écrans)

## Lancer en local
```
cd design/app-mockup
python3 -m http.server 8000
```
Puis ouvrir http://localhost:8000 (index.html : téléphone au centre, liste des écrans à gauche).
Un serveur est nécessaire (ne pas ouvrir les fichiers par double-clic). Connexion internet requise pour les polices Google (Fraunces, Geist).

## Contenu
- `*.dc.html` : un écran chacun (HTML + CSS + petite classe JS pour l'état). `support.js` est le moteur qui les affiche.
- `assets/` : logos des sociétés cotées. `canvas.json` : disposition des écrans.
- Palette : espresso #1c130b, or #c9a23a, ivoire #fbf9f5. Polices : Fraunces + Geist.
Toutes les données sont fictives (cours du 8 oct. 2026 réels, comptes et montants inventés).
