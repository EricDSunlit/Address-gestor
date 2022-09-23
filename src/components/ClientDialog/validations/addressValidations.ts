import * as yup from 'yup'

export const addresSchema = yup.object().shape({
  addressLine1: yup.string().required(),
  addressLine2: yup.string().required(),
  city: yup.string().required(),
  region: yup.string().required(),
  postalCode: yup.string().required(),
  countryId: yup.number().required(),
})
