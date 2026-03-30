// Minimal path polyfill for browser — only what @react-spectrum/s2/style-macro needs.

function dirname(p) {
  if (!p) return '.';
  const normalized = p.replace(/\\/g, '/');
  const idx = normalized.lastIndexOf('/');
  return idx === -1 ? '.' : normalized.slice(0, idx) || '/';
}

function resolve() {
  let resolved = '';
  for (let i = arguments.length - 1; i >= 0; i--) {
    const seg = String(arguments[i]).replace(/\\/g, '/');
    if (!seg) continue;
    resolved = seg.replace(/\/+$/, '') + (resolved ? '/' + resolved : '');
    if (seg[0] === '/') break;
  }
  return resolved || '/';
}

function join() {
  return Array.prototype.slice.call(arguments).join('/').replace(/\/+/g, '/');
}

module.exports = { dirname: dirname, resolve: resolve, join: join, sep: '/', delimiter: ':' };
