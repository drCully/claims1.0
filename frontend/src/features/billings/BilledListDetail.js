import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import {
  useTable,
  useFlexLayout,
  usePagination,
  useRowSelect,
  useSortBy,
} from 'react-table'
import { format, parseISO } from 'date-fns'
import { TableLayout } from '../../components/TableLayout'
import { useInvoicesQuery } from './invoice/invoicesApiSlice'

const numberFormatter = (params) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(params.value)
}

const BilledListDetail = () => {
  const {
    data: invoices,
    isLoading,
    isSuccess,
  } = useInvoicesQuery('status=posted')

  const gridRef = useRef()
  const [rowData, setRowData] = useState()
  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'date',
      valueFormatter: (params) => {
        return format(parseISO(params.value), 'MM/dd/yyyy')
      },
      width: 110,
      minWidth: 110,
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
      width: 85,
      minWidth: 85,
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
      width: 95,
      minWidth: 95,
    },
  ])

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    }
  }, [])

  const onGridReady = useCallback((params) => {
    setRowData(invoices)
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
    <div className='ag-theme-alpine' style={{ width: '100%', height: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationAutoPageSize={true}
      ></AgGridReact>
    </div>
  )
}
export default BilledListDetail
