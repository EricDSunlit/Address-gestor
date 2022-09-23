interface Country {
  id: number
  name: string
}

export interface Address {
  id: number
  addressLine1: string
  addressLine2: string
  city: string
  region: string
  postalCode: string
  countryId?: number
  country?: Country
}

export const EmptyAddress = {
  id: 0,
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '',
  postalCode: '',
  countryId: 1,
}
