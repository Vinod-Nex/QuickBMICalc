Here’s the full, ready‑to‑use prompt. Copy it into Anti‑Gravity and let Gemini generate the entire application, including architecture, design system, and Vercel deployment setup.

markdown
You are an expert full‑stack developer and UI/UX designer. I want you to build a complete, production‑ready web application for **WordCountTool.com** – a fast, client‑side word and character counter tool. Use the skills and guidelines below.

---

## 1. Project Overview

- **Domain:** `WordCountTool.com`
- **Name:** WordCountTool
- **Tagline:** “Instant Word & Character Counter – Free, No Login”
- **Goal:** A minimal, blazing‑fast tool where writers, students, and SEOs paste text and get live counts for characters, words, sentences, paragraphs, reading time, and top keywords. The entire logic runs in the browser (no backend). Revenue will eventually come from ads, so include a placeholder ad slot.

---

## 2. Core Features (All Client‑Side)

1. **Large text input area** – placeholder text “Paste or type your text here…”
2. **Live counting (no submit button)** – updates on every keystroke:
   - Character count (with spaces)
   - Character count (without spaces)
   - Word count
   - Sentence count
   - Paragraph count
3. **Reading time** – estimated reading time (based on average 225 words/minute).
4. **Top keywords** – show the 5 most frequent words (≥4 letters, case‑insensitive, ignore common stop words like “the”, “and”, “is”, etc.)
5. **Clear button** to reset all fields.
6. **Copy text button** to copy the entire input to clipboard.
7. **Ad placeholder** – a `<div>` with id “ad-container” where an ad network script can be injected later. Place it discreetly above the results or in a sidebar (desktop).

---

## 3. Skills & Tools to Use

1. **OSTRO Design System** – Use the **Ostro** component library for all UI elements (typography, cards, buttons, textarea, containers, grid). Follow Ostro’s theming and spacing tokens. Assume Ostro provides `TextArea`, `Button`, `Card`, `Container`, `Grid`, `Typography`, `Box`.
2. **Website Design Guidelines** – The UI must be:
   - Extremely clean and minimal
   - Fully responsive (mobile‑first)
   - High contrast, accessible (WCAG AA)
   - Modern, friendly, with subtle shadows and rounded corners
   - No distracting animations, only smooth transitions
   - Use a neutral color palette with one accent color (e.g., #2563EB blue)
3. **design.md** – You must create a `design.md` file in the root with the complete design tokens that Ostro will consume. Include:
   - Color palette (primary, secondary, background, text, border)
   - Typography (font family: Inter, sizes, weights)
   - Spacing scale (4px base)
   - Border radius, shadows
   - Breakpoints (mobile < 768px, tablet 768‑1024px, desktop >1024px)
4. **Deploy to Vercel** – The project must be a Next.js application (TypeScript, App Router allowed but Pages Router is fine). Include a `vercel.json` if needed, and clear instructions to deploy. Ensure the final output can be pushed to a GitHub repo and deployed with one click.

---

## 4. Architecture & Technical Requirements

- **Framework:** Next.js (React) with TypeScript
- **No server, no database** – completely static, exportable if desired.
- **State management:** React `useState` + `useMemo` for computed counts.
- **Utility module:** `lib/countUtils.ts` containing pure functions:
  - `countCharacters(text: string, withSpaces: boolean): number`
  - `countWords(text: string): number`
  - `countSentences(text: string): number`
  - `countParagraphs(text: string): number`
  - `estimateReadingTime(wordCount: number): string` → e.g., “2 min read”
  - `getTopKeywords(text: string, limit: number): { word: string, count: number }[]`
- **Debounce:** Very light debounce (e.g., 100ms) on the input to keep updates smooth but not janky.
- **SEO:** Use `next/head` for `<title>`, `<meta description>`, Open Graph tags, favicon.
- **Ads:** Add a `<div id="ad-container" style="min-height:90px; background:#f9fafb; border:1px dashed #d1d5db; display:flex; align-items:center; justify-content:center; color:#6b7280;">Ad Space</div>` that can be replaced with ad script. Place it between the header and the tool, or in a sidebar if screen width > 1024px.

---

## 5. File & Folder Structure
/
├── public/
│ └── favicon.ico
├── src/
│ ├── components/
│ │ ├── Header.tsx
│ │ ├── TextInput.tsx
│ │ ├── StatsCard.tsx
│ │ ├── TopKeywords.tsx
│ │ ├── AdPlaceholder.tsx
│ │ └── Footer.tsx
│ ├── lib/
│ │ └── countUtils.ts
│ ├── pages/ (or app/ if using App Router)
│ │ ├── _app.tsx
│ │ └── index.tsx
│ └── styles/
│ └── ostro-theme.ts (or global.css that imports Ostro styles)
├── design.md
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md

text

---

## 6. design.md Content Template

```markdown
# Design Tokens for WordCountTool

## Colors
- Primary: #2563EB (blue-600)
- Primary Hover: #1D4ED8
- Background: #FFFFFF
- Surface: #F8FAFC
- Text Primary: #0F172A
- Text Secondary: #475569
- Border: #E2E8F0

## Typography
- Font Family: 'Inter', sans-serif
- Heading: 1.5rem, weight 700
- Body: 1rem, weight 400, line-height 1.6
- Small: 0.875rem, weight 500

## Spacing (4px base)
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

## Border Radius
- sm: 6px, md: 8px, lg: 12px

## Shadows
- Card: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
- Elevated: 0 4px 6px -1px rgba(0,0,0,0.1)

## Breakpoints
- Mobile: max-width 767px
- Tablet: 768px - 1024px
- Desktop: min-width 1025px
Use these tokens inside Ostro’s ThemeProvider if available, or as CSS custom properties.

7. Component Details (Pseudocode for Ostro)
Header.tsx
Uses Ostro Container, Typography (heading), a subtitle. Minimal, no navigation.

TextInput.tsx
Ostro Card containing an Ostro TextArea component (or a styled <textarea> with Ostro styling).

Bind to text state, call handler on input.

Below the textarea, two small Ostro Button components: “Clear” (outlined) and “Copy” (solid).

StatsCard.tsx
A grid of 4-5 Ostro Card elements displaying:

Characters (with spaces)

Characters (without spaces)

Words

Sentences

Paragraphs

Each card has a label and a large number.

Below them, an Ostro Typography showing reading time (e.g., “⏱️ 2 min read”).

TopKeywords.tsx
Ostro Card with a heading “Top Keywords”.

A horizontal tag list using Ostro Badge or Chip components. Each shows “word (count)”.

If no text, display “Add text to see keywords”.

AdPlaceholder.tsx
Plain div with dashed border and text “Advertisement”. Ostro Box can wrap it with responsive visibility.

Footer.tsx
Small text: “© 2025 WordCountTool.com – Free online word counter. All processing happens in your browser.”

8. Main Page Logic (index.tsx)
tsx
import { useState, useMemo, useCallback } from 'react';
import { countCharacters, countWords, countSentences, countParagraphs, estimateReadingTime, getTopKeywords } from '../lib/countUtils';

export default function Home() {
  const [text, setText] = useState('');

  const stats = useMemo(() => ({
    charWithSpaces: countCharacters(text, true),
    charWithoutSpaces: countCharacters(text, false),
    words: countWords(text),
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    readingTime: estimateReadingTime(countWords(text)),
    topKeywords: getTopKeywords(text, 5),
  }), [text]);

  const handleClear = () => setText('');
  const handleCopy = () => { navigator.clipboard.writeText(text); };

  return (
    <OstroThemeProvider>
      <Head> ... SEO tags ... </Head>
      <Container>
        <Header />
        <AdPlaceholder />
        <TextInput value={text} onChange={setText} onClear={handleClear} onCopy={handleCopy} />
        <StatsCard stats={stats} />
        <TopKeywords keywords={stats.topKeywords} />
        <Footer />
      </Container>
    </OstroThemeProvider>
  );
}
9. Utility Functions (lib/countUtils.ts)
Implement precise counting logic:

Characters with spaces: text.length

Without spaces: text.replace(/\s/g, '').length

Words: split by \s+, filter non‑empty.

Sentences: split by [.!?]+ (handle multiple punctuation), filter empty.

Paragraphs: split by \n+, filter lines that are not just whitespace.

Reading time: Math.ceil(words / 225) and format as “X min read” or “less than 1 min read” if <1.

Top keywords: clean text (lowercase, remove punctuation, split to words, filter length ≥ 4, exclude stop words list [a comprehensive set of English stop words: the, and, that, have, for, not, with, you, this, but, his, from, they, say, her, she, will, one, all, would, there, their, what, out, about, who, get, which, when, make, can, like, time, just, him, know, take, people, into, year, your, good, some, could, them, see, other, than, then, now, look, only, come, its, over, think, also, back, after, use, two, how, our, work, first, well, way, even, new, want, because, any, these, give, day, most, us]), count frequency, sort descending, return top N.

10. Responsive Behavior
On mobile, everything is a single column, ad sits above the tool, cards stack vertically.

On tablet/desktop, stats cards are in a 3-4 column grid.

The ad can be moved to a right sidebar on desktop (optional, just keep it at top if easier).

11. SEO & Performance
Title: “Free Word Counter & Character Count Tool – WordCountTool.com”

Meta description: “Instant online word and character counter. No login required. Count words, characters, sentences, paragraphs, and reading time. Free, fast, private.”

Add structured data (WebApplication) for rich results.

Ensure the tool is keyboard accessible.

Use next/image if any image, but likely none.

12. Deployment to Vercel
The project must be a standard Next.js app.

Run npx create-next-app@latest wordcounttool --typescript (but you will generate code inside).

Create a README.md with setup instructions:

Clone the repo
npm install
npm run dev
Deploy on Vercel: import GitHub repo, Vercel auto-detects Next.js, no environment variables needed.
The generated code should be ready to push.

13. Final Output
Please output the entire project as a structured folder with all files, fully coded and ready to run. Do not omit any part. Use the OSTRO design system, the design.md tokens, and the website design guidelines exactly as described. The domain must be WordCountTool.com. Include vercel.json if required for redirects (optional). Generate the complete code now.

text

Just paste this entire prompt into Anti‑Gravity and let Gemini build the full application for you. It includes the architecture, design tokens, component skeletons, utility logic, SEO, ad placeholder, and deployment instructions – everything requested.
