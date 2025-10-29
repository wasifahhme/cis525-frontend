import React from 'react'
export default function FormField({ label, type='text', value, onChange, name, placeholder, required }){
return (
<label className="block mb-3">
<div className="label mb-1">{label}</div>
<input className="input" type={type} value={value} onChange={onChange} name={name} placeholder={placeholder} required={required} />
</label>
)
}