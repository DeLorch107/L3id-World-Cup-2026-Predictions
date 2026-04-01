# ⚽ FIFA World Cup 2026 — Bracket Predictor

A beautiful, interactive bracket prediction app for the 2026 FIFA World Cup featuring all 48 teams, group stage predictions, knockout rounds, and image export.

## 🌍 Features

- **Group Stage** — Rank all 4 teams in each of the 12 groups (A–L)
- **Best 3rd Place Teams** — Select which 8 of the 12 third-place teams advance
- **Full Knockout Bracket** — Round of 32 → Round of 16 → QF → SF → Final
- **Country Flags + Names** — All 48 teams with emoji flags
- **Image Export** — Download group stage and knockout bracket as PNG images
- **Champion Reveal** — Confetti celebration when you pick your winner

## 📋 All 48 Teams (as drawn December 2026)

| Group | Teams |
|-------|-------|
| A | Mexico, South Africa, South Korea, Czechia |
| B | Canada, Bosnia-Herzegovina, Qatar, Switzerland |
| C | Brazil, Morocco, Haiti, Scotland |
| D | USA, Paraguay, Australia, Türkiye |
| E | Germany, Curaçao, Ivory Coast, Ecuador |
| F | Netherlands, Japan, Sweden, Tunisia |
| G | Belgium, Egypt, Iran, New Zealand |
| H | Spain, Cape Verde, Saudi Arabia, Uruguay |
| I | France, Senegal, Iraq, Norway |
| J | Argentina, Algeria, Austria, Jordan |
| K | Portugal, DR Congo, Uzbekistan, Colombia |
| L | England, Croatia, Ghana, Panama |

## 🚀 Deploy to Vercel (Step-by-Step)

### Option A: Vercel CLI (Recommended — fastest)

1. **Install Node.js** if you haven't: https://nodejs.org

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Open terminal in this folder** (the folder with index.html)

4. **Deploy**:
   ```bash
   vercel
   ```

5. **Follow the prompts**:
   - Login or create account when prompted
   - "Set up and deploy?" → **Y**
   - "Which scope?" → Select your account
   - "Link to existing project?" → **N**
   - "Project name?" → `wc2026-bracket` (or anything you like)
   - "In which directory is your code?" → **.** (just press Enter)
   - "Want to override settings?" → **N**

6. ✅ You'll get a URL like `https://wc2026-bracket.vercel.app`

### Option B: Vercel Dashboard (No CLI needed)

1. Go to **https://vercel.com** and sign up / log in

2. Click **"Add New Project"**

3. Choose **"Upload"** (or connect GitHub — see Option C)

4. **Drag and drop** the entire `wc2026-bracket` folder into Vercel

5. Click **Deploy** → Done! ✅

### Option C: Via GitHub (Best for updates)

1. Create a new repo on **https://github.com/new**

2. Upload these files to the repo (drag & drop or git push)

3. On **https://vercel.com**, click **"Add New Project"**

4. **Import** your GitHub repo

5. Leave all settings as default → Click **Deploy**

6. Every time you push to GitHub, Vercel auto-deploys! ✅

---

## 🔧 Local Development

To run locally before deploying:

```bash
# Option 1: Python (usually pre-installed)
python3 -m http.server 3000
# Then open: http://localhost:3000

# Option 2: Node.js
npx serve .
# Then open: http://localhost:3000
```

---

## 📁 File Structure

```
wc2026-bracket/
├── index.html     # Main HTML structure
├── style.css      # All styles (dark luxury theme)
├── data.js        # 48 teams, groups, bracket rules
├── app.js         # Full app logic
├── vercel.json    # Vercel deployment config
└── README.md      # This file
```

---

## 🏆 Tournament Format

- **48 teams** in **12 groups of 4**
- Top 2 from each group + best 8 third-place teams = **32 teams** advance
- **Round of 32** → **Round of 16** → **Quarter-Finals** → **Semi-Finals** → **Final**
- Third-place match between SF losers
- Tournament: **June 11 – July 19, 2026**

---

Built with vanilla HTML/CSS/JS — no frameworks needed. 🎉
"# L3id-World-Cup-2026-Predictions" 
