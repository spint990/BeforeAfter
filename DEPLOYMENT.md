# Déploiement sur Vercel

Ce guide vous explique comment déployer votre application BeforeAfter sur Vercel.

## Prérequis

- Un compte [GitHub](https://github.com)
- Un compte [Vercel](https://vercel.com) (gratuit)
- Le code de votre projet sur GitHub

## Étape 1 : Pousser le code sur GitHub

Si ce n'est pas déjà fait :

```bash
git init
git add .
git commit -m "Prepare for Vercel deployment"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/beforeafter.git
git push -u origin main
```

## Étape 2 : Créer le projet sur Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur **"Add New..."** > **"Project"**
3. Importez votre repository GitHub
4. Configurez le projet :
   - **Framework Preset** : Next.js (auto-détecté)
   - **Root Directory** : ./
   - **Build Command** : `prisma generate && prisma migrate deploy && next build`
   - **Output Directory** : .next

## Étape 3 : Ajouter la base de données PostgreSQL

1. Dans votre projet Vercel, allez dans l'onglet **"Storage"**
2. Cliquez sur **"Create Database"**
3. Sélectionnez **"Postgres"**
4. Choisissez une région proche de vos utilisateurs (ex: Paris pour la France)
5. Cliquez sur **"Create"**

Vercel va automatiquement ajouter les variables d'environnement :
- `DATABASE_URL` (pour les connexions poolées)
- `DIRECT_DATABASE_URL` (pour les migrations directes)
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

## Étape 4 : Ajouter le stockage Blob

1. Dans l'onglet **"Storage"**, cliquez sur **"Create Database"**
2. Sélectionnez **"Blob"**
3. Donnez un nom à votre store (ex: `beforeafter-blob`)
4. Cliquez sur **"Create"**

Vercel va ajouter la variable :
- `BLOB_READ_WRITE_TOKEN`

## Étape 5 : Configurer les variables d'environnement

Dans **Settings** > **Environment Variables**, vérifiez que vous avez :

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Auto (Postgres) |
| `DIRECT_DATABASE_URL` | Auto (Postgres) |
| `BLOB_READ_WRITE_TOKEN` | Auto (Blob) |
| `NEXT_PUBLIC_APP_URL` | `https://votre-app.vercel.app` |

## Étape 6 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine
3. Votre application est en ligne ! 🎉

## Étape 7 : Initialiser la base de données

Après le premier déploiement, vous devez seed la base de données :

1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur les **"..."** du dernier déploiement
3. Sélectionnez **"Redeploy"** avec les mêmes paramètres

Ou utilisez le CLI Vercel :

```bash
# Installer le CLI Vercel
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Exécuter les commandes Prisma
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

## Développement local avec PostgreSQL

Pour développer localement avec PostgreSQL (recommandé avant déploiement) :

### Option A : Docker (recommandé)

```bash
# Créer un container PostgreSQL
docker run --name beforeafter-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=beforeafter -p 5432:5432 -d postgres

# Mettre à jour le .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/beforeafter"
DIRECT_DATABASE_URL="postgresql://postgres:password@localhost:5432/beforeafter"

# Lancer les migrations
npx prisma migrate dev

# Seeder la base
npx prisma db seed
```

### Option B : Vercel Postgres en local

```bash
# Télécharger les variables d'environnement Vercel
vercel env pull .env.local

# Lancer le développement
npm run dev
```

## Dépannage

### Erreur : "P1001: Can't reach database server"

- Vérifiez que les variables `DATABASE_URL` et `DIRECT_DATABASE_URL` sont correctes
- Vérifiez que la base PostgreSQL est active dans Vercel

### Erreur : "BLOB_READ_WRITE_TOKEN is not configured"

- Vérifiez que le Blob Store est créé dans Vercel
- Vérifiez que la variable est présente dans Environment Variables

### Les images ne s'affichent pas

- Vérifiez que le Blob Store est correctement configuré
- Les URLs des images doivent commencer par `https://` et non `/uploads/`

## Commandes utiles

```bash
# Voir les logs en temps réel
vercel logs --follow

# Lister les déploiements
vercel list

# Ouvrir le dashboard
vercel inspect

# Exécuter une commande dans l'environnement de production
vercel env ls
```

## Ressources

- [Documentation Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Documentation Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [Documentation Prisma avec Vercel](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/vercel-postgres)
