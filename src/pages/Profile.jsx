import React, { useEffect, useState } from 'react'
import * as Users from '../api/customers.js'


export default function Profile(){
const auth = JSON.parse(localStorage.getItem('auth')||'null')
const [me,setMe] = useState(null)
const [f,setF] = useState('')
const [l,setL] = useState('')
const [e,setE] = useState('')


useEffect(()=>{
(async()=>{
const data = await Users.getCustomer(auth.customer.customer_id)
setMe(data); setF(data.first_name); setL(data.last_name); setE(data.email)
})()
},[])


async function onSave(){
const data = await Users.updateCustomer(auth.customer.customer_id, { first_name: f, last_name: l, email: e })
setMe(data)
}


async function onDelete(){
if(!confirm('Delete your account (this removes all itineraries)?')) return
await Users.deleteCustomer(auth.customer.customer_id)
localStorage.removeItem('auth'); location.href = '/'
}


if(!me) return <p>Loading…</p>
return (
<div className="max-w-lg card">
<h2 className="text-2xl font-semibold mb-3">Your profile</h2>
<label className="label">First name</label>
<input className="input mb-2" value={f} onChange={e=>setF(e.target.value)} />
<label className="label">Last name</label>
<input className="input mb-2" value={l} onChange={e=>setL(e.target.value)} />
<label className="label">Email</label>
<input className="input mb-3" value={e} onChange={e=>setE(e.target.value)} />
<div className="flex gap-2">
<button className="btn-primary" onClick={onSave}>Save</button>
<button className="btn-ghost" onClick={onDelete}>Delete Account</button>
</div>
</div>
)
}