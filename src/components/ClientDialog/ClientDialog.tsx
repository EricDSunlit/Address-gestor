import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { Client, EmptyClient } from '../../models'
import { Address, EmptyAddress } from '../../models/addresses.interface'
import { deleteAddress, updateAddress } from '../../services'
import { clientSchema } from './validations'
import * as yup from 'yup'
import { addresSchema } from './validations/addressValidations'

import {
  createAddress,
  getClient,
  createClient,
  updateClient,
  joinClientAddress,
} from '../../services'

interface ClientDialogProps {
  isOpen: boolean
  handleModal: () => void
  id: number | undefined
}

function ClientDialog({ isOpen, handleModal, id }: ClientDialogProps) {
  const title = id ? 'Edit Client' : 'Create Client'
  const [client, setClient] = useState<Client>(EmptyClient)
  const [address, setAddress] = useState<Address>(EmptyAddress)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [adding, setAdding] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const buttonText = editing ? 'edit address' : 'confirm address'

  const handleAdding = () => {
    setAdding((previousAddingState) => !previousAddingState)
    setAddress(EmptyAddress)
    setEditing(false)
  }

  const handleClientAddress = async () => {
    const isValid = await addresSchema.isValid(address)
    if (isValid) {
      if (!editing) {
        let clientCopy: Client = { ...client }
        clientCopy.addresses?.push(address)
        setClient(clientCopy)
        setAddresses([...addresses, address])
        handleAdding()
      } else {
        const response = await updateAddress(address)
        if (response === '') {
          handleGetClient()
          handleAdding()
          alert('Updated Successfully')
        }
      }
    } else {
      alert('Incorrect address data, please check it and try again')
    }
  }

  const handleChange = (e: any, isAddress: boolean = false) => {
    const { name, value } = e.target
    if (isAddress) {
      setAddress({ ...address, [name]: value })
    } else {
      setClient({ ...client, [name]: value })
    }
  }

  const handleAddressEdit = (address: Address) => {
    setAddress({ ...address, countryId: 1 })
    setAdding(true)
    setEditing(true)
  }

  const handleAddressDelete = async (id: number, adrl1: string = '') => {
    if (
      confirm('This address is going to be permanently deleted, are you sure?')
    ) {
      if (id !== 0) {
        const response = await deleteAddress(id)
        if (response === '') {
          handleGetClient()
          alert('Deleted Successfully')
        }
      } else {
        const addressesCopy = addresses.filter(
          (addrs) => addrs.addressLine1 !== adrl1
        )
        setAddresses(addressesCopy)
        setClient({ ...client, addresses: addressesCopy })
      }
    }
  }

  const handleSubmit = async () => {
    const model = {
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone.toString(),
    }
    const isValid = await clientSchema.isValid(model)
    if (isValid) {
      if (!id) {
        const response = await createClient(client)
        if (
          response.id &&
          response.addresses &&
          response.addresses.length > 0
        ) {
          alert('Created Successfully')
        } else {
          return
        }
      } else {
        const response = await updateClient(client)
        if (response.id && addresses.length > 0) {
          addresses.forEach(async (addr) => {
            const postedAddress = await createAddress(addr)
            if (postedAddress.id) {
              const fkResponse = await joinClientAddress({
                clientId: response.id,
                addressId: postedAddress.id,
              })
              if (!fkResponse.id) {
                return
              } else {
                alert('Updated Successfully')
              }
            }
          })
        }
      }
      handleModal()
    } else {
      alert('Invalid client form, plese check it')
    }
  }

  const handleGetClient = async () => {
    if (id) {
      setClient(await getClient(id))
    } else {
      let client2: Client = {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        phone: 0,
        addresses: [],
      }
      setClient(client2)
    }
  }

  useEffect(() => {
    handleGetClient()
  }, [])

  return (
    <div>
      <Dialog open={isOpen} maxWidth="md" fullWidth onClose={handleModal}>
        <Typography variant="h5" padding={3}>
          {title}
        </Typography>
        <form>
          <Box
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              textAlign: 'center',
              padding: 2,
            }}
          >
            <TextField
              required
              name="firstName"
              value={client?.firstName}
              label="Firt Name"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ maxLength: 100 }}
              onChange={handleChange}
            />
            <TextField
              required
              name="lastName"
              value={client?.lastName}
              label="Last Name"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
            />
            <TextField
              required
              name="email"
              value={client?.email}
              label="Email"
              type="email"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
            />
            <TextField
              required
              name="phone"
              value={client?.phone}
              label="Phone Number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
            />
          </Box>
        </form>
        <Divider>
          <Typography
            sx={{ mt: 0.5, ml: 2 }}
            color="text.secondary"
            display="block"
            variant="caption"
          >
            Manage addresses
          </Typography>
        </Divider>
        <Box
          sx={{
            '& .MuiAccordion-root': { m: 1, width: '30ch' },
            maxWidth: '100vw',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            paddingX: 6,
            paddingY: 2,
          }}
        >
          {client?.addresses &&
            client?.addresses.length > 0 &&
            client.addresses.map((address, index) => (
              <div key={index}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls={`${address.id}-panel1-content`}
                    id={`${address.id}-panel1a-header`}
                  >
                    <Typography>{address.addressLine1}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle2">
                      <strong>Address Line 2:</strong>
                    </Typography>
                    <Typography>{address.addressLine2}</Typography>

                    <Typography variant="subtitle2">
                      <strong>City:</strong>
                    </Typography>
                    <Typography>{address.city}</Typography>

                    <Typography variant="subtitle2">
                      <strong>Region:</strong>
                    </Typography>
                    <Typography>{address.region}</Typography>

                    <Typography variant="subtitle2">
                      <strong>Postal Code:</strong>
                    </Typography>
                    <Typography>{address.postalCode}</Typography>

                    <Typography variant="subtitle2">
                      <strong>Country:</strong>
                    </Typography>
                    <Typography>{address.country?.name}</Typography>
                    <Box
                      sx={{
                        '& .MuiButton-root': { margin: 1 },
                      }}
                    >
                      {id && (
                        <Button
                          variant="contained"
                          onClick={() => handleAddressEdit(address)}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          handleAddressDelete(address.id, address.addressLine1)
                        }
                      >
                        Delete
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}
        </Box>

        {adding && (
          <form>
            <FormControl>
              <Box
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                  textAlign: 'center',
                  padding: 2,
                }}
              >
                <TextField
                  required
                  name="addressLine1"
                  value={address?.addressLine1}
                  label="Address Line 1"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => handleChange(e, true)}
                />
                <TextField
                  value={address?.addressLine2}
                  name="addressLine2"
                  label="Address Line 2"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => handleChange(e, true)}
                />
                <TextField
                  required
                  value={address?.city}
                  name="city"
                  label="City"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => handleChange(e, true)}
                />
                <TextField
                  required
                  value={address?.region}
                  name="region"
                  label="Region"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => handleChange(e, true)}
                />
                <TextField
                  required
                  value={address?.postalCode}
                  name="postalCode"
                  label="PostalCode"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ maxLength: 10 }}
                  onChange={(e) => handleChange(e, true)}
                />
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="country-id">Country</InputLabel>
                  <Select
                    required
                    name="countryId"
                    labelId="country-id"
                    value={address?.countryId}
                    label="Country"
                    onChange={(e) => handleChange(e, true)}
                  >
                    <MenuItem value={1}>Dominican Republic</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </FormControl>
          </form>
        )}

        <Box
          sx={{
            '& .MuiButton-root': { m: 1, width: '23ch' },
            textAlign: 'center',
          }}
        >
          {!adding ? (
            <Button variant="contained" onClick={handleAdding}>
              ADD ADDRESS
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClientAddress}
              >
                {buttonText}
              </Button>
              <Button variant="contained" color="error" onClick={handleAdding}>
                CANCEL
              </Button>
            </>
          )}
        </Box>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="contained" color="error" onClick={handleModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
export default ClientDialog
