// Standalone url polyfill — does NOT require('url') to avoid circular resolution.
// Provides fileURLToPath for @react-spectrum/s2/style-macro compatibility.

function fileURLToPath(fileUrl) {
  if (!fileUrl) return '';
  const str = typeof fileUrl === 'string' ? fileUrl : fileUrl.toString();
  return decodeURIComponent(str.replace(/^file:\/\/\/?/, '/'));
}

function parse(urlStr) {
  try { var u = new URL(urlStr); return { href: u.href, protocol: u.protocol, host: u.host, pathname: u.pathname, search: u.search, hash: u.hash }; }
  catch (e) { return { href: urlStr }; }
}

function format(urlObj) {
  if (typeof urlObj === 'string') return urlObj;
  try { return urlObj.href || ''; } catch (e) { return ''; }
}

function resolve(from, to) {
  try { return new URL(to, from).href; } catch (e) { return to; }
}

module.exports = {
  fileURLToPath: fileURLToPath,
  Url: function Url() {},
  parse: parse,
  format: format,
  resolve: resolve,
  resolveObject: function() { return {}; },
  URL: (typeof globalThis !== 'undefined' && globalThis.URL) || function() {},
  URLSearchParams: (typeof globalThis !== 'undefined' && globalThis.URLSearchParams) || function() {},
};
