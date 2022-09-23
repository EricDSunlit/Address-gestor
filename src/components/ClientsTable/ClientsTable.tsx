import { Button } from '@mui/material'
import { DataGrid, GridRenderCellParams, GridColumns } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { Client } from '../../models'
import { Response } from '../../models/response.interface'
import {
  ButtonContainer,
  TableContainer,
} from '../../pages/Home/styled-components'
import { deleteClient, getClients } from '../../services'
import { ClientDialog } from '../ClientDialog'

function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | undefined>()
  const pageSize = 5

  const handleEdit = (id: number) => {
    setSelectedId(id)
    handleModal()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Do you really want to delete this client?')) {
      const response = await deleteClient(id)
      if (response.data.message) {
        handleClients()
        alert(response.data.message)
      }
    }
  }
  const handleModal = () => {
    setOpen((previousModalState) => !previousModalState)
    if (open === true) {
      setSelectedId(undefined)
      handleClients()
    }
  }

  const handleClients = async () => {
    setClients(await getClients())
  }

  const colums: GridColumns = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      flex: 2,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <>
          ({params.value.toString().substring(0, 3)}){' '}
          {params.value.toString().substring(3, 6)}-
          {params.value.toString().substring(6, params.value.length)}
        </>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      flex: 2,
      minWidth: 210,
      maxWidth: 220,
      cellClassName: 'actions',
      getActions: ({ row }) => {
        return [
          <Button variant="contained" onClick={() => handleEdit(row.id)}>
            Details
          </Button>,
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>,
        ]
      },
    },
  ]

  useEffect(() => {
    handleClients()
  }, [])

  return (
    <>
      {/* START DIALOG */}
      {open && (
        <ClientDialog isOpen={open} handleModal={handleModal} id={selectedId} />
      )}
      {/* END DIALOG */}

      <ButtonContainer>
        <Button variant="contained" onClick={handleModal}>
          New client
        </Button>
      </ButtonContainer>
      <TableContainer>
        <DataGrid
          autoHeight
          columns={colums}
          disableColumnSelector
          disableSelectionOnClick
          getRowId={(row: Client) => row.id}
          pageSize={pageSize}
          rows={clients}
          rowsPerPageOptions={[pageSize]}
          loading={clients.length < 1}
        />
      </TableContainer>
    </>
  )
}

export default ClientsTable
