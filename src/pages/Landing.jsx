import React from 'react'
import { Link } from 'react-router-dom'


export default function Landing(){
return (
<div className="container grid md:grid-cols-2 gap-6 items-center">
<div>
<h1 className="text-3xl md:text-4xl font-bold mb-3">Plan stunning road trips with AI ✨</h1>
<p className="opacity-80 mb-6">Create itineraries tailored to your vibe. Save, edit, and revisit your trips — all synced with your account.</p>
<div className="flex gap-2">
<Link className="btn-primary" to="/signup">Get started</Link>
<Link className="btn-ghost" to="/login">I have an account</Link>
</div>
</div>
<div className="card">
<h3 className="font-semibold mb-2">What you can do</h3>
<ul className="list-disc ml-6 space-y-1">
<li>Sign up & log in securely</li>
<li>Create itineraries from AI JSON</li>
<li>View/edit days, activities, food & stays</li>
<li>Manage your profile</li>
</ul>
</div>
</div>
)
}