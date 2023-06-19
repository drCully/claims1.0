import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaCheck,
  FaTimes,
  FaRegEdit,
  FaRegTrashAlt,
  FaDollarSign,
} from 'react-icons/fa'
import {
  useTable,
  useFlexLayout,
  usePagination,
  useRowSelect,
  useSortBy,
} from 'react-table'
import { TableLayout } from '../../components/TableLayout'
import { usePayeesQuery, useDeletePayeeMutation } from './payeesApiSlice'

export function PayeesListDetail({ searchPayee, activeStatus }) {
  const { data: payees, isLoading } = usePayeesQuery(
    `name=${searchPayee}&isActive=${activeStatus}`,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [tableData, setTableData] = useState(null)
  const [deletePayee] = useDeletePayeeMutation()

  useEffect(() => {
    setTableData(payees)
  }, [payees])

  if (isLoading || !tableData) {
    return <div>Loading...</div>
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payee? ')) {
      await deletePayee(id)
      toast.success('User Deleted Successfully')
    }
  }

  return <TableInstance tableData={tableData} handleDelete={handleDelete} />
}

const TableInstance = ({ tableData, handleDelete }) => {
  const [columns, data] = useMemo(() => {
    const columns = [
      {
        Header: 'Name',
        accessor: 'name',
        width: 90,
        minWidth: 90,
        maxWidth: 90,
      },
      {
        Header: 'Address Line 1',
        accessor: 'addr1',
        width: 80,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        Header: 'Address Line 2',
        accessor: 'addr2',
        width: 80,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        Header: 'Address Line 3',
        accessor: 'addr3',
        width: 80,
        minWidth: 80,
        maxWidth: 80,
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
        Header: 'Action',
        minWidth: 30,
        width: 30,
        maxWidth: 30,
        align: 'center',
        Cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Link to={`/payees/${row.original._id}`}>
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
            <FaDollarSign
              style={{
                cursor: 'pointer',
                color: 'OrangeRed',
                marginLeft: '.7em',
              }}
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
