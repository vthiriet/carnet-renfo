// Cherche et télécharge un GIF d'exécution pour chaque exercice listé dans
// exercise-gif-map.json, via l'API ExerciseDB (RapidAPI).
//
// Usage :
//   RAPIDAPI_KEY=xxxxx node scripts/fetch-exercise-gifs.mjs        (macOS/Linux)
//   $env:RAPIDAPI_KEY="xxxxx"; node scripts/fetch-exercise-gifs.mjs (PowerShell)
//
// Résultat :
//   - public/gifs/<slug>.gif pour chaque exercice trouvé
//   - scripts/gif-results.json (détail des correspondances trouvées/manquées)
//   - scripts/gif-review.html (page à ouvrir dans un navigateur pour vérifier visuellement)

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GIFS_DIR = path.join(ROOT, 'public', 'gifs');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
if (!RAPIDAPI_KEY) {
  console.error('Erreur : la variable RAPIDAPI_KEY n\'est pas définie. Voir les instructions en haut de ce fichier.');
  process.exit(1);
}

const API_HOST = 'exercisedb.p.rapidapi.com';

async function searchExercise(term) {
  const url = `https://${API_HOST}/exercises/name/${encodeURIComponent(term)}`;
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': API_HOST,
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} pour "${term}"`);
  }
  return res.json();
}

async function downloadGif(exerciseId, destPath) {
  const url = `https://${API_HOST}/image?exerciseId=${exerciseId}&resolution=180`;
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': API_HOST,
    },
  });
  if (!res.ok) throw new Error(`Téléchargement échoué (HTTP ${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buffer);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  await mkdir(GIFS_DIR, { recursive: true });
  const mapPath = path.join(__dirname, 'exercise-gif-map.json');
  const list = JSON.parse(await readFile(mapPath, 'utf-8'));

  const results = [];

  for (const entry of list) {
    const { slug, name, searchTerms } = entry;
    let matched = null;
    let usedTerm = null;
    let candidateCount = 0;

    for (const term of searchTerms) {
      try {
        const found = await searchExercise(term);
        if (Array.isArray(found) && found.length > 0) {
          matched = found[0];
          usedTerm = term;
          candidateCount = found.length;
          break;
        }
      } catch (err) {
        console.warn(`  ⚠ "${term}" -> ${err.message}`);
      }
      await sleep(300);
    }

    if (!matched) {
      console.log(`✗ ${name} : aucun résultat pour ${JSON.stringify(searchTerms)}`);
      results.push({ slug, name, status: 'not_found', searchTerms });
      await sleep(300);
      continue;
    }

    const destPath = path.join(GIFS_DIR, `${slug}.gif`);
    try {
      await downloadGif(matched.id, destPath);
      console.log(`✓ ${name} -> ${slug}.gif (via "${usedTerm}", ${candidateCount} résultat(s), matché "${matched.name}")`);
      results.push({
        slug,
        name,
        status: 'ok',
        usedTerm,
        candidateCount,
        matchedApiName: matched.name,
        bodyPart: matched.bodyPart,
        equipment: matched.equipment,
      });
    } catch (err) {
      console.log(`✗ ${name} : échec du téléchargement (${err.message})`);
      results.push({ slug, name, status: 'download_failed', usedTerm, error: err.message });
    }

    await sleep(300);
  }

  await writeFile(path.join(__dirname, 'gif-results.json'), JSON.stringify(results, null, 2));

  const html = buildReviewHtml(results);
  await writeFile(path.join(__dirname, 'gif-review.html'), html);

  const ok = results.filter((r) => r.status === 'ok').length;
  console.log(`\n${ok}/${list.length} GIFs téléchargés dans public/gifs/`);
  console.log('Ouvre scripts/gif-review.html dans ton navigateur pour vérifier visuellement chaque correspondance.');
}

function buildReviewHtml(results) {
  const rows = results.map((r) => {
    if (r.status !== 'ok') {
      return `<div class="row missing">
        <div class="name">${r.name}</div>
        <div class="status">✗ ${r.status === 'not_found' ? 'aucun résultat trouvé' : 'échec du téléchargement'}</div>
      </div>`;
    }
    return `<div class="row">
      <div class="name">${r.name}<br><small>${r.matchedApiName} — ${r.bodyPart}/${r.equipment}</small></div>
      <img src="../public/gifs/${r.slug}.gif" alt="${r.name}">
    </div>`;
  }).join('\n');

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Revue des GIFs d'exercices</title>
<style>
  body{ font-family: sans-serif; background:#17140f; color:#f1ece1; padding:20px; }
  .row{ display:flex; align-items:center; gap:16px; border-bottom:1px solid #3a3226; padding:14px 0; }
  .row.missing{ color:#c15b3c; }
  .name{ flex:1; }
  .name small{ color:#948a76; }
  img{ width:160px; height:auto; border-radius:8px; background:#000; }
</style>
</head>
<body>
<h1>Revue des GIFs (${results.filter(r => r.status === 'ok').length}/${results.length} trouvés)</h1>
${rows}
</body>
</html>`;
}

main();
