import { useState, useRef, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { AgGridReact } from 'ag-grid-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { useDeleteChargeMutation } from '../../charges/chargesApiSlice'
import { setSelectedCharges, setChargeAmount } from '../billingSlice'

const numberFormatter = (params) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(params.value)
}

const ChargeDetail = () => {
  const dispatch = useDispatch()

  const { chargeItems, selectedCharges } = useSelector((state) => state.billing)
  const [deleteCharge] = useDeleteChargeMutation()

  const gridRef = useRef()
  const [rowData, setRowData] = useState()
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
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

  const onGridReady = useCallback((params) => {
    setRowData(chargeItems)
  }, [])

  const onFirstDataRendered = useCallback((params) => {
    const refreshSelected = selectedCharges
    gridRef.current.api.deselectAll(true)
    gridRef.current.api.forEachNode((node) =>
      refreshSelected.map((item) => {
        if (item._id === node.data._id) {
          node.setSelected(true)
        }
      })
    )
  }, [])

  const onSelectionChanged = useCallback((event) => {
    const selectedRows = event.api.getSelectedRows()
    dispatch(setSelectedCharges(selectedRows))

    const chargeAmount = selectedRows.reduce((acc, item) => acc + item.total, 0)
    dispatch(setChargeAmount(chargeAmount))
  }, [])

  const handleDelete = async (id) => {
    if (
      window.confirm('Are you sure you want to delete this charge record? ')
    ) {
      await deleteCharge(id)
      toast.success('Charge Record Deleted Successfully')
    }
  }

  return (
    <div className='ag-theme-alpine' style={{ height: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection={'multiple'}
        rowMultiSelectWithClick={true}
        onGridReady={onGridReady}
        onFirstDataRendered={onFirstDataRendered}
        onSelectionChanged={onSelectionChanged}
      ></AgGridReact>
    </div>
  )
}
export default ChargeDetail
