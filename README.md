# Natan Feyisa — Portfolio

Personal portfolio site for Natan Feyisa (Backend & Full-Stack Developer). Static HTML/CSS/JS — no build step, no dependencies, deploys anywhere that serves static files (GitHub Pages, Netlify, Vercel, etc).

## File structure

```
nathan-portfolio/
├── index.html          Page markup (nav, hero, about, skills, projects, contact, footer)
├── style.css            All styling — theme tokens, layout, animations
├── script.js             All behavior — themes, spotlight, flip card, nav, scroll reveal
└── images/
    ├── profile-photo.jpg   Hero "photo" face
    ├── avatar-photo.png    Hero "avatar" face (flips with the photo)
    ├── avatar.svg           Older avatar graphic, no longer referenced — safe to delete
    ├── certificate.jpg      Cisco cert, linked from About
    ├── Natan-Feyisa-CV.pdf  Résumé, linked from nav + hero
    ├── gulit-screenshots.pdf
    └── email.png / github.png / linkedin.png / phone.png / telegram.png   Contact icons
```

## Running it locally

No build tools needed. Either:

- Open `index.html` directly in a browser, or
- Serve the folder so relative paths behave the same as in production:
  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```

## Deploying

Push the folder to a GitHub repo and enable **GitHub Pages** (Settings → Pages → deploy from branch), or drag the folder into Netlify/Vercel. No environment variables or build commands required.

## Features

### Theme system (4 themes)
- **terminal** (default) — dark, amber + mint
- **mono** — black & white, no hue
- **nightshift** — violet + lime
- **paper** — broken-white / light theme

Switch themes with the swatch buttons in the nav, top right. The choice is saved in `localStorage` (`nf-theme`) and restored on the next visit — including before CSS loads, via the inline script in `<head>`, to avoid a flash of the wrong theme.

**Auto-cycle:** the "auto" button in the nav rotates through all four themes automatically every 5 seconds. It's also remembered across visits (`nf-theme-auto`). Picking a swatch manually turns auto-cycling back off.

Every color used across the site (nav background, buttons, tags, shadows, icon filters, cursor glow) is driven by CSS custom properties defined per-theme at the top of `style.css`, so adding a 5th theme just means adding one more `[data-theme="..."]` block — no other file needs to change.

### Cursor spotlight
A soft glow follows the mouse across the whole page, plus a tighter glow follows it inside project/contact/cert cards on hover. Colors come from the same per-theme variables as the rest of the site, so the glow automatically matches whichever theme is active. Disabled on touch devices and for users with reduced-motion preferences.

### Hero flip card
The circular photo in the hero flips between the real photo and an illustrated avatar:
- **Click / tap / Enter / Space** flips it manually.
- It also flips **automatically every 90 seconds**.
- About **1.4 seconds after the page first loads**, it does one intro flip so visitors notice it's interactive.
- Every flip (manual or automatic) triggers a small bounce/"jump" animation on the ring.
- All of the above is skipped for users with `prefers-reduced-motion` enabled — the card still flips on click, just without the animation.

### Other details
- Cipher-style scramble/decode animation on the hero name.
- Scroll-triggered reveal animations on major sections.
- Sticky nav with active-link highlighting and a mobile hamburger menu.
- Fully responsive down to small phones.

## Customizing

- **Content:** all copy, links, and project entries live directly in `index.html`.
- **Colors:** edit the CSS custom properties in the `[data-theme="..."]` blocks at the top of `style.css`.
- **Auto-cycle timing:** change the `5000` (ms) interval in the `startAutoCycle()` function in `script.js`.
- **Flip card timing:** change the `90000` (ms) interval near the bottom of the flip-card section in `script.js`.

## Contact

- Email: nathanfeyisa6@gmail.com
- GitHub: [github.com/natty-fe](https://github.com/natty-fe)
- LinkedIn: [linkedin.com/in/nathanfeyisa](https://www.linkedin.com/in/nathanfeyisa/)
