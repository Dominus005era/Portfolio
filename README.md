# Rahul Kushwaha — Portfolio
**Elite, minimal, and fully animated.** A high-performance personal portfolio built with pure HTML, CSS, and JavaScript.

## 🚀 Quick Start
1.  Download the project folder.
2.  Open `index.html` in any browser.
3.  **No dependencies, no build tools, no install required.**

## 📂 Project Structure
* `index.html` — Content & Structure
* `style.css` — Visuals & Theme (Emerald/Teal)
* `script.js` — Animations & Logic

---

## 🛠️ How to Customize

### 1. Content (`index.html`)
* **Name:** Search for `hero-title`.
* **Socials:** Search for `hero-socials` and update the `href` links.
* **Projects/Exp:** Duplicate the `.project-card` or `.exp-item` blocks.
* **Photo:** Replace the `.avatar-initials` span with an `<img>` tag.

### 2. Animations (`script.js`)
* **Subtitles:** Edit the `TYPED_STRINGS` array at the top of the file.
* **Features:** Toggle `LOADER_ENABLED`, `CURSOR_ENABLED`, or `NOISE_ENABLED` (set to `true/false`).

### 3. Visuals (`style.css`)
* **Colors:** Change `--color-accent` and `--color-bg` at the top of the file inside the `:root` block.
* **Fonts:** Update `--font-heading` and `--font-body`.

---

## 📨 Contact Form Setup
By default, the form is **simulated**. To receive real emails:
1.  Create a free account at [Formspree.io](https://formspree.io).
2.  Get your Form ID.
3.  In `script.js`, find **Option A** and replace the ID in the URL.

---

## 🌐 Deployment
* **GitHub Pages:** Push to a repo → Settings → Pages → Enable.
* **Netlify:** Drag and drop the folder into the Netlify dashboard.
* **Vercel:** Connect your GitHub repo and click deploy.

---
*Built for impact. Designed for the future.*
