// Minimal fs polyfill for browser — returns package.json stub so
// @react-spectrum/s2/style-macro can compute its version postfix without crashing.

function readFileSync(filePath, encoding) {
  if (filePath && filePath.indexOf('package.json') !== -1) {
    return '{"version":"1.0.0"}';
  }
  return '';
}

module.exports = { readFileSync: readFileSync };
