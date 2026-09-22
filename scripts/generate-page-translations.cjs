const fs = require('fs');
const ts = require('typescript');

const files = [
  'src/pages/ProgramDetails.tsx',
  'src/pages/HigherSchools.tsx',
  'src/pages/CoachingOffer.tsx',
  'src/pages/BacSimulator.tsx',
  'src/pages/Login.tsx',
];

const allowedAttributes = new Set(['placeholder', 'aria-label', 'title', 'alt']);
const strings = new Set();

const looksVisible = (value) => {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length < 2 || !/[A-Za-zÀ-ÿ]/.test(text)) return false;
  if (/^(https?:|\/|\.\/|\.\.\/|[a-z]+:)/i.test(text)) return false;
  if (/^[\w-]+(?:\s+[\w:[\]/().%#-]+){2,}$/.test(text) && /(?:text-|bg-|flex|grid|p-|m-|w-|h-|rounded|border)/.test(text)) return false;
  if (/^[a-z][a-zA-Z]+$/.test(text) && !['Public', 'Privé', 'Service', 'Premium', 'Boost', 'Essentiel', 'Admin'].includes(text)) return false;
  return true;
};

for (const file of files) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (node) => {
    let value = null;
    if (ts.isJsxText(node)) value = node.getText(source);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)) return;
      if (ts.isJsxAttribute(node.parent)) {
        const name = node.parent.name.getText(source);
        if (!allowedAttributes.has(name)) return;
      }
      value = node.text;
    }
    if (value && looksVisible(value)) strings.add(value.replace(/\s+/g, ' ').trim());
    ts.forEachChild(node, visit);
  };
  visit(source);
}

const translate = async (text) => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation failed (${response.status}) for: ${text}`);
  const data = await response.json();
  return data[0].map((part) => part[0]).join('');
};

(async () => {
  const entries = [...strings].sort((a, b) => a.localeCompare(b, 'fr'));
  const output = {};
  for (let i = 0; i < entries.length; i += 6) {
    const batch = entries.slice(i, i + 6);
    const translated = await Promise.all(batch.map(translate));
    batch.forEach((key, index) => { output[key] = translated[index]; });
    process.stdout.write(`\rTranslated ${Math.min(i + 6, entries.length)}/${entries.length}`);
  }
  fs.writeFileSync('src/locales/generated-pages-ar.json', `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  process.stdout.write('\n');
})();
