import React from 'react'
import { Link } from 'react-router-dom'


export default function ItineraryCard({ it }){
return (
<div className="card">
<div className="flex items-center justify-between">
<div>
<h3 className="text-lg font-semibold">{it.itinerary_name}</h3>
<p className="text-sm opacity-70">#{it.itinerary_id}</p>
</div>
<Link className="btn-primary" to={`/itineraries/${it.itinerary_id}`}>Open</Link>
</div>
</div>
)
}