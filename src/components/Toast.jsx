import React from 'react'
export default function Toast({ children }){
return <div role="status" className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl shadow-lg">{children}</div>
}