import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  useTable,
  useFlexLayout,
  usePagination,
  useRowSelect,
  useSortBy,
} from 'react-table'
import { TableLayout } from '../../components/TableLayout'
import { useBillingsQuery } from './billingsApiSlice'
import { setClaimId, setTimeAmount, setChargeAmount } from './billingSlice'

export function BillableListDetail() {
  const { asOfDate } = useSelector((state) => state.billing)

  const {
    data: billable,
    isLoading,
    isSuccess,
  } = useBillingsQuery(`lastdate=${asOfDate}`, {
    refetchOnMountOrArgChange: true,
  })

  const [tableData, setTableData] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      console.log(billable)
      setTableData(billable)
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
    <TableInstance
      tableData={tableData}
      handleCreateInvoice={handleCreateInvoice}
    />
  )
}

const TableInstance = ({ tableData, handleCreateInvoice }) => {
  const [columns, data] = useMemo(() => {
    const columns = [
      {
        Header: 'claimId',
        accessor: '_id',
        isVisible: false,
      },
      {
        Header: 'Claim',
        accessor: 'claimName',
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        Cell: ({ row }) => (
          <span
            style={{
              cursor: 'pointer',
              color: 'green',
            }}
            onClick={() =>
              handleCreateInvoice(
                row.original._id,
                row.original.billableTime,
                row.original.billableCharges
              )
            }
          >
            {row.original.claimName}
          </span>
        ),
      },
      {
        Header: 'Hours',
        accessor: 'billableHours',
        Cell: ({ value }) => (
          <div style={{ textAlign: 'right' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value)}
          </div>
        ),
        width: 17,
        minWidth: 17,
        maxWidth: 17,
      },
      {
        Header: 'Amount',
        accessor: 'billableTime',
        Cell: ({ value }) => (
          <div style={{ textAlign: 'right' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value)}
          </div>
        ),
        width: 25,
        minWidth: 25,
        maxWidth: 25,
      },
      {
        Header: 'Charges',
        accessor: 'billableCharges',
        Cell: ({ value }) => (
          <div style={{ textAlign: 'right' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value)}
          </div>
        ),
        width: 25,
        minWidth: 25,
        maxWidth: 25,
      },
      {
        Header: 'Total',
        Cell: ({ row }) => (
          <div style={{ textAlign: 'right' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(row.original.billableTime + row.original.billableCharges)}
          </div>
        ),
        width: 25,
        minWidth: 25,
        maxWidth: 25,
      },
    ]
    return [columns, tableData]
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        pageIndex: 0,
        pageSize: 15,
        hiddenColumns: ['_id'],
        sortBy: [{ id: 'claimName', desc: false }],
      },
    },
    useFlexLayout,
    useSortBy,
    usePagination,
    useRowSelect
  )

  return <TableLayout {...tableInstance} />
}
