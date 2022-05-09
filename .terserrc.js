const terserConfig = require("terser-config-atomic")

// optimize the code, but keep it readable
module.exports = {
  ...terserConfig,
  compress: {
    ...terserConfig.compress,
    sequences: false,
    join_vars: false,
  },
  format: {
    ...terserConfig.format,
    comments: true,
    beautify: true,
  },
  mangle: false,
}
