export const cleanupForTesting = () => {
  if (typeof window !== 'undefined') {
    const isTestEnv =
      window.location.search.includes('test=true') || import.meta.env.MODE === 'test'
    if (isTestEnv) {
      localStorage.removeItem('token')
      console.log('Test environment detected: token cleared')
    }
  }
}
