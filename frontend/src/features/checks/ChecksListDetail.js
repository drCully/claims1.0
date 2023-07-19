import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import {
  useTable,
  useFlexLayout,
  usePagination,
  useRowSelect,
  useSortBy,
} from 'react-table'
import { TableLayout } from '../../components/TableLayout'
import { useChecksQuery, useDeleteCheckMutation } from './checksApiSlice'

export function ChecksListDetail({ searchCheck }) {
  const { data: checks, isLoading } = useChecksQuery(`name=${searchCheck}`, {
    refetchOnMountOrArgChange: true,
  })

  const [tableData, setTableData] = useState(null)
  const [deleteCheck] = useDeleteCheckMutation()

  useEffect(() => {
    setTableData(checks)
  }, [checks])

  if (isLoading || !tableData) {
    return <div>Loading...</div>
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this check? ')) {
      await deleteCheck(id)
      toast.success('Check Deleted Successfully')
    }
  }

  return <TableInstance tableData={tableData} handleDelete={handleDelete} />
}

const TableInstance = ({ tableData, handleDelete }) => {
  const [columns, data] = useMemo(() => {
    const columns = [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => (
          <div style={{ textAlign: 'center' }}>
            {format(parseISO(value), 'MM/dd/yyyy')}
          </div>
        ),
        width: 40,
        minWidth: 40,
        maxWidth: 40,
      },
      {
        Header: 'Number',
        accessor: 'number',
        width: 25,
        minWidth: 25,
        maxWidth: 30,
      },
      {
        Header: 'Payee',
        accessor: 'payee.name',
        width: 100,
        minWidth: 100,
        maxWidth: 100,
      },
      {
        Header: 'Claim',
        accessor: 'claim.name',
        width: 100,
        minWidth: 100,
        maxWidth: 100,
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ value }) => (
          <div style={{ textAlign: 'right' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
            }).format(value)}
          </div>
        ),
        width: 40,
        minWidth: 40,
        maxWidth: 40,
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
        Header: 'Action',
        minWidth: 25,
        width: 25,
        maxWidth: 30,
        align: 'center',
        Cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Link to={`/checks/${row.original._id}`}>
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
              onClick={() => handleDelete(row.original._id)}
            />
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
