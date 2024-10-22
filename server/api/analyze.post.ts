
import { createChecker } from 'vue-component-meta'
import { defineEventHandler, readBody } from 'h3'
import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'

const checker = createChecker(
  // Write your tsconfig path
  path.join(process.cwd(), 'tsconfig.json'),
  {
    forceUseTs: true,
    printer: { newLine: 1 },
  },
)

const file = 'toto.vue'

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event)

  fs.writeFileSync(file, code, 'utf-8')
  checker.clearCache()
  checker.updateFile(file, code)
  const analysis = checker.getComponentMeta(file)
  
  return {
    analysis
  }
})