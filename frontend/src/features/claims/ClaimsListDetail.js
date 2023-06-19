import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { FaCheck, FaTimes, FaRegEye } from 'react-icons/fa'
import {
  useTable,
  useFlexLayout,
  usePagination,
  useRowSelect,
  useSortBy,
} from 'react-table'
import { TableLayout } from '../../components/TableLayout'
import { useClaimsQuery, useDeleteClaimMutation } from './claimsApiSlice'

export function ClaimsListDetail({ searchClaim, activeStatus }) {
  const { data: claims, isLoading } = useClaimsQuery(
    `name=${searchClaim}&isActive=${activeStatus}`,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [tableData, setTableData] = useState(null)
  const [deleteClaim] = useDeleteClaimMutation()

  useEffect(() => {
    setTableData(claims)
  }, [claims])

  if (isLoading || !tableData) {
    return <div>Loading...</div>
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this claim? ')) {
      await deleteClaim(id)
      toast.success('User Deleted Successfully')
    }
  }

  return <TableInstance tableData={tableData} handleDelete={handleDelete} />
}

const TableInstance = ({ tableData, handleDelete }) => {
  const [columns, data] = useMemo(() => {
    const columns = [
      {
        Header: 'Number',
        accessor: 'number',
        width: 40,
        minWidth: 40,
        maxWidth: 40,
      },
      {
        Header: 'Name',
        accessor: 'name',
        width: 150,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        Header: 'Vessel',
        accessor: 'vessel',
        width: 70,
        minWidth: 70,
        maxWidth: 70,
      },
      {
        Header: 'DOL/DOI',
        accessor: 'dol',
        Cell: ({ value }) => (
          <div style={{ textAlign: 'center' }}>
            {format(parseISO(value), 'MM/dd/yyyy')}
          </div>
        ),
        width: 60,
        minWidth: 60,
        maxWidth: 60,
      },
      {
        Header: 'Active?',
        accessor: 'isActive',
        Cell: ({ value }) => (
          <div style={{ textAlign: 'center' }}>
            {value ? (
              <FaCheck style={{ color: 'green' }} />
            ) : (
              <FaTimes style={{ color: 'red' }} />
            )}
          </div>
        ),
        width: 30,
        minWidth: 30,
        maxWidth: 30,
      },
    ]
    return [columns, tableData]
  }, [tableData])

  const defaultColumn = useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
      align: 'center',
    }),
    []
  )

  const actionColumn = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        Header: 'Details',
        minWidth: 25,
        width: 25,
        maxWidth: 30,
        align: 'center',
        Cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Link to={`/claims/admin/${row.original._id}`}>
              <FaRegEye style={{ color: 'OrangeRed', marginRight: '.7em' }} />
            </Link>
          </div>
        ),
      },
    ])
  }

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        pageIndex: 0,
        pageSize: 15,
        sortBy: [{ id: 'name', desc: false }],
      },
    },
    useFlexLayout,
    useSortBy,
    usePagination,
    useRowSelect,
    actionColumn
  )

  return <TableLayout {...tableInstance} />
}
