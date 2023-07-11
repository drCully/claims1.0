import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { FaCheck, FaTimes, FaRegEye } from 'react-icons/fa'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useClaimsQuery, useDeleteClaimMutation } from './claimsApiSlice'

const ClaimsListDetail = ({ searchClaim, activeStatus }) => {
  const { data: claims, isLoading } = useClaimsQuery(
    `name=${searchClaim}&isActive=${activeStatus}`,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [deleteClaim] = useDeleteClaimMutation()

  const gridRef = useRef()
  const [rowData, setRowData] = useState()
  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'number',
      width: 100,
      minWidth: 100,
      maxWidth: 100,
      sortable: true,
    },
    {
      headerName: 'Claim',
      field: 'name',
      flex: 3,
      minWidth: 200,
      sortable: true,
      sort: 'asc',
    },
    {
      field: 'vessel',
      flex: 2,
      minWidth: 150,
      sortable: true,
    },
    {
      headerName: 'DOL/DOI',
      field: 'dol',
      valueFormatter: (params) => {
        return format(parseISO(params.value), 'MM/dd/yyyy')
      },
      maxWidth: 120,
      minWidth: 90,
      sortable: true,
    },
    {
      headerName: 'Active?',
      field: 'isActive',
      cellRenderer: (params) => (
        <div style={{ textAlign: 'center' }}>
          {params.value ? (
            <FaCheck style={{ color: 'green' }} />
          ) : (
            <FaTimes style={{ color: 'red' }} />
          )}
        </div>
      ),
      width: 80,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      headerName: 'Actions',
      field: 'id',
      cellRenderer: (params) => (
        <div>
          <Link to={`/claims/dashboard/${params.data._id}`}>
            <FaRegEye style={{ color: 'OrangeRed', marginRight: '.7em' }} />
          </Link>
        </div>
      ),
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

  const onGridReady = useCallback((params) => {
    setRowData(claims)
  }, [])

  useEffect(() => {
    setRowData(claims)
  }, [claims])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this claim? ')) {
      await deleteClaim(id)
      toast.success('User Deleted Successfully')
    }
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
export default ClaimsListDetail
