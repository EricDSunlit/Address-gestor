import axios from 'axios'
import { Client, JoinClient } from '../models'
import { Response } from '../models/response.interface'
import { BASEURL } from './services.constants'

export const clientURL = `${BASEURL}/clients`

export const getClients = async () => {
  return axios
    .get<Client[]>(`${clientURL}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err)
      throw err
    })
}

export const getClient = async (id: number) => {
  return axios
    .get<Client>(`${clientURL}/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err)
      throw err
    })
}

export const createClient = async (body: Client) => {
  return axios
    .post<Client>(`${clientURL}`, body)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err)
      throw err
    })
}

export const joinClientAddress = async (body: JoinClient) => {
  return axios
    .post<Client>(`${clientURL}/address`, body)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err)
      throw err
    })
}

export const deleteClient = async (id: number) => {
  return axios
    .delete(`${clientURL}/${id}`)
    .then((res) => res)
    .catch((err) => {
      console.log(err)
      throw err
    })
}

export const updateClient = async (body: Client) => {
  return axios
    .put<Client>(`${clientURL}/${body.id}`, body)
    .then((res) => res.data)
    .catch((err) => {
      throw err
    })
}
