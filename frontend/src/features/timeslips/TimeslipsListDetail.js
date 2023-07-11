import { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { AgGridReact } from 'ag-grid-react'
import { toast } from 'react-toastify'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { SFlexCol, SFlexContainer } from '../../styles/containerStyles'

import {
  useTimeslipsQuery,
  useDeleteTimeslipMutation,
} from './timeslipsApiSlice'

const numberFormatter = (params) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(params.value)
}

const TimeslipsListDetail = () => {
  const timekeeper = useAuth().userId
  const { lastDate } = useSelector((state) => state.session)

  const {
    data: timeslips,
    isLoading,
    isSuccess,
  } = useTimeslipsQuery(`date=${lastDate}&timekeeper=${timekeeper}`, {
    refetchOnMountOrArgChange: true,
  })

  const [deleteTime] = useDeleteTimeslipMutation()

  const gridRef = useRef()
  const [rowData, setRowData] = useState()
  const [totalHours, setTotalHours] = useState(0)

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Claim',
      field: 'claim.name',

      flex: 2,
      maxWidth: 300,
      sortable: true,
    },
    {
      field: 'hours',
      valueFormatter: numberFormatter,
      type: 'rightAligned',
      cellRenderer: (params) => (
        <div>
          {params.node.rowPinned ? (
            <span style={{ fontWeight: 'bold' }}>
              {numberFormatter(params)}
            </span>
          ) : (
            <>
              <span>{params.data.hours}</span>
            </>
          )}
        </div>
      ),
      width: 70,
      minWidth: 65,
      maxWidth: 90,
    },
    {
      field: 'description',
      flex: 4,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: 'Actions',
      field: 'id',
      cellRenderer: (params) => (
        <div>
          {!params.data._id ? (
            ''
          ) : (
            <>
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
            </>
          )}
        </div>
      ),
      pinnedRowCellRenderer: function (params) {
        return <span></span>
      },
      cellStyle: { textAlign: 'center' },
      resizable: false,
      maxWidth: 100,
    },
  ])

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    }
  }, [])

  const handleDelete = async (id) => {
    if (
      window.confirm('Are you sure you want to delete this charge record? ')
    ) {
      await deleteTime(id)
      toast.success('Time Record Deleted Successfully')
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setRowData(timeslips)

      const getTotal = timeslips.reduce(
        (total, currentValue) => (total = total + currentValue.hours),
        0
      )
      const totalRow = []
      totalRow.push({
        claim: undefined,
        hours: getTotal,
        description: undefined,
        actions: undefined,
      })
      setTotalHours(totalRow)
    }
  }, [isSuccess, timeslips])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isSuccess) {
    return (
      <div
        className='ag-theme-alpine'
        style={{ width: '100%', height: '100%' }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pinnedBottomRowData={totalHours}
          //pagination={true}
          //paginationAutoPageSize={true}
        ></AgGridReact>
      </div>
    )
  }
}
export default TimeslipsListDetail
