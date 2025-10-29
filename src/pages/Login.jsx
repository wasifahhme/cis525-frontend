import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import FormField from '../components/FormField.jsx'
import Toast from '../components/Toast.jsx'


export default function Login(){
const nav = useNavigate()
const { login } = useAuth()
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [toast,setToast] = useState('')


async function onSubmit(e){
e.preventDefault()
try{ await login(email,password); nav('/dashboard') }
catch(err){ setToast(err.message) }
}


return (
<div className="max-w-md mx-auto card">
<h2 className="text-2xl font-semibold mb-4">Log in</h2>
<form onSubmit={onSubmit}>
<FormField label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
<FormField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
<button className="btn-primary w-full mt-2">Continue</button>
</form>
<p className="text-sm mt-3">No account? <Link className="underline" to="/signup">Sign up</Link></p>
{toast && <Toast>{toast}</Toast>}
</div>
)
}