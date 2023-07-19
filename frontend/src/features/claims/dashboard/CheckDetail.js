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
  useChecksQuery,
  useDeleteCheckMutation,
} from '../../checks/checksApiSlice'

const numberFormatter = (params) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(params.value)
}

const CheckDetail = () => {
  let { id } = useParams()

  const { data: checks, isLoading, isSuccess } = useChecksQuery(`claim=${id}`)
  const [deleteCheck] = useDeleteCheckMutation()

  const [rowData, setRowData] = useState(checks)
  const [columnDefs] = useState([
    {
      headerName: 'Date',
      field: 'date',
      valueFormatter: (params) => {
        return format(parseISO(params.value), 'MM/dd/yyyy')
      },
      width: 100,
      minWidth: 95,
      maxWidth: 150,
      sortable: true,
      sort: 'asc',
    },
    {
      field: 'number',
      width: 100,
      minWidth: 95,
      maxWidth: 150,
      sortable: true,
    },
    {
      headerName: 'Payee',
      field: 'payee.name',
      flex: 3,
      width: 300,
      minWidth: 100,
      sortable: true,
    },
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
          <Link to={`/checks/${params.data._id}`}>
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
    if (window.confirm('Are you sure you want to delete this check record? ')) {
      await deleteCheck(id)
      toast.success('Check Record Deleted Successfully')
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setRowData(checks)
    }
  }, [isSuccess, checks])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <SButtonLink
        to={'/checks/add'}
        margin={'0 0 .3rem 0'}
        fsize={'.9rem'}
        padding={'0.1rem 0.4rem'}
      >
        Add Check
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
export default CheckDetail
