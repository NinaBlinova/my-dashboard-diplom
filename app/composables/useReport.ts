import type { ReportPayload } from '~/types'

export const useReport = () => {
  const generateReport = async (payload: ReportPayload) => {
    const blob = await $fetch<Blob>('/api/report', {
      method: 'POST',
      body: payload,
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'report.docx'
    a.click()
    window.URL.revokeObjectURL(url)
  }
  return { generateReport }
}
