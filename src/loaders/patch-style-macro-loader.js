// Webpack loader that patches @react-spectrum/s2/style-macro.mjs before bundling.
// The file uses Node.js-only APIs (fileURLToPath, path.dirname, fs.readFileSync)
// purely to read package.json and compute a CSS class-name version postfix.
// We replace those lines with a hardcoded postfix derived from the installed version.

const fs = require('fs');
const path = require('path');

function fixPropertiesVariables(source) {
  // The Parcel bundle may have been partially patched, leaving inconsistent variable names
  // for the properties.mjs import (e.g. $5VBDY$propertiesmjs vs $5VBDY$propertiesmjs1 vs $5VBDY$propertiesmjs2).
  // Detect the canonical name from the import declaration and unify all variants.
  const importMatch = source.match(/import (\$\S+propertiesmjs\d*) from ["']\.\/properties\.mjs["']/);
  if (!importMatch) return source;
  const canonical = importMatch[1];
  const base = canonical.replace(/\d+$/, '');
  const escapedBase = base.replace(/\$/g, '\\$');
  return source.replace(new RegExp(`${escapedBase}\\d*`, 'g'), canonical);
}

module.exports = function patchStyleMacroLoader(source) {
  const pkgPath = path.resolve(__dirname, '../../../node_modules/@react-spectrum/s2/package.json');
  let version = '1.0.0';
  try { version = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version; } catch (e) {}

  const isNightly = version.includes('nightly');
  const postfix = isNightly
    ? version.match(/-nightly-(.*)/)[1]
    : version.replace(/[0.]/g, '');

  // Replace the three Node.js lines with a single hardcoded constant.
  // The variable names are Parcel-mangled but stable across patch versions.
  return fixPropertiesVariables(source)
    .replace(
      /var \$e3c5b37c91268204\$var\$\$parcel\$__dirname\s*=\s*[^\n]+\n/,
      ''
    )
    .replace(
      /const \$e3c5b37c91268204\$var\$json\s*=\s*[^\n]+\n/,
      ''
    )
    .replace(
      /const \$e3c5b37c91268204\$var\$POSTFIX\s*=\s*[^\n]+/,
      `const $e3c5b37c91268204$var$POSTFIX = ${JSON.stringify(postfix)};`
    )
    // Disable the runtime guard that throws when style() is called outside Parcel macro context.
    // The style function works correctly at runtime — the guard is only a developer warning.
    .replace(
      /\(this == null \|\| this === globalThis\) && process\.env\.NODE_ENV !== 'test'/g,
      'false'
    );
};
