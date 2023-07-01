import { useState, useRef, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { useDeleteTimeslipMutation } from '../../timeslips/timeslipsApiSlice'
import { setSelectedTime, setTimeAmount } from '../billingSlice'

const numberFormatter = (params) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(params.value)
}

const TimeDetail = () => {
  const dispatch = useDispatch()

  const { timeItems, selectedTime } = useSelector((state) => state.billing)
  const [deleteTimeslip] = useDeleteTimeslipMutation()

  const gridRef = useRef()
  const [rowData, setRowData] = useState(timeItems)
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
      maxWidth: 90,
      type: 'rightAligned',
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
      headerName: 'Actions',
      field: 'id',
      cellRenderer: (params) => (
        <div>
          <Link to={`/timeslip/${params.data._id}`}>
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
    setRowData(timeItems)
  }, [])

  const onFirstDataRendered = useCallback((params) => {
    const refreshSelected = selectedTime
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
    dispatch(setSelectedTime(selectedRows))

    const timeAmount = selectedRows.reduce((acc, item) => acc + item.total, 0)
    dispatch(setTimeAmount(timeAmount))
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this time record? ')) {
      await deleteTimeslip(id)
      toast.success('Time Record Deleted Successfully')
    }
  }

  return (
    <div className='ag-theme-alpine' style={{ height: 220 }}>
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
export default TimeDetail
