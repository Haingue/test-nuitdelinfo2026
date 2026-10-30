# FizzBuzz API

API REST Spring Boot pour calculer FizzBuzz et conserver chaque résultat dans une base H2 en mémoire.
Commit 16

## Démarrer

Prérequis : Java 21 et Maven.

```bash
mvn spring-boot:run
```

## API

`POST /api/fizzbuzz` calcule et enregistre le résultat. Les multiples de 3 donnent `Fizz`, ceux de 5 `Buzz`, ceux des deux `FizzBuzz`, sinon le nombre sous forme de texte.

```bash
curl -i -X POST http://localhost:8080/api/fizzbuzz \
  -H 'Content-Type: application/json' \
  -d '{"number":15}'
```

Réponse `201 Created` : `{"id":1,"number":15,"result":"FizzBuzz"}`.

`GET /api/fizzbuzz/{id}` récupère un calcul enregistré. Un champ `number` manquant renvoie `400 Bad Request`; un identifiant inconnu renvoie `404 Not Found`.

## Tests

```bash
mvn test
```

- `FizzBuzzServiceTest` : règles métier avec repository mocké (unitaire).
- `FizzBuzzIntegrationTest` : requête MVC, validation et persistance H2 (intégration).
- `FizzBuzzE2ETest` : parcours HTTP complet sur un port aléatoire (E2E).
