module.exports = {
  presets: [
    ['@babel/preset-env', { targets: "defaults" }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    // This allows Babel to parse: import {style} from '...' with {type: 'macro'}
    '@babel/plugin-syntax-import-attributes'
  ]
};