import axios from 'axios'
import { Address } from '../models/addresses.interface'
import { BASEURL } from './services.constants'

export const addressURL = `${BASEURL}/addresses`

export const createAddress = async (body: Address) => {
  return axios
    .post<Address>(`${addressURL}`, body)
    .then((res) => res.data)
    .catch((err) => {
      throw err
    })
}
export const updateAddress = async (body: Address) => {
  return axios
    .put(`${addressURL}/${body.id}`, body)
    .then((res) => res.data)
    .catch((err) => {
      throw err
    })
}

export const deleteAddress = async (id: number) => {
  return axios
    .delete(`${addressURL}/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err
    })
}
