import React, { useEffect, useMemo, useState } from 'react'
import * as API from '../api/itineraries.js'
import DayTimeline from '../components/DayTimeline.jsx'
import Loader from '../components/Loader.jsx'


export default function ItineraryDetail(){
const { id } = useParams()
const nav = useNavigate()
const [it,setIt] = useState(null)
const [loading,setLoading] = useState(true)


useEffect(()=>{
(async()=>{
try{ const data = await API.getItinerary(id); setIt(data) }
catch(err){ console.error(err) }
finally{ setLoading(false) }
})()
},[id])


const days = useMemo(()=>{
try{
const data = typeof it?.itinerary_data === 'string' ? JSON.parse(it.itinerary_data) : it?.itinerary_data
return Array.isArray(data?.itinerary) ? data.itinerary : []
}catch{ return [] }
},[it])


async function handleDelete(){
if(!confirm('Delete this itinerary?')) return
await API.deleteItinerary(id)
nav('/itineraries')
}


if(loading) return <Loader/>
if(!it) return <p>Not found.</p>


return (
<div className="space-y-4">
<div className="flex items-center justify-between">
<div>
<h2 className="text-2xl font-semibold">{it.itinerary_name}</h2>
<p className="opacity-70">ID: {it.itinerary_id}</p>
</div>
<div className="flex gap-2">
<button className="btn-ghost" onClick={()=>nav(`/itineraries/new?id=${it.itinerary_id}`)}>Edit</button>
<button className="btn-ghost" onClick={handleDelete}>Delete</button>
</div>
</div>


{days.length ? days.map((d,i)=> <DayTimeline key={i} day={d} />) : (
<div className="card">
<p className="opacity-80">This itinerary has no days yet or the JSON is invalid.</p>
</div>
)}
</div>
)
}