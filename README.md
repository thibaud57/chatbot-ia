# Chatbot IA

Une interface de chat moderne permettant d'interagir avec différents modèles d'IA (Claude et ChatGPT).

## Fonctionnalités

- Interface de chat moderne et responsive
- Support de plusieurs modèles d'IA :
  - Claude (Anthropic) : `claude-3-5-sonnet-20241022`
  - GPT-4 (OpenAI) : `gpt-4-0125-preview`
  - GPT-4 O1 (OpenAI) : `o1-2024-12-17`
- Formatage du code avec coloration syntaxique
- Historique des conversations
- Sélection facile du modèle à utiliser

## Prérequis

- Node.js (v18 ou supérieur)
- Angular CLI
- Compte Anthropic (pour Claude)
- Compte OpenAI (pour GPT-4)

## Installation

1. Cloner le repository :

```bash
git clone [URL_DU_REPO]
cd [NOM_DU_DOSSIER]
```

2. Installer les dépendances :

```bash
npm install
cd functions
npm install
```

3. Configurer les variables d'environnement :
   - Copier le fichier `.env.example` vers `.env` dans le dossier `functions`
   - Remplir les variables suivantes :
     ```
     CLAUDE_API_KEY=votre_clé_api_claude
     OPENAI_API_KEY=votre_clé_api_openai
     REGION=us-central1
     ```

## Développement

1. Lancer le serveur de développement Angular :

```bash
ng serve
```

2. Lancer les fonctions Firebase en local :

```bash
cd functions
npm run serve
```

L'application sera disponible sur `http://localhost:4200`

## Déploiement

1. Construire l'application :

```bash
ng build --prod
```

2. Déployer sur Firebase :

```bash
firebase deploy
```

## Configuration des APIs

### Anthropic (Claude)

1. Créer un compte sur [console.anthropic.com](https://console.anthropic.com)
2. Générer une clé API
3. Ajouter la clé dans le fichier `.env`

### OpenAI (GPT-4)

1. Créer un compte sur [platform.openai.com](https://platform.openai.com)
2. Générer une clé API
3. Ajouter la clé dans le fichier `.env`

## Limites des Modèles

- Claude : 8192 tokens max
- GPT-4 : 4096 tokens max
- GPT-4 O1 : 4096 tokens max

## Structure du Projet

```
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── chat/
│   │   ├── services/
│   │   └── models/
│   └── environments/
└── functions/
    └── src/
        └── index.ts
```
