import React from 'react'
export default function ActivityCard({ title, desc }){
return (
<article className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
<h5 className="font-semibold">{title}</h5>
<p className="text-sm opacity-80">{desc}</p>
</article>
)
}