import * as yup from 'yup'

export const clientSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().min(10).max(10),
})
