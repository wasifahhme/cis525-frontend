import barba from '@barba/core'
import { useEffect } from 'react'


export default function useBarba(namespace){
useEffect(() => {
// Safety: destroy any previous instance to avoid duplicates
try { barba.destroy() } catch {}


// Minimal SPA-safe init. We prevent PJAX navigation (React Router handles routing)
// and just use Barba's lifecycle to add a fade class.
barba.init({
// Prevent Barba from hijacking links; we only want the hooks
prevent: () => true,
transitions: [{
name: 'react-fade',
once({ next }){
const el = document.querySelector('main')
if(!el) return
el.classList.add('barba-enter')
requestAnimationFrame(()=>{
el.classList.add('barba-enter-active')
el.classList.remove('barba-enter')
})
setTimeout(()=> el.classList.remove('barba-enter-active'), 250)
},
enter(){
const el = document.querySelector('main')
if(!el) return
el.classList.add('barba-enter')
requestAnimationFrame(()=>{
el.classList.add('barba-enter-active')
el.classList.remove('barba-enter')
})
setTimeout(()=> el.classList.remove('barba-enter-active'), 250)
},
leave(){ /* noop: React Router unmounts */ }
}]
})


return () => { try { barba.destroy() } catch {} }
}, [namespace])
}