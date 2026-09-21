import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';
import enDict from './src/i18n/translations/en.js';

const languages = [
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ur', name: 'Urdu' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'or', name: 'Odia' }, // or -> Odia
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'mai', name: 'Maithili' },
  { code: 'sat', name: 'Santali' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'ne', name: 'Nepali' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'kok', name: 'Konkani' },
  { code: 'doi', name: 'Dogri' },
  { code: 'mni', name: 'Manipuri' },
  { code: 'brx', name: 'Bodo' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const keys = Object.keys(enDict);
  console.log(`Starting translation of ${keys.length} keys into ${languages.length} languages...`);

  // To avoid massive rate limits, we will combine texts or just translate values.
  // Actually, translating 150 short strings 20 times using the free API will likely fail.
  // We can try translating all values joined by a separator, then splitting.
  const separator = ' | ';
  const values = keys.map(k => enDict[k]);
  
  // We can join up to ~2000 chars per request.
  const chunks = [];
  let currentChunk = [];
  let currentLen = 0;
  for (const v of values) {
    if (currentLen + v.length + separator.length > 2000) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentLen = 0;
    }
    currentChunk.push(v);
    currentLen += v.length + separator.length;
  }
  if (currentChunk.length > 0) chunks.push(currentChunk);

  console.log(`Split into ${chunks.length} chunks.`);

  let indexFileContent = `import en from './translations/en';\nimport hi from './translations/hi';\n`;
  let exportObject = `  en,\n  hi,\n`;

  for (const lang of languages) {
    console.log(`Translating to ${lang.name} (${lang.code})...`);
    let translatedValues = [];
    let success = true;
    for (const chunk of chunks) {
      const textToTranslate = chunk.join(separator);
      try {
        const res = await translate(textToTranslate, { to: lang.code });
        // Split by the translated separator. The API sometimes messes up the separator spaces.
        const parts = res.text.split(/\|/g).map(s => s.trim());
        if (parts.length === chunk.length) {
          translatedValues.push(...parts);
        } else {
          // If separator failed, fallback to pseudo-translation or english for this chunk
          console.warn(`Separator parsing failed for ${lang.code}. Reverting to pseudo-translation.`);
          translatedValues.push(...chunk.map(v => `[${lang.code}] ${v}`));
        }
        await sleep(1500); // Sleep to prevent rate limit
      } catch (err) {
        console.error(`Error translating chunk to ${lang.code}: ${err.message}`);
        success = false;
        break;
      }
    }

    let fileOutput = `export default {\n`;
    if (success && translatedValues.length === keys.length) {
      for (let i = 0; i < keys.length; i++) {
        // Escape quotes
        const val = translatedValues[i].replace(/'/g, "\\'");
        fileOutput += `  '${keys[i]}': '${val}',\n`;
      }
    } else {
      // Fallback: pseudo-translation
      console.warn(`Using fallback pseudo-translation for ${lang.code}`);
      for (let i = 0; i < keys.length; i++) {
        const val = enDict[keys[i]].replace(/'/g, "\\'");
        fileOutput += `  '${keys[i]}': '[${lang.code}] ${val}',\n`;
      }
    }
    fileOutput += `};\n`;

    fs.writeFileSync(path.join(process.cwd(), 'src/i18n/translations', `${lang.code}.js`), fileOutput);
    console.log(`Saved ${lang.code}.js`);

    indexFileContent += `import ${lang.code} from './translations/${lang.code}';\n`;
    exportObject += `  ${lang.code},\n`;
  }

  indexFileContent += `\nexport default {\n${exportObject}};\n`;
  fs.writeFileSync(path.join(process.cwd(), 'src/i18n/index.js'), indexFileContent);
  console.log('Updated index.js. Done!');
}

main();
