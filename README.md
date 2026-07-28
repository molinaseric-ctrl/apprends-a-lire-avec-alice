# Apprends à lire avec Alice

Une application éducative en français pour les enfants de 5 à 7 ans.

## Fonctionnalités

- Jeu de reconnaissance des syllabes
- Table numérique inspirée de Montessori
- Voix française avec la synthèse vocale du navigateur
- Système d'étoiles
- Progression enregistrée dans le navigateur
- Compatible ordinateur, tablette et téléphone
- Installable comme application web
- Fonctionnement hors connexion après la première visite

## Tester sur un Mac

Ouvrez simplement `index.html` dans Chrome.

Pour tester le mode installable et hors connexion :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000` dans Chrome.

## Publier avec GitHub Pages

1. Créez un dépôt GitHub.
2. Ajoutez tous les fichiers de ce dossier.
3. Ouvrez `Settings`, puis `Pages`.
4. Choisissez la branche `main` et le dossier `/root`.
5. Enregistrez. GitHub fournit ensuite l'adresse publique du jeu.

## Structure

```text
apprends-a-lire-avec-alice/
├── index.html
├── style.css
├── script.js
├── manifest.webmanifest
├── service-worker.js
├── README.md
├── LICENSE
└── assets/
    └── icon.svg
```

## Licence

Licence MIT.
