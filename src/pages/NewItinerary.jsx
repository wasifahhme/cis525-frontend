import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as API from '../api/itineraries.js'
import FormField from '../components/FormField.jsx'

export default function NewItinerary(){
const [sp] = useSearchParams()
const nav = useNavigate()
const editingId = sp.get('id')
const auth = JSON.parse(localStorage.getItem('auth')||'null')
const cid = auth?.customer?.customer_id
const [name,setName] = useState('')
const [jsonText,setJsonText] = useState('')
const [error,setError] = useState('')

useEffect(()=>{
if(!editingId) return
(async()=>{
const data = await API.getItinerary(editingId)
setName(data.itinerary_name)
setJsonText(typeof data.itinerary_data === 'string' ? data.itinerary_data : JSON.stringify(data.itinerary_data, null, 2))
})()
},[editingId])

function validateJSON(){
try{ const p = JSON.parse(jsonText); if(!p.itinerary || !Array.isArray(p.itinerary)) throw new Error('Root must have an "itinerary" array'); return p }
catch(e){ setError(e.message); return null }
}

async function onSubmit(e){
e.preventDefault(); setError('')
const parsed = validateJSON(); if(!parsed) return
try{
if(editingId){ await API.updateItinerary(editingId, { itinerary_name: name, itinerary_data: parsed }) }
else { await API.createItinerary(cid, { itinerary_name: name, itinerary_data: parsed }) }
nav('/itineraries')
}catch(err){ setError(err.message) }
}

return (
<div className="grid gap-4 md:grid-cols-2">
<div className="card">
<h2 className="text-xl font-semibold mb-3">{editingId? 'Edit' : 'New'} Itinerary</h2>
<form onSubmit={onSubmit}>
<FormField label="Itinerary name" value={name} onChange={e=>setName(e.target.value)} required />
<div className="label mb-1">Itinerary JSON</div>
<textarea className="input min-h-[300px] font-mono" value={jsonText} onChange={e=>setJsonText(e.target.value)} placeholder='{"itinerary": [ ... ]}'/>
<div className="flex gap-2 mt-3">
<button className="btn-primary">Save</button>
<button className="btn-ghost" type="button" onClick={()=>nav(-1)}>Cancel</button>
</div>
{error && <p className="text-red-600 mt-2">{error}</p>}
</form>
</div>
<div className="card">
<h3 className="font-semibold mb-2">Schema (quick ref)</h3>
<pre className="text-xs whitespace-pre-wrap opacity-80">{`{
"itinerary": [
{
"day": 1,
"driving_summary": { "start": "", "end": "", "estimated_time": "" },
"activities": [{ "name": "", "description": "" }],
"food_suggestions": [{ "name": "", "description": "" }],
"overnight_lodging_suggestion": { "location": "", "description": "" }
}
]
}`}</pre>
</div>
</div>
)
}