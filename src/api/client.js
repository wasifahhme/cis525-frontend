import axios from 'axios'


const BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'


const client = axios.create({
baseURL: BASE,
timeout: 10000,
headers: { 'Content-Type': 'application/json' }
})


client.interceptors.request.use((config)=>{
const auth = localStorage.getItem('auth')
if(auth){
const { token } = JSON.parse(auth)
if(token) config.headers.Authorization = `Bearer ${token}`
}
if (import.meta.env.DEV) {
console.debug('[API] →', config.method?.toUpperCase(), config.baseURL + config.url)
}
return config
})


client.interceptors.response.use(
res => res,
err => {
const status = err?.response?.status
const isNetwork = !!(err?.code === 'ERR_NETWORK' || err?.message?.toLowerCase().includes('network'))
const msg = isNetwork
? 'Network error: frontend could not reach the backend. Check VITE_API_BASE_URL and CORS.'
: (err?.response?.data?.detail || err.message || 'Request failed')


const enriched = Object.assign(new Error(msg), { status, original: err, url: err?.config?.baseURL + err?.config?.url })
if (import.meta.env.DEV) console.error('[API ERROR]', enriched)
return Promise.reject(enriched)
}
)


export default client