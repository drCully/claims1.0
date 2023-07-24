import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { SButtonLink } from '../../../styles/buttonStyles'
import { SFlexContainer } from '../../../styles/containerStyles'

import { useInvoicesQuery } from '../../billings/invoice/invoicesApiSlice'

const numberFormatter = (params) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(params.value)
}

const BillingDetail = () => {
  const navigate = useNavigate()
  let { id } = useParams()

  const {
    data: invoices,
    isLoading,
    isSuccess,
  } = useInvoicesQuery(`claim=${id}&status=posted`)

  const [rowData, setRowData] = useState(invoices)
  const [columnDefs] = useState([
    {
      field: 'date',
      valueFormatter: (params) => {
        return format(parseISO(params.value), 'MM/dd/yyyy')
      },
      minWidth: 110,
      maxWidth: 145,
      sortable: true,
      sort: 'asc',
    },
    {
      field: 'number',
      valueFormatter: numberFormatter,
      type: 'rightAligned',
      cellRenderer: (params) => (
        <Link
          to={`/billings/${params.data._id}`}
          style={{
            cursor: 'pointer',
            color: 'blue',
            textDecoration: 'none',
          }}
        >
          {params.data.number}
        </Link>
      ),
      minWidth: 85,
      maxWidth: 110,
    },
    {
      headerName: 'Client',
      field: 'client.name',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Amount',
      field: 'amount',
      valueGetter: (params) => {
        return params.data.timeAmount + params.data.chargeAmount
      },

      valueFormatter: numberFormatter,
      type: 'rightAligned',
      minWidth: 95,
      maxWidth: 120,
    },
  ])

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
    }
  }, [])

  useEffect(() => {
    if (isSuccess) {
      setRowData(invoices)
    }
  }, [isSuccess, invoices])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div
        className='ag-theme-alpine'
        style={{ height: 'calc(100vh - 24.8rem)' }}
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
export default BillingDetail
