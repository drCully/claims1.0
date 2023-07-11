import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useBillingsQuery } from './billingsApiSlice'
import { setClaimId, setTimeAmount, setChargeAmount } from './billingSlice'

const numberFormatter = (params) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(params.value)
}

const BillableListDetail = ({ searchClaim }) => {
  const { asOfDate } = useSelector((state) => state.billing)

  const {
    data: billable,
    isLoading,
    isSuccess,
  } = useBillingsQuery(`claim=${searchClaim}&lastdate=${asOfDate}`, {
    refetchOnMountOrArgChange: true,
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const gridRef = useRef()
  const [rowData, setRowData] = useState()
  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'claimName',
      cellRenderer: (params) => (
        <span
          style={{
            cursor: 'pointer',
            color: 'blue',
          }}
          onClick={() =>
            handleCreateInvoice(
              params.data._id,
              params.data.billableTime,
              params.data.billableCharges
            )
          }
        >
          {params.data.claimName}
        </span>
      ),
      flex: 3,
      minWidth: 300,
      sortable: true,
      sort: 'asc',
    },
    {
      headerName: 'Hours',
      field: 'billableHours',
      valueFormatter: numberFormatter,
      type: 'rightAligned',
      width: 70,
      minWidth: 65,
    },
    {
      headerName: 'Amount',
      field: 'billableTime',
      valueFormatter: numberFormatter,
      type: 'rightAligned',
      width: 90,
      minWidth: 90,
    },
    {
      headerName: 'Charges',
      field: 'billableCharges',
      valueFormatter: numberFormatter,
      type: 'rightAligned',
      width: 90,
      minWidth: 90,
    },
    {
      headerName: 'Total',
      field: 'billableHours',
      valueFormatter: numberFormatter,
      type: 'rightAligned',
      width: 90,
      minWidth: 90,
    },
  ])

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    }
  }, [])

  const onGridReady = useCallback((params) => {
    setRowData(billable)
  }, [])

  useEffect(() => {
    if (isSuccess) {
      setRowData(billable)
    }
  }, [isSuccess, billable])

  const handleCreateInvoice = (id, timeAmount, chargeAmount) => {
    dispatch(setClaimId(id))
    dispatch(setTimeAmount(timeAmount))
    dispatch(setChargeAmount(chargeAmount))
    navigate('/billings/add')
  }

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
export default BillableListDetail
