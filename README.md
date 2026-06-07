# מצגות סדנת פיתוח עם AI — יהודית ברדוגו

שלוש מצגות אינטראקטיביות (HTML, RTL) + ייצוא PDF, עם דף שער מאחד.

## פתיחה
פתחו את **`index.html`** — דף השער שמקשר לשלוש המצגות:

| מצגת | קובץ | נושא |
|------|------|------|
| 1 | `slides.html` | מדריך התקנת הכלים (VS Code, Git, Node.js, GitHub, Claude Code, Vercel) |
| 2 | `ai-builders.html` | בנייה עם AI בדפדפן — Base44 · Lovable · Zite |
| 3 | `understanding-systems.html` | להבין מערכות: Frontend / Backend / Database |

קובצי PDF מיוצאים נמצאים תחת `output/`.

## בנייה מחדש של ה-PDF
```
npm install
node export-pdf.mjs
```
הייצוא מבוסס על [Playwright](https://github.com/microsoft/playwright).
