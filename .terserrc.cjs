const terserConfig = require("terser-config-atomic")

// optimize the code, but keep it readable
module.exports = {
  ...terserConfig,
  format: {
    ...terserConfig.format,
    comments: true,
  },
  mangle: false,
}
