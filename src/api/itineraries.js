import client from './client.js'


export async function listItineraries(customer_id){
const { data } = await client.get(`/api/customers/${customer_id}/itineraries`)
return data
}
export async function createItinerary(customer_id, payload){
const { data } = await client.post(`/api/customers/${customer_id}/itineraries`, payload)
return data
}
export async function getItinerary(id){
const { data } = await client.get(`/api/itineraries/${id}`)
return data
}
export async function updateItinerary(id, payload){
const { data } = await client.put(`/api/itineraries/${id}`, payload)
return data
}
export async function deleteItinerary(id){
const { data } = await client.delete(`/api/itineraries/${id}`)
return data
}