# Brief technique — Carnet de charge (musculation)
### Document de démarrage pour Claude Code

---

## 1. Objectif

Une page web personnelle (pas une app native) qui :
- Affiche automatiquement où j'en suis dans mon programme de musculation (macrocycle → mésocycle → microcycle)
- Propose la prochaine séance à faire (rotation A → B → C)
- Liste les exercices de cette séance avec les reps/repos cibles du microcycle en cours
- Permet d'enregistrer la charge (poids/reps) utilisée à chaque exercice et affiche la dernière charge enregistrée
- Garde tout l'historique de façon fiable, accessible depuis n'importe quel appareil/navigateur

Usage : solo, principalement sur téléphone (Chrome) à la salle de sport, ajout à l'écran d'accueil plutôt qu'app native.

---

## 2. Décisions déjà prises

| Sujet | Décision | Raison |
|---|---|---|
| Format | Page web (HTML/JS), pas d'app native | Stack déjà maîtrisée, zéro coût de distribution, mise à jour instantanée |
| Hébergement | Sur mon infra existante (GitHub → Vercel), même logique que mes autres sites | Déjà en place, familier |
| Stockage des données | Base externe (Supabase, offre gratuite) plutôt que localStorage | localStorage serait limité à un seul appareil/navigateur ; besoin d'accès multi-appareils et de fiabilité dans la durée |
| Progression dans le programme | Basée sur un **compteur de séances validées**, pas sur des dates | Rater une séance ne doit pas décaler le calendrier — le programme avance seulement quand une séance est cochée |
| Deload | Optionnel, intégré aux 2-3 derniers jours du microcycle "overreaching" — pas de semaine dédiée | Éviter de complexifier le calendrier avec des semaines hors-séquence |

---

## 3. Logique fonctionnelle (déjà validée dans un prototype Claude)

Un prototype fonctionnel existe déjà en HTML/JS (artefact Claude, fichier `carnet_de_charge.html`) avec toute la logique ci-dessous déjà écrite et testée — **à réutiliser comme base plutôt qu'à recoder de zéro**. Seul le mécanisme de stockage doit être remplacé (`window.storage`, spécifique à l'environnement Claude, → appels API Supabase).

### Calcul de position
```
séances validées (compteur) → prochain index = compteur + 1
semaine = ceil(prochain index / 3), plafonnée à 24
séance à faire = rotation [A, B, C][(prochain index - 1) % 3]
```
Total du macrocycle : 24 semaines × 3 séances/semaine = **72 séances**.

### Structure macro/méso/micro

| Mésocycle | Semaines | Objectif |
|---|---|---|
| 1 — Force | 1-8 | Charges lourdes |
| 2 — Prise de muscle | 9-16 | Volume |
| 3 — Perte de gras | 17-24 | Densité de travail |

Chaque mésocycle se découpe en 3 microcycles :

| Microcycle | Semaines (relatif au méso) | Logique |
|---|---|---|
| 1 — Stress mécanique | 1-3 | Reps courtes, repos longs, charges élevées |
| 2 — Stress métabolique / Consolidation | 4-6 | Reps longues, repos courts, charges modérées |
| 3 — Overreaching | 7-8 | +volume, +intensité, techniques d'intensification, deload optionnel en fin de microcycle |

Détail reps/repos par microcycle (déjà dans le prototype, table `PROGRAM` en JS) :

| Mésocycle | Micro 1 | Micro 2 | Micro 3 |
|---|---|---|---|
| Force | 6-8 reps / 2-3 min | 4-6 reps / 3 min | 4-6 reps / 3 min |
| Prise de muscle | 8-10 reps / 1min30-2min | 10-15 reps / 45sec-1min | 10-15 reps / 45sec-1min |
| Perte de gras | 10-15 reps / 1 min | 10-15 reps / 45 sec | 10-15 reps / 30-45 sec |

### Exercices par séance (salle uniquement)

**Séance A — Pecs + Abdos**
Développé couché barre · Développé légèrement décliné · Écarté poulie vis-à-vis assis · Dips barres parallèles · Crunch poulie haute · Relevé de jambes

**Séance B — Bras + Abdos**
Curl poulie basse · Tractions supination · Curl incliné haltères · Extensions trichées · Dips triceps sur banc · Crunch poulie haute · Relevé de jambes suspendu

**Séance C — Pecs + Bras + Abdos + Dos**
Développé machine convergente · Curl marteau · Dips triceps sur banc · Tirage vertical/Tractions (dos) · Crunch poulie haute · Relevé de jambes

---

## 4. Modèle de données (à créer dans Supabase)

Deux tables suffisent :

**`progress`** (une seule ligne, ou clé-valeur)
| Colonne | Type | Description |
|---|---|---|
| completed_count | integer | Nombre total de séances validées depuis le début du macrocycle |

**`exercise_logs`**
| Colonne | Type | Description |
|---|---|---|
| id | uuid | clé primaire |
| exercise_name | text | nom de l'exercice (identique à la liste ci-dessus) |
| date | date | date de la séance |
| poids | numeric | charge utilisée (kg) |
| reps | integer | répétitions réalisées |

Requêtes nécessaires : lire le dernier `exercise_logs` par `exercise_name` (pour afficher "dernière fois"), insérer une nouvelle ligne à chaque enregistrement, lire/incrémenter `completed_count` dans `progress`.

Comme c'est un usage strictement personnel (pas de multi-utilisateur), une clé API Supabase simple suffit — pas besoin de gérer l'authentification utilisateur.

---

## 5. Design (déjà défini dans le prototype)

- **Palette** : fond anthracite chaud (#17140f), panneaux (#221d16 / #2b241a), accent laiton/or (#c99a3e), couleurs de phase microcycle (bleu-acier #6f8fa8 pour mécanique, ambre #b3763f pour métabolique, rouille #c15b3c pour overreaching)
- **Typographie** : Oswald (titres, condensé/industriel) + Inter (texte courant) + JetBrains Mono (chiffres — poids, reps, semaines)
- **Signature visuelle** : barre de 24 segments représentant les semaines du macrocycle, colorée par type de microcycle, avec la semaine actuelle mise en évidence
- Mobile-first, gros boutons, priorité à la lisibilité en salle de sport (peu de scroll, une action = un tap)

---

## 6. Ce qui reste à trancher (pas encore décidé)

- Nom de domaine / sous-domaine à utiliser pour héberger la page
- Répo dédié ou intégration dans un site existant (ex: nouvelle route sur un site déjà en place)
- Gestion des clés Supabase (variables d'environnement Vercel)
- Mode hors-ligne : non retenu pour l'instant (jugé non nécessaire pour cet usage), à reconsidérer seulement si besoin réel constaté
- Notifications : non retenues (nécessiteraient une app native), pas dans le périmètre actuel

---

## 7. Fichiers de référence disponibles

- `carnet_de_charge.html` — prototype fonctionnel complet (logique JS de calcul de position + rendu, à adapter pour Supabase)
- `Programme_periodise_6mois.md` — programme complet avec macrocycle/mésocycle/microcycle détaillé + visuels
- `Liste_exercices_instructions.md` — chaque exercice avec instructions d'exécution pas à pas et source vidéo
- `Instructions_projet_musculation.md` — résumé du profil et des préférences de contenu
