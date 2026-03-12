export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const target = `${config.public.backendUrl}/api/report`
  return proxyRequest(event, target)
})
