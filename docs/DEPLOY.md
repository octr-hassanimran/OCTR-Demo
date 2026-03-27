# Deploying the OCTR demo (share with your cofounder)

This app is **Next.js 14**. The simplest way to get a **stable URL** anyone can open in a browser is **[Vercel](https://vercel.com)** connected to a **Git** remote (GitHub, GitLab, or Bitbucket).

You do **not** need extra security for a small team: share the `*.vercel.app` link only with people you trust.

---

## One-time setup

### 1. Put the code on GitHub (or GitLab / Bitbucket)

From the project root (this folder):

```bash
git add .
git commit -m "chore(deploy): prepare repo for Vercel"
```

Create a **new empty** repository on GitHub (no README/license if you already have files here), then:

```bash
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git branch -M main
git push -u origin main
```

If the repo already exists and only this machine needs to push, use your org’s remote URL and credentials/SSH as usual.

### 2. Import the repo in Vercel

1. Sign in at [vercel.com](https://vercel.com) (GitHub login is fine).
2. **Add New… → Project** → **Import** your repository.
3. **Framework preset**: Next.js (auto-detected).
4. **Root directory**: `.` (repository root — leave default unless this app lives in a subfolder).
5. **Build & Output**: defaults are correct (`npm run build`, Next.js output).
6. Click **Deploy**.

After the first deploy succeeds, Vercel shows a **Production URL** (for example `https://octr-demo-xxxxx.vercel.app`). That is the link to send your cofounder.

### 3. Ongoing workflow (develop without breaking the live demo)

- **Production URL** = latest deploy from your chosen **production branch** (default: `main`).
- Work on **feature branches** or a `dev` branch locally; merge to `main` when you want the shared site to update.
- Optional: in Vercel → Project → **Settings → Git**, set **Production Branch** to `main` (or a branch like `demo` if you prefer a slower release cadence).

Every push to the production branch triggers a new deployment automatically.

---

## Deploy from the CLI (optional)

If you prefer not to use the Git integration:

```bash
npm install
npx vercel        # preview deployment
npx vercel --prod # production deployment
```

Follow the prompts to link the folder to a Vercel project. The CLI prints a URL when the deploy finishes.

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| Build fails on Vercel | Run `npm run build` locally and fix errors; ensure `package-lock.json` is committed so installs match. |
| Wrong Node version | Vercel picks a compatible Node for Next 14; add `"engines": { "node": ">=18" }` in `package.json` if you need to pin. |
| Dropbox sync conflicts | Avoid editing the same files on two machines without committing; keep `node_modules` and `.next` ignored (already in `.gitignore`). |

---

## Quick reference

| Goal | Action |
|------|--------|
| Share with cofounder | Send the **Production** URL from the Vercel dashboard. |
| Update the live site | Push to the **production branch** (usually `main`). |
| Try changes safely | Use a branch + **Preview** deploy (default when Git is connected). |
