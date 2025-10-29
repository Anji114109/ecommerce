// next.config.js
const path = require('path');

module.exports = {
  // Tell Next.js: "My project root is THIS folder"
  outputFileTracingRoot: path.join(__dirname),
  // Optional: Also set Turbopack root (for dev server)
  turbopack: {
    root: path.join(__dirname),
  },
};