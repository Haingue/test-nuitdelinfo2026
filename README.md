# Nuit de l'Info 2026 - dépôt d'expérimentation

Ce dépôt réunit deux projets indépendants utilisés pour expérimenter et tester les éléments du défi de la Nuit de l'Info 2026 : une API REST FizzBuzz et une interface web pour le Jeu de la vie de Conway.

## Projets

### `fizzbuzz/` - API REST FizzBuzz

API développée avec Java 21 et Spring Boot. Elle calcule le résultat FizzBuzz d'un nombre et conserve les calculs dans une base H2 en mémoire.

- `POST /api/fizzbuzz` : calcule et enregistre un résultat. Le corps JSON attendu est `{"number":15}`. La réponse est `201 Created` avec l'identifiant, le nombre et le résultat.
- `GET /api/fizzbuzz/{id}` : récupère un calcul enregistré.
- Un champ `number` manquant renvoie `400 Bad Request` ; un identifiant inconnu renvoie `404 Not Found`.

Depuis le dossier `fizzbuzz/` :

```bash
mvn spring-boot:run
```

L'API est alors accessible sur `http://localhost:8080`. Exemple d'appel :

```bash
curl -i -X POST http://localhost:8080/api/fizzbuzz \
	-H 'Content-Type: application/json' \
	-d '{"number":15}'
```

### `game-of-life/` - Jeu de la vie

Interface web réalisée avec React, TypeScript et Vite. Elle présente une grille interactive de 20 × 20 cellules. On peut modifier les cellules en cliquant dessus, démarrer ou mettre en pause la simulation, avancer d'une génération, générer une grille aléatoire et réinitialiser la partie. Le numéro de génération et le nombre de cellules vivantes sont affichés.

Prérequis : Node.js et pnpm. Depuis le dossier `game-of-life/` :

```bash
pnpm install
pnpm dev
```

Vite affiche dans le terminal l'adresse locale à ouvrir dans un navigateur.

## Tests, qualité et couverture

Les commandes se lancent depuis le dossier du projet concerné.

Pour l'API :

```bash
cd fizzbuzz
mvn test
```

Les tests couvrent les règles métier, l'intégration MVC avec persistance H2 et un parcours HTTP de bout en bout. Le rapport JaCoCo est produit lors de la phase `verify` :

```bash
mvn verify
```

Pour le Jeu de la vie :

```bash
cd game-of-life
pnpm test
pnpm test:coverage
pnpm lint
pnpm build
```

Les tests unitaires portent notamment sur les règles de génération, le comptage des voisines et la manipulation de la grille.

## Organisation du dépôt

```text
.
├── fizzbuzz/       # API Spring Boot, tests et configuration Maven
└── game-of-life/   # application React/TypeScript, tests et configuration Vite
```
