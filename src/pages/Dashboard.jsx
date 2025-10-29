import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as API from '../api/itineraries.js'


export default function Dashboard(){
const auth = JSON.parse(localStorage.getItem('auth')||'null')
const cid = auth?.customer?.customer_id
const [total,setTotal] = useState(0)


useEffect(()=>{
(async()=>{
if(!cid) return
try{ const list = await API.listItineraries(cid); setTotal(list?.length||0) }catch{}
})()
},[cid])


return (
<div className="grid gap-4 md:grid-cols-2">
<div className="card">
<h2 className="text-xl font-semibold">Welcome back{auth?.customer?.first_name ? `, ${auth.customer.first_name}`:''}!</h2>
<p className="opacity-80 mt-1">Manage your road‑trip itineraries and account.</p>
<div className="mt-4 flex gap-2">
<Link className="btn-primary" to="/itineraries/new">New Itinerary</Link>
<Link className="btn-ghost" to="/itineraries">View All</Link>
</div>
</div>
<div className="card">
<h3 className="font-semibold">Quick stats</h3>
<p className="opacity-80 mt-2">Total itineraries: <span className="font-semibold">{total}</span></p>
</div>
</div>
)
}