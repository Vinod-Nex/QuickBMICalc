I’ll craft a comprehensive, stage‑wise prompt that you can feed into Anti‑Gravity with Gemini AI. It covers the full architecture, design, code, SEO, PWA, and deployment to Vercel for QuickBMICalc.com.
You’ll run one stage at a time, check the output, then move to the next.

Full Prompt (Copy & Paste into Anti‑Gravity)
text
You are an expert web developer and UI/UX designer. Build a privacy‑first, ad‑free, single‑page BMI calculator for the domain QuickBMICalc.com. The output must be a set of static files (HTML, CSS, JS) deployable to Vercel.

Use the following stages. After each stage, stop and show me the current state so I can test it.

---

**STAGE 0 – ARCHITECTURE & DESIGN SYSTEM**  
Create a file `design.md` containing the complete design tokens and guidelines for the app.  
- **Color palette:** primary `#0D6EFD`, background `#F8F9FA`, card `#FFFFFF`, text `#212529`, accent `#198754` (healthy), `#FFC107` (warning), `#DC3545` (danger).  
- **Typography:** system font stack, headings `'Inter', sans-serif`, body `'Inter', sans-serif`.  
- **Spacing:** 8px base grid.  
- **Border radius:** 12px for cards and buttons.  
- **Layout:** centered card with max‑width 480px, full viewport height, vertical centering.  
- **Input fields:** large, accessible labels, clear placeholder text, focus ring `#0D6EFD`.  
- **Buttons:** solid primary color, white text, hover darken 10%, active scale 0.98.  
- **Result area:** animated entrance, color‑coded BMI category badge.  
- **Responsive:** mobile‑first, no horizontal scroll.

Also specify the file structure:
project-root/
index.html
styles.css
script.js
design.md

text

---

**STAGE 1 – HTML STRUCTURE (index.html)**  
Create `index.html` with the following semantic structure:
- `<!DOCTYPE html>`, `<html lang="en">`, `<head>` with charset, viewport meta, title "BMI Calculator – QuickBMICalc.com", preconnect to Google Fonts for Inter, link to `styles.css`, and link to favicon (use a simple emoji favicon `data:image/svg+xml,...` with a scale icon). No external tracking.
- `<body>` containing a `<main>` wrapper with a `<div class="card">`. Inside the card:
  - `<h1>` "BMI Calculator"
  - `<p>` short description "Enter your weight and height to calculate your Body Mass Index (BMI)."
  - `<form id="bmi-form">` with fieldsets:
    - Unit toggle: two radio buttons or a switch for "Metric (kg/cm)" and "Imperial (lb/in)".
    - Weight input: `id="weight"`, type number, step any, required, placeholder "Weight".
    - Height input: `id="height"`, type number, step any, required, placeholder "Height".
    - For imperial, show height inputs: feet and inches (hide/show based on toggle). Name them `height-ft` and `height-in`.
    - A submit button "Calculate BMI".
  - `<div id="result" class="result hidden">` containing:
    - BMI value `<span id="bmi-value">`
    - BMI category `<span id="bmi-category">`
    - A meter/visual indicator (a simple colored bar).
  - Footer `<p class="disclaimer">` with health disclaimer: "BMI is a screening measure and not a diagnostic tool. Consult a healthcare provider."
- Add `defer` attribute to `script.js` link at the end of body.

---

**STAGE 2 – CSS STYLING (styles.css)**  
Create `styles.css` following the design tokens from `design.md`. Include:
- CSS custom properties on `:root` for all colors, border-radius, spacing.
- Global reset (box‑sizing, margin, padding).
- Body: background `#F8F9FA`, font family Inter, display flex, justify‑content center, align‑items center, min‑height 100vh, padding 1rem.
- Card: background white, border‑radius 12px, padding 2rem, box‑shadow 0 4px 12px rgba(0,0,0,0.1), max‑width 480px, width 100%.
- Form elements: labels bold, inputs full‑width, padding 0.75rem, border 1px solid #ced4da, border‑radius 8px, transition border‑color 0.2s. Focus styles.
- Toggle switch: styled like a pill, with labels “Metric” and “Imperial”. Use CSS only, hidden radio buttons, highlight active.
- Imperial height sub‑fields: side‑by‑side, label above each.
- Submit button: width 100%, background `#0D6EFD`, color white, border none, padding 0.75rem, border‑radius 8px, font‑size 1rem, cursor pointer, transition background 0.2s, hover darken to `#0b5ed7`, active scale 0.98.
- Result section: hidden by default (`.hidden { display: none; }`), show when `show` class added. Background `#f0f6ff`, border‑radius 8px, padding 1rem, margin‑top 1.5rem, text‑align center, animate fadeIn.
- BMI value: font‑size 2.5rem, font‑weight bold.
- Category badge: inline‑block, padding 0.25rem 0.75rem, border‑radius 20px, font‑size 0.875rem, color white. `.underweight` bg `#FFC107`, `.normal` bg `#198754`, `.overweight` bg `#FD7E14`, `.obese` bg `#DC3545`.
- Visual meter: a horizontal bar, width 100%, height 8px, border‑radius 4px, background linear‑gradient with stops representing BMI ranges. Add a pointer dot positioned according to BMI value using JS later.
- Disclaimer: font‑size 0.75rem, color `#6c757d`, margin‑top 1rem.
- Responsive: on smaller screens, reduce padding to 1rem, keep full width.

Use `@keyframes fadeIn` for the result animation.

---

**STAGE 3 – JAVASCRIPT FUNCTIONALITY (script.js)**  
Create `script.js` with strict mode. Implement:
- DOM references to form, unit toggle inputs, weight, height, result div, bmi‑value span, category span, meter pointer.
- Event listener on form submit (prevent default). Validate inputs (positive numbers, not empty).
- Determine unit system based on toggle value.
- BMI calculation:
  - Metric: BMI = weight(kg) / (height(m)²)   (height input in cm → convert to m).
  - Imperial: weight(lb), height = (feet * 12 + inches) inches → BMI = (weight / (height_in²)) * 703.
- Round BMI to one decimal.
- Determine category:
  - Underweight: < 18.5
  - Normal: 18.5 – 24.9
  - Overweight: 25 – 29.9
  - Obese: ≥ 30
- Update result display:
  - Set `bmi-value` textContent to BMI.
  - Set `bmi-category` textContent to category name, and assign class `underweight` / `normal` / `overweight` / `obese`.
  - Position the meter pointer: calculate percentage (e.g., scale BMI 0–40 to 0–100%, clamp). Move a small circle absolutely over the gradient bar.
  - Remove `hidden` class and add `show` class (or just remove hidden) to result div.
- Unit toggle: when switched, show/hide imperial sub‑fields (height‑ft, height‑in) and update labels/placeholders for weight/height inputs accordingly. Also clear the result.
- Add input validation UI: if invalid, show a simple red error message next to the field (via a small span) or use HTML5 validation tooltips.
- Ensure no page reload, fully client‑side.

---

**STAGE 4 – SEO, META TAGS & PWA (in index.html and manifest)**  
Update `index.html` `<head>` with:
- Meta description: "Free online BMI calculator. Check your body mass index instantly with metric or imperial units. Privacy‑focused, no ads, no tracking."
- Meta keywords: "BMI calculator, body mass index, BMI check, healthy weight, BMI chart, QuickBMICalc"
- Open Graph tags: `og:title`, `og:description`, `og:type` website, `og:url` https://quickbmicalc.com, `og:image` (create a simple SVG of a scale and embed as data URI or use a placeholder).
- Twitter card summary.
- Canonical link: `https://quickbmicalc.com/`
- Schema.org structured data (JSON‑LD) for WebApplication type: name "BMI Calculator", description, applicationCategory "HealthApplication", operatingSystem "All".
- Add a `<link rel="manifest" href="/manifest.json">`
- Add theme‑color meta tag `#0D6EFD`.

Create `manifest.json` file with:
```json
{
  "name": "Quick BMI Calculator",
  "short_name": "BMI Calc",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8F9FA",
  "theme_color": "#0D6EFD",
  "description": "Free, private BMI calculator",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
(For now, generate simple PNG placeholder icons as inline data URIs in the manifest or instruct to add later. You can use an online generator; but in the code, just include a comment to replace.)

Add a service worker (optional, just a simple sw.js for offline caching, but not strictly required; mention it as a bonus).

Make sure all meta tags are present.

STAGE 5 – DEPLOY TO VERCEL
Provide instructions to deploy the static site to Vercel:

Initialize a git repository in the project folder, commit all files.

Install Vercel CLI: npm i -g vercel (if needed) or simply use the Vercel dashboard.

Run vercel and follow prompts. Set the project name to quickbmicalc. The output directory is ./ (root). No build command.

Add the custom domain QuickBMICalc.com in Vercel project settings and configure DNS accordingly (give a summary).

Ensure that the live site is served over HTTPS.

After deployment, verify all meta tags, PWA manifest, and structured data using Google’s Rich Results Test.

IMPORTANT NOTES FOR THE AI:

Keep all code in plain separate files (no bundling).

No external analytics, ads, or third‑party scripts.

Comment the code where necessary for clarity.

At each stage, provide the complete file contents. After I apply them, I will test the app and then proceed to the next stage.

text

---

You can now copy this entire block and paste it into Anti‑Gravity. Run stage by stage, checking the output. After each stage, you’ll have a working piece of the app, and by the end, a fully deployable BMI calculator for QuickBMICalc.com.
