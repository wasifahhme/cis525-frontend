import React from 'react'
import ActivityCard from './ActivityCard.jsx'


export default function DayTimeline({ day }){
const drive = day?.driving_summary || {}
return (
<section className="card">
<h3 className="text-xl font-semibold mb-2">Day {day.day}</h3>
<p className="text-sm mb-3 opacity-80">{drive.start} → {drive.end} · {drive.estimated_time}</p>
<div className="grid-auto">
{day?.activities?.map((a,idx)=> <ActivityCard key={idx} title={a.name} desc={a.description} />)}
</div>
{Array.isArray(day.food_suggestions) && (
<div className="mt-4">
<h4 className="font-semibold mb-2">Food suggestions</h4>
<ul className="list-disc ml-6 space-y-1">
{day.food_suggestions.map((f,idx)=>(
<li key={idx}><span className="font-medium">{f.name}</span> — <span className="opacity-80">{f.description}</span></li>
))}
</ul>
</div>
)}
{day.overnight_lodging_suggestion && (
<div className="mt-4">
<h4 className="font-semibold">Stay</h4>
<p className="opacity-80">{day.overnight_lodging_suggestion.location} — {day.overnight_lodging_suggestion.description}</p>
</div>
)}
</section>
)
}