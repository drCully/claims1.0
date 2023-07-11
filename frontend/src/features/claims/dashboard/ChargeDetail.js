import { useEffect, useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { SButtonLink } from '../../../styles/buttonStyles'

import {
  useChargesQuery,
  useDeleteChargeMutation,
} from '../../charges/chargesApiSlice'

const numberFormatter = (params) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(params.value)
}

const ChargeDetail = () => {
  let { id } = useParams()

  const { data: charges, isLoading, isSuccess } = useChargesQuery(`claim=${id}`)
  const [deleteCharge] = useDeleteChargeMutation()

  const [rowData, setRowData] = useState(charges)
  const [columnDefs] = useState([
    {
      headerName: 'Date',
      field: 'date',
      valueFormatter: (params) => {
        return format(parseISO(params.value), 'MM/dd/yyyy')
      },
      minWidth: 145,
      sortable: true,
      sort: 'asc',
    },
    { field: 'description', flex: 4, wrapText: true, autoHeight: true },
    {
      field: 'amount',
      valueFormatter: numberFormatter,
      type: 'rightAligned',
      maxWidth: 120,
    },
    {
      headerName: 'Actions',
      field: 'id',
      cellRenderer: (params) => (
        <div>
          <Link to={`/charge/${params.data._id}`}>
            <FaRegEdit
              style={{
                color: 'green',
                marginRight: '.7em',
              }}
            />
          </Link>
          <FaRegTrashAlt
            style={{
              cursor: 'pointer',
              color: 'red',
            }}
            onClick={() => handleDelete(params.data._id)}
          />
        </div>
      ),
      type: 'rightAligned',
      maxWidth: 100,
    },
  ])

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
    }
  }, [])

  const handleDelete = async (id) => {
    if (
      window.confirm('Are you sure you want to delete this charge record? ')
    ) {
      await deleteCharge(id)
      toast.success('Charge Record Deleted Successfully')
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setRowData(charges)
    }
  }, [isSuccess, charges])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <SButtonLink
        to={'/charges/add'}
        margin={'0 0 .3rem 0'}
        fsize={'.9rem'}
        padding={'0.1rem 0.4rem'}
      >
        Add Charge
      </SButtonLink>
      <div
        className='ag-theme-alpine'
        style={{ height: 'calc(100vh - 27rem)' }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        ></AgGridReact>
      </div>
    </>
  )
}
export default ChargeDetail
