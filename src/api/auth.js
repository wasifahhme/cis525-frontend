import client from './client.js'


async function tryPost(paths, payload){
const tried = []
for (const path of paths){
tried.push(path)
try{
const { data } = await client.post(path, payload)
return data
}catch(err){
if (err?.status === 404) continue // try next alias
throw err
}
}
throw Object.assign(new Error(`No matching endpoint on backend. Tried: ${tried.join(', ')}`), { code: 'NO_ROUTE' })
}


export async function login(email,password){
// Try common auth route aliases if your backend differs from the doc
return await tryPost([
'/api/auth/login',
'/auth/login',
'/login'
], { email, password })
}


export async function signup(payload){
// Try common signup route aliases
return await tryPost([
'/api/customers',
'/customers',
'/auth/register',
'/register'
], payload)
}