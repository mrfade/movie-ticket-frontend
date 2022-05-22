import { defineNuxtModule, addTemplate } from '@nuxt/kit'
import type { ImportPresetWithDeprecation } from '@nuxt/schema'

export default defineNuxtModule({
  setup (_, nuxt) {
    nuxt.hook('autoImports:sources', (sources) => {
      generateEslintGlobalsConfig(sources)
    })
  }
})

function generateEslintGlobalsConfig (autoImports: ImportPresetWithDeprecation[]) {
  addTemplate({
    filename: '.eslintrc.js',
    write: true,
    getContents: () => {
      return `// Auto generate by nuxt modules
module.exports = {
  globals: {
${autoImports.map(i => i.imports).flat().map(i => `    ${i}: 'readonly',`).join('\n')}
  },
};
`
    }
  })
}
