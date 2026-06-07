// מייצא כל מצגת ל-PDF (שקופית לעמוד) ולתמונות PNG, באמצעות Playwright.
// הרצה:  node export-pdf.mjs
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'output');
mkdirSync(outDir, { recursive: true });
const W = 1280, H = 720;

// כל מצגת: קובץ המקור, שם ה-PDF, ותיקיית ה-PNG.
const DECKS = [
  { html: 'slides.html',       pdf: 'claude-setup-guide.pdf', png: 'slides-png' },
  { html: 'ai-builders.html',  pdf: 'ai-builders-guide.pdf',  png: 'ai-builders-png' },
  { html: 'understanding-systems.html', pdf: 'understanding-systems-guide.pdf', png: 'understanding-png' },
];

const browser = await chromium.launch();
try {
  for (const deck of DECKS) {
    const url = pathToFileURL(join(__dirname, deck.html)).href;

    // ---------- PDF (print mode: all slides stacked, one per page) ----------
    const pdfPage = await browser.newPage({ viewport: { width: W, height: H } });
    await pdfPage.goto(url + '?print', { waitUntil: 'networkidle' });
    await pdfPage.evaluate(() => document.fonts.ready);
    await pdfPage.emulateMedia({ media: 'print' });
    await pdfPage.pdf({ path: join(outDir, deck.pdf), width: `${W}px`, height: `${H}px`, printBackground: true });
    console.log('✓ PDF saved:', deck.pdf);
    await pdfPage.close();

    // ---------- PNG per slide ----------
    const shotPage = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
    await shotPage.goto(url, { waitUntil: 'networkidle' });
    await shotPage.evaluate(() => document.fonts.ready);
    await shotPage.addStyleTag({ content: '.nav,.hint{display:none!important;} .deck{transform:none!important;}' });
    const count = await shotPage.evaluate(() => document.querySelectorAll('.slide').length);
    const pngDir = join(outDir, deck.png);
    mkdirSync(pngDir, { recursive: true });
    for (let i = 0; i < count; i++) {
      await shotPage.evaluate((n) => {
        document.querySelectorAll('.slide').forEach((el, j) => el.classList.toggle('active', j === n));
      }, i);
      await shotPage.waitForTimeout(450); // wait past the .35s opacity transition
      await shotPage.screenshot({ path: join(pngDir, `slide-${String(i + 1).padStart(2, '0')}.png`) });
    }
    console.log(`✓ ${count} PNGs saved to:`, deck.png);
    await shotPage.close();
  }
} finally {
  await browser.close();
}
