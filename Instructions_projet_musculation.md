# Instructions projet — Programme musculation May

## Profil
- Intermédiaire (6 mois à 2 ans de pratique)
- Priorités musculaires : pecs, bras (biceps/triceps), abdos — dans cet ordre d'importance
- Jambes : pas nécessaire, vélo quotidien couvre déjà cardio + jambes
- Dos : entretien minimal uniquement (1 exercice/semaine), pas un objectif en soi
- Pas de douleur/blessure à adapter
- 3 séances/semaine, 45min-1h par séance
- En salle

## Structure du programme actuel
- Séance A : Pecs + Abdos
- Séance B : Bras (Biceps/Triceps) + Abdos
- Séance C : Pecs + Bras + Abdos + dos (entretien minimal)

## Sélection d'exercices (basée sur le classement Nassim Sahili)
- Pecs : dips (barres parallèles) et développé légèrement décliné en exercices principaux, écarté poulie assis stabilisé en isolation. Éviter : squeeze press, écarté poulie en marchant vers l'avant. Développé incliné classique = optionnel selon morphologie.
- Triceps : extensions trichées et dips lestés sur banc en priorité. Éviter : kick-back, développé couché serré, extensions poulie en supination.
- Biceps : curl à la poulie basse et tractions supination en priorité. Éviter : drag curl, curl barre EZ classique.
- Abdos : seulement 2 exercices (crunch + relevé de jambes), avec progression de charge/reps — pas de circuit à 5 exercices ni de rotation/twist en plus (déjà couvert indirectement).
- Important : aucune réduction de graisse localisée n'est possible — la visibilité des abdos dépend de l'alimentation globale, pas du volume d'entraînement abdos.

## Structure macrocycle (6 mois, en cours)
- Mésocycle 1 (semaines 1-8) : Force — 4-8 reps, repos 2-3min, charges lourdes
- Mésocycle 2 (semaines 9-16) : Prise de muscle — 8-15 reps, repos 45sec-2min
- Mésocycle 3 (semaines 17-24) : Perte de gras — reps/charges maintenues, densité de travail augmentée (repos réduits progressivement)
- Deload optionnel : pas de semaine dédiée, intégré aux 2-3 derniers jours du microcycle overreaching (charges -40 à -50%, volume divisé par 2) si besoin ressenti — sinon on enchaîne directement sur le mésocycle suivant
- Chaque mésocycle se découpe en 3 microcycles (stress mécanique → stress métabolique/consolidation → overreaching)
- Les exercices restent identiques sur tout le macrocycle ; seules les variables (reps/charges/repos) changent

## Détail des séances (exercices, valable sur tout le macrocycle)

Les reps/charges/repos à appliquer à chaque exercice dépendent du mésocycle et microcycle en cours (voir tableaux macrocycle plus haut) — sauf le bloc abdos qui suit sa propre progression indiquée plus bas.

### Séance A — Pecs + Abdos

**Échauffement (5 min)** : rotations d'épaules + quelques pompes légères

**En salle** :
- Développé légèrement décliné (barre ou haltères)
- Écarté à la poulie vis-à-vis, assis (version stabilisée)
- Dips aux barres parallèles

*Note morphologie* : le développé incliné classique dépend de la morphologie (cage thoracique, sternum) — à alterner avec le décliné seulement si bien ressenti, sinon rester sur le décliné.

**Bloc abdos** : Crunch à la poulie haute (lesté) + Relevé de jambes suspendu (barre de traction)

### Séance B — Bras (Biceps / Triceps) + Abdos

**Échauffement (5 min)** : rotations poignets/coudes

**En salle** :
- Curl à la poulie basse (meilleur exercice biceps du classement)
- Tractions supination (chin-ups — compound, 2e meilleur biceps)
- Extensions trichées (haltères — barre au front + pullover enchaînés, meilleur exercice triceps)
- Dips triceps sur banc (disques sur les cuisses, 2e meilleur triceps)

**Bloc abdos** : Crunch à la poulie haute + Relevé de jambes suspendu (barre de traction)

### Séance C — Pecs + Bras + Abdos (+ dos, entretien minimal)

**Échauffement (5 min)** : mobilité épaules/poignets

**En salle** :
- Développé à la machine convergente ou écarté poulie assis (pecs, variété vs séance A)
- Superset : curl marteau (brachial, variété) + dips triceps sur banc
- Tirage vertical prise supination ou tractions pronation *(dos, entretien seulement — 1 seul exercice, pas plus)*

**Bloc abdos** : identique aux séances A/B

## Fonctionnalités de l'application (à jour)

L'application (Astro + Supabase + Vercel, `carnet-renfo.vercel.app`) couvre aujourd'hui :

**Suivi du programme salle**
- Compteur de séances validées (0 à 72), fait avancer automatiquement la rotation A → B → C → A…
- Calcul automatique de la position (semaine, mésocycle, microcycle) à partir du compteur — pas de date impliquée
- Réglages manuels : ajuster le compteur, annuler la dernière séance validée

**Séances salle**
- Pour chaque exercice : champs kg/reps (pré-remplis avec la dernière charge enregistrée), bouton "✓ Fait" qui enregistre la série et lance le minuteur de repos
- Compteur de séries par exercice (X/Y séries), objectif de séries calculé selon la catégorie de l'exercice (principal/isolation/abdo/dos) et la phase du microcycle en cours
- Champ "kg" optionnel/masqué pour les exercices sans charge (ex. Relevé de jambes suspendu)
- États visuels : exercice en cours mis en évidence, exercice terminé passé en vert, progression automatique vers le suivant dès la dernière série validée
- Réorganisation de l'ordre des exercices à la volée (boutons ▲▼), utile selon la disponibilité des machines
- Dernier repos automatiquement désactivé après la dernière série du dernier exercice (fin de séance)
- Étiquette de groupe musculaire colorée (Pecs/Bras/Abdos/Dos) sur chaque exercice
- Fiche "ⓘ Infos" par exercice : lien vidéo, étapes d'exécution, GIF illustrant le mouvement (exercices salle uniquement pour le moment)

**Minuteur de repos**
- Décompte visuel avec vibration + bip sonore à la fin, disparition immédiate à 0
- Bouton "Passer" pour l'interrompre manuellement

**Séances poids du corps (hors salle)**
- Accessible via le bouton "Séance poids du corps" en haut de l'appli, complètement indépendant de la progression salle (aucun impact sur le compteur, aucune charge suivie)
- 2 circuits full-body (Full-body A et B), sourcés de vidéos de circuits réels (Brieuc Le Dantec)
- Déroulé exercice par exercice avec repos de 30 sec entre chaque exercice, minuteur d'effort pour les exercices à tenue statique
- Badge "Tour X", bouton "Refaire un tour !" en fin de circuit (relance un repos de 1 min 30 puis reprend au premier exercice)
- Fiches "Infos" avec vidéo et étapes (pas de GIF pour l'instant)

**Progressive Web App (PWA)**
- Installable sur mobile (icône sur l'écran d'accueil, ouverture en plein écran)
- Fonctionne hors connexion pour la consultation (dashboard, liste d'exercices, instructions, GIFs) grâce à un service worker qui met en cache les pages visitées
- Limite assumée : enregistrer une série ou valider une séance nécessite toujours une connexion (écriture Supabase en temps réel) — pas de file d'attente hors ligne pour le moment

**Fiabilité Supabase**
- Ping automatique programmé (GitHub Actions, lundi/jeudi) pour éviter la mise en pause du projet Supabase après 7 jours d'inactivité

## Suivi (à mettre à jour au fil du temps)
- Nombre de séances validées depuis le début du macrocycle : [à compléter] / 72
- Note : la progression se base sur ce compteur de séances validées, pas sur des dates — rater une séance ne décale rien, il suffit de reprendre au prochain numéro non validé
- Charges actuelles sur les mouvements clés : [à compléter]

## Consignes pour Claude
- Quand je demande le détail d'un microcycle, se référer au fichier programme périodisé complet et sortir uniquement les séances de la semaine/microcycle demandé, avec les bonnes reps/charges/repos.
- Si je fournis de nouvelles vidéos ou sources sur des exercices, les intégrer en gardant la même logique (résumer le classement, dire ce qui change, mettre à jour le fichier).
- Poser des questions de clarification si un ajustement demandé est ambigu, plutôt que de supposer.
