import client from './client.js'


export async function getCustomer(id){
const { data } = await client.get(`/api/customers/${id}`)
return data
}
export async function updateCustomer(id, payload){
const { data } = await client.put(`/api/customers/${id}`, payload)
return data
}
export async function deleteCustomer(id){
const { data } = await client.delete(`/api/customers/${id}`)
return data
}