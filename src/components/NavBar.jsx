import React from 'react'
import { Link } from 'react-router-dom'


export default function NavBar(){
const auth = JSON.parse(localStorage.getItem('auth')||'null')
const name = auth?.customer?.first_name
return (
<header className="nav">
<nav className="container flex items-center justify-between py-3">
<Link className="font-semibold" to="/">AI Road‑Trip Planner</Link>
<div className="flex items-center gap-2">
{auth ? (
<>
<Link className="btn-ghost" to="/dashboard">Dashboard</Link>
<Link className="btn-ghost" to="/itineraries">Itineraries</Link>
<Link className="btn-ghost" to="/profile">{name ? `Hi, ${name}` : 'Profile'}</Link>
</>
) : (
<>
<Link className="btn-ghost" to="/login">Log in</Link>
<Link className="btn-primary" to="/signup">Sign up</Link>
</>
)}
</div>
</nav>
</header>
)
}