<script setup>
import { codeToHtml } from 'shiki'

const code = useLocalStorage('code', '')

const debouncedCode = useDebounce(code, 1000)

const { data, error, status } = useFetch('/api/analyze', {
  method: 'POST',
  body: computed(() => ({
    code: debouncedCode.value
  })),
})

const rendered = computedAsync(async () => {
  console.log(data.value?.analysis)
  if (!data.value?.analysis) return ''
  return codeToHtml(JSON.stringify(data.value.analysis, null, 2), {
    lang: 'json',
    theme: 'vitesse-dark'
  })
})
</script>

<template>
  <div class="h-screen flex p-1 items-stretch">
    <div class="flex-1 flex flex-col p-1 min-w-0">
      <h2>Vue SFC Code</h2>
      <textarea
        v-model="code"
        placeholder="Paste your Vue SFC code here..."
        class="flex-1 p-1 border border-green-500/20 rounded resize-none font-mono text-sm outline-none focus:border-green-500"
        @input="analyzeCode"
      ></textarea>
    </div>
    <div class="flex-1 flex flex-col p-1 min-w-0">
      <h2>Analysis Results</h2>
      <div class="relative flex-1 flex flex-col min-h-0">
        <UProgress v-if="status === 'pending'" animation="carousel" size="sm" class="absolute top-0 left-0 w-full" />
        <pre v-if="rendered" class="p-1 border border-green-500/20 rounded flex-1 min-h-0 overflow-y-auto text-sm whitespace-pre-wrap" v-html="rendered"></pre>
        <UAlert
          v-else-if="error"
          color="red"
          title="Error"
          :description="error"
        />
        <div v-else class="opacity-50">Enter some code to see the analysis</div>
      </div>
    </div>
  </div>
</template>
