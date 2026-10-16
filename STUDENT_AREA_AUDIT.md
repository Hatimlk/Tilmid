# Audit produit et technique — Espace étudiant Mouwakaba

Date : 16 octobre 2026  
Périmètre : application React/Vite, API Node/Express, routeur PHP de production, schémas MySQL/MariaDB, espace étudiant, administration et page commerciale Mouwakaba.

## Résumé exécutif

L'application possède déjà une authentification étudiant, une isolation des données par propriétaire, trois formules commerciales, un espace administrateur, des modules d'apprentissage, une bibliothèque, des plans, objectifs, habitudes, révisions, check-ins, feedbacks, notifications et séances. La stratégie retenue est donc une amélioration incrémentale, sans réécriture.

Les priorités sont : conserver une seule politique d'accès côté serveur, fiabiliser les états de complétion et le minuteur, rendre le tableau de bord réellement actionnable, puis enrichir les contenus et le coaching sans créer de fausses données. Le backend Node dispose désormais d'une politique d'entitlements centralisée et testée. Le routeur PHP doit recevoir la même extraction avant le prochain déploiement afin d'éviter toute dérive entre les deux implémentations.

## Architecture observée

- Frontend : React 18, TypeScript, Vite, Tailwind CSS, React Router et i18next.
- État : hooks React par module ; données métier persistées via l'API, avec quelques fonctions futures encore conservées en `localStorage`.
- API locale : Node/Express dans `server/`.
- API de production : routeur PHP compatible dans `server-php/`.
- Données : MySQL/MariaDB ; schéma versionné dans `server/schema.sql` avec migrations PHP.
- Authentification : JWT d'une journée, compte relu à chaque requête, invalidation après suspension ou changement de mot de passe.
- Autorisation : rôles admin/étudiant, résolution explicite du propriétaire, contrôles de propriété couverts par des tests black-box.
- Internationalisation : infrastructure français/arabe et direction RTL globale, mais une partie importante de l'espace étudiant reste écrite directement en français.

## Fonctionnalités existantes à préserver

- Connexion étudiant, gestion des erreurs et statut de compte.
- Navigation desktop/mobile, profil et formule active.
- Tableau de bord avec prochaine action, progression réelle, planning et activité.
- Plan personnel et plan coach, objectifs et étapes.
- Planning hebdomadaire/liste, création, modification, suppression et complétion.
- Progression calculée depuis les actions réelles.
- Modules vidéo avec reprise et enregistrement de progression.
- Bibliothèque de ressources administrées, recherche et téléchargement.
- Habitudes, suivi des révisions, minuteur et objectifs.
- Séances individuelles et collectives avec inscriptions.
- Check-ins soumis selon la formule.
- Feedback coach, notifications lues/non lues.
- Administration des étudiants, coachs, plans, séances, contenus, ressources et notifications.
- Isolation des données étudiant et contrôles d'accès aux routes sensibles.

## Matrice exacte des trois formules

Sources : `src/constants/mouwakabaPacks.ts`, `src/utils/entitlements.ts` et `server/entitlements.js`.

| Règle | Essentiel — 299 DH | Boost — 599 DH | Premium — 999 DH |
|---|---:|---:|---:|
| Accès plateforme | sept. 2026 à juin 2027 (10 mois) | Tout Essentiel | Tout Essentiel + Boost |
| Contenus | 10 vidéos essentielles, 5 axes | Inclus | Inclus |
| Outils / bibliothèque | Inclus | Inclus | Inclus |
| Accompagnement collectif | Groupe WhatsApp + 1 session de 60 min | Inclus | Inclus |
| Plan personnalisé | Non | 30 jours | 90 jours |
| Coaching individuel | 0 | 1 × 45 min | 3 × 45 min |
| Check-ins | 0 | 1 à 14 jours + feedback | Tous les 14 jours + feedback |
| Feedback personnel | Non | Oui | Oui |
| Rapport final | Non | Non | Oui |

Les textes commerciaux excluent les messages privés individuels, la correction d'exercices/matières et l'accompagnement individuel quotidien. Aucun prix, nom ou avantage n'a été modifié.

## Problèmes et risques constatés

### P0 — sécurité, règles commerciales et fiabilité

- Les règles étaient centralisées côté React mais répétées sous forme de noms de formules dans les APIs. Le serveur Node utilise maintenant une politique unique ; le routeur PHP reste à aligner.
- Il existe deux backends fonctionnellement similaires. Toute évolution doit être appliquée et testée sur les deux avant production.
- La durée commerciale/expiration est décrite sur la page d'offre mais le modèle étudiant ne contient pas encore de période d'activation/expiration explicite. Une formule non nulle est donc traitée comme active.
- Les quotas de coaching comptent les rendez-vous non annulés, mais il manque encore une table d'usage/audit générique et idempotente.
- Le suivi vidéo considère 90 % visionné comme terminé. C'est une règle de consommation, pas une preuve universelle de maîtrise.
- Le minuteur et la récupération après interruption demandent une campagne de tests dédiée : rechargement, pause, multi-onglets et double soumission.

### P1 — expérience étudiante

- Plusieurs écrans contiennent des chaînes françaises directement dans les composants ; l'arabe n'est donc pas complet malgré i18next/RTL.
- Le planning propose semaine et liste, mais pas encore jour/mois, récurrence, duplication ni détection de chevauchement.
- La feuille de route ne possède pas encore tous les états de cycle de vie demandés ni un historique des modifications coach/étudiant.
- Les feedbacks sont essentiellement un message libre ; ils ne structurent pas encore progrès, axes d'amélioration, actions et ressources.
- Les séances n'ont pas encore de préparation guidée ni de suivi d'actions relié au plan.
- Le dashboard ne dispose pas encore d'un centre de délais académiques vérifiés.

### P2 — contenu et qualité

- Les modules ne modélisent pas encore leçons, objectifs pédagogiques, durée, pièces jointes et quiz.
- La bibliothèque ne possède pas encore favoris, prévisualisation, niveau scolaire et type de fichier complets.
- Le bundle principal dépasse 500 kB minifié et la vidéo MOV publique pèse environ 107 MB ; découpage et stratégie média sont nécessaires.
- Les appels de données ont surtout des squelettes/états vides mais peu d'états d'erreur actionnables.

## Architecture de l'information proposée

1. Accueil : ma journée, prochaine action, progrès, prochain événement, recommandation coach.
2. Mon parcours : plan, planning, progression, objectifs.
3. Apprendre : reprendre, modules, bibliothèque, notes.
4. Mes outils : habitudes, minuteur/révisions, méthodes.
5. Mouwakaba : séances, check-ins, feedbacks.
6. Notifications et profil : formule, préférences, langue, sécurité et support.

Cette structure conserve les repères actuels tout en rapprochant les objectifs du parcours et le minuteur des outils.

## Composants prioritaires à modifier

- `StudentArea`, `StudentHeader`, `navigation` : navigation compacte, traduction complète et gestion des erreurs.
- `DashboardHome` : ordre des priorités, prochaine action et recommandation coach réelle.
- `MonPlan`, `Planning`, `Progression` : cycle de vie, vues calendrier, validations et métriques temporelles.
- `MesOutils` : minuteur robuste, historique des habitudes et étapes d'objectifs.
- `MesContenus`, `RestrictedVideo` : modèle leçon/ressource/quiz et règle de complétion explicite.
- `Bibliotheque` : filtres réels, métadonnées, favoris et aperçu.
- `Coaching`, `CheckIns`, `Feedback` : quotas visibles, préparation, historique et actions reliées.
- Primitives étudiant : bannière d'erreur, toast, confirmation, focus modal et skeleton communs.

## Changements backend et base requis

- Ajouter aux abonnements `activated_at`, `expires_at`, `status` et une trace des changements sans supprimer l'historique.
- Généraliser une table d'utilisation idempotente pour quotas et événements de complétion.
- Ajouter états/dates/récurrence au planning et indexer les requêtes par étudiant/date.
- Ajouter fréquence et historique des habitudes au lieu d'un tableau hebdomadaire écrasable.
- Ajouter étapes mesurables et archivage aux objectifs.
- Structurer modules, leçons, ressources, quiz, tentatives et notes.
- Structurer feedbacks, recommandations et actions, avec états lu/non lu.
- Ajouter préférences de notification et délais académiques uniquement depuis des sources vérifiées.
- Conserver des migrations additives et rétrocompatibles ; aucune suppression de données existantes.

## Plan d'implémentation priorisé

1. P0 : parité Node/PHP des entitlements, activation/expiration, tests de quotas et audit de migrations.
2. P0 : fiabilisation du minuteur, complétions idempotentes et synchronisation dashboard/progression.
3. P1 : tableau de bord actionnable et roadmap avec états réels.
4. P1 : planning jour/semaine/mois/liste, chevauchements, duplication et récurrence.
5. P1 : objectifs/habitudes historiques et progression par matière basée sur données réelles.
6. P2 : modèle de contenus/leçons/quiz, bibliothèque enrichie et coaching structuré.
7. P2 : traduction complète FR/AR, tests RTL, accessibilité et optimisation du bundle/média.
8. P3 : délais vérifiés, notes, recommandations par règles et calendrier externe optionnel.

## Améliorations réalisées pendant cet audit

- Centralisation des entitlements et quotas dans l'API Node.
- Contrôle des check-ins, plans personnalisés, contenus et inscriptions collectives via cette politique.
- Tests unitaires de la matrice et des comportements de refus.
- Filtres de bibliothèque basés sur les vraies matières, avec recherche + filtre réellement combinés.
- Indicateur dynamique des séances de coaching utilisées/restantes, sans décompter les annulations.
- Conservation des améliorations déjà présentes dans le worktree : complétion de planning, statistiques réelles, navigation mobile et synchronisation progression.

## Limites de cette livraison

- Le programme complet du brief représente plusieurs itérations produit et migrations ; il n'est pas sûr de le livrer en un seul changement.
- Les tests black-box complets nécessitent une base jetable nommée `tilmid_test` et un serveur lancé ; ils ne peuvent pas être exécutés sans cet environnement.
- Le routeur PHP conserve encore ses contrôles en ligne. Ils sont cohérents avec la matrice actuelle mais pas encore extraits dans un module partagé.
- Aucune date académique, ressource, recommandation ou disponibilité de coach fictive n'a été ajoutée.
