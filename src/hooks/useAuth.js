import { useEffect, useState } from 'react'
import * as Auth from '../api/auth.js'


export function useAuth(){
const [user,setUser] = useState(()=>{
const raw = localStorage.getItem('auth')
return raw ? JSON.parse(raw) : null
})
const [loading,setLoading] = useState(false)
const [error,setError] = useState('')


async function login(email,password){
setLoading(true); setError('')
try{
const data = await Auth.login(email,password)
setUser(data)
localStorage.setItem('auth', JSON.stringify(data))
return data
}catch(e){ setError(e.message || 'Login failed'); throw e }
finally{ setLoading(false) }
}
async function signup(payload){
setLoading(true); setError('')
try{
const data = await Auth.signup(payload)
setUser(data)
localStorage.setItem('auth', JSON.stringify(data))
return data
}catch(e){ setError(e.message || 'Signup failed'); throw e }
finally{ setLoading(false) }
}
function logout(){ setUser(null); localStorage.removeItem('auth') }


return { user, loading, error, login, signup, logout, setUser }
}