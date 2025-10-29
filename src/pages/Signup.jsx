import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import FormField from '../components/FormField.jsx'
import * as Auth from '../api/auth.js'
import Toast from '../components/Toast.jsx'


export default function Signup(){
const nav = useNavigate()
const { login } = useAuth()
const [f,setF] = useState('')
const [l,setL] = useState('')
const [e,setE] = useState('')
const [p,setP] = useState('')
const [toast,setToast] = useState('')


async function onSubmit(ev){
ev.preventDefault()
try{
await Auth.signup({ first_name: f, last_name: l, email: e, password: p })
await login(e,p)
nav('/dashboard')
}catch(err){ setToast(err.message) }
}


return (
<div className="max-w-md mx-auto card">
<h2 className="text-2xl font-semibold mb-4">Create your account</h2>
<form onSubmit={onSubmit}>
<FormField label="First name" value={f} onChange={e=>setF(e.target.value)} required />
<FormField label="Last name" value={l} onChange={e=>setL(e.target.value)} required />
<FormField label="Email" type="email" value={e} onChange={e=>setE(e.target.value)} required />
<FormField label="Password" type="password" value={p} onChange={e=>setP(e.target.value)} required />
<button className="btn-primary w-full mt-2">Create account</button>
</form>
<p className="text-sm mt-3">Already have an account? <Link className="underline" to="/login">Log in</Link></p>
{toast && <Toast>{toast}</Toast>}
</div>
)
}