import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as API from '../api/itineraries.js'
import ItineraryCard from '../components/ItineraryCard.jsx'
import Loader from '../components/Loader.jsx'


export default function ItineraryList(){
const auth = JSON.parse(localStorage.getItem('auth')||'null')
const cid = auth?.customer?.customer_id
const [items,setItems] = useState(null)


useEffect(()=>{ (async()=>{ if(!cid) return; setItems(null); setItems(await API.listItineraries(cid)) })() },[cid])


if(items===null) return <Loader/>
return (
<div>
<div className="flex items-center justify-between mb-3">
<h2 className="text-2xl font-semibold">Your Itineraries</h2>
<Link className="btn-primary" to="/itineraries/new">New</Link>
</div>
<div className="grid-auto">
{items?.length? items.map(it => <ItineraryCard key={it.itinerary_id} it={it} />) : <p className="opacity-70">No itineraries yet.</p>}
</div>
</div>
)
}