import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { SButton } from '../../../styles/buttonStyles'
import { SFlexContainer } from '../../../styles/containerStyles'
import { SSelect } from '../../../styles/formStyles'

import {
  useTimeslipsQuery,
  useDeleteTimeslipMutation,
} from '../../timeslips/timeslipsApiSlice'

const numberFormatter = (params) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(params.value)
}

const TimeDetail = () => {
  const [billedStatus, setBilledStatus] = useState('')
  const onChangeBilledStatus = (event) => {
    const billedStatus = event.target.value
    setBilledStatus(billedStatus)
  }

  const navigate = useNavigate()
  let { id } = useParams()

  const {
    data: timeslips,
    isLoading,
    isSuccess,
  } = useTimeslipsQuery(`claim=${id}&billed=${billedStatus}`)
  const [deleteTimeslip] = useDeleteTimeslipMutation()

  const [rowData, setRowData] = useState(timeslips)
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
    {
      headerName: 'TK',
      field: 'timekeeper.initials',
      sortable: true,
      width: 60,
      minWidth: 60,
      maxWidth: 80,
    },
    { field: 'description', flex: 4, wrapText: true, autoHeight: true },
    {
      field: 'hours',
      valueFormatter: numberFormatter,
      type: 'rightAligned',
      maxWidth: 90,
    },
    {
      field: 'rate',
      valueFormatter: numberFormatter,
      type: 'rightAligned',
      maxWidth: 90,
    },
    {
      field: 'amount',
      valueGetter: (params) => {
        return params.data.hours * params.data.rate
      },

      valueFormatter: numberFormatter,
      type: 'rightAligned',
      maxWidth: 120,
    },
    {
      headerName: 'Status',
      field: 'billed',
      cellRenderer: (params) => (
        <div style={{ textAlign: 'center' }}>
          {params.data.billed ? 'Billed' : 'Unbilled'}
        </div>
      ),
      maxWidth: 90,
    },
    {
      headerName: 'Actions',
      field: 'id',
      cellRenderer: (params) => (
        <div>
          <Link to={`/timeslips/${params.data._id}`}>
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

  const handleAddTime = () => {
    navigate('/timeslips/add')
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this time record? ')) {
      await deleteTimeslip(id)
      toast.success('Time Record Deleted Successfully')
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setRowData(timeslips)
    }
  }, [isSuccess, timeslips])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <SFlexContainer>
        <SSelect
          onChange={(event) => {
            onChangeBilledStatus(event)
          }}
          width='10rem'
          style={{ margin: '0 1rem .3rem' }}
        >
          <option value=''>Show All</option>
          <option value='false'>Show Unbilled</option>
          <option value='true'>Show Billed</option>
        </SSelect>
        <SButton
          onClick={handleAddTime}
          margin={'0 0 .3rem 0'}
          fsize={'.9rem'}
          padding={'0.1rem 0.4rem'}
        >
          Add Time
        </SButton>
      </SFlexContainer>

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
export default TimeDetail
