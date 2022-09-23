import { Address } from './addresses.interface'

export interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: number
  addresses?: Address[]
}

export interface JoinClient {
  clientId: number
  addressId: number
}

export const EmptyClient: Client = {
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: 0,
  addresses: [],
}
