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
import { useTimeslipsQuery } from '../timeslips/timeslipsApiSlice'
import {
  setClaimId,
  setClientId,
  setTimeItems,
  setTimeAmount,
  setHours,
  setExpenseItems,
  setExpenseAmount,
} from './billingSlice'

export function BillableListDetail() {
  const { asOfDate } = useSelector((state) => state.billing)

  const {
    data: timeslips,
    isLoading,
    isSuccess,
  } = useTimeslipsQuery(`lastdate=${asOfDate}&billable=true&billed=false`, {
    refetchOnMountOrArgChange: true,
  })

  const [tableData, setTableData] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      console.log(timeslips)
      setTableData(claimTotals(timeslips))
    }
  }, [isSuccess, timeslips])

  const claimTotals = (timeslips) => {
    let result = []
    return Object.values(
      timeslips.reduce((curr, item) => {
        let claimId = item.claim._id
        let claim = item.claim.name
        if (!curr[claim]) {
          curr[claim] = {
            claimId: claimId,
            claim: claim,
            hours: 0,
            amount: 0,
            expenses: 0,
          }
          result.push(curr[claim])
        }
        curr[claim].hours += item.hours
        curr[claim].amount += item.hours * item.rate
        curr[claim].expenses += item.expenses
        return curr
      }, {})
    )
  }

  const handleCreateInvoice = (id, billableHours) => {
    dispatch(setClaimId(id))
    const extendedTimeItems = timeslips
      .filter((timeslips) => timeslips.claim._id === id)
      .map((item) => ({
        ...item,
        total: Math.round(item.hours * item.rate * 100) / 100,
      }))
    dispatch(setTimeItems(extendedTimeItems))
    const timeAmount = extendedTimeItems.reduce(
      (acc, item) => acc + item.total,
      0
    )
    dispatch(setTimeAmount(timeAmount))
    dispatch(setHours(billableHours))
    navigate('/invoice')
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
        accessor: 'claimId',
        isVisible: false,
      },
      {
        Header: 'Claim',
        accessor: 'claim',
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
              handleCreateInvoice(row.original.claimId, row.original.hours)
            }
          >
            {row.original.claim}
          </span>
        ),
      },
      {
        Header: 'Hours',
        accessor: 'hours',
        Cell: ({ value }) => (
          <div style={{ textAlign: 'right' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value)}
          </div>
        ),
        width: 50,
        minWidth: 50,
        maxWidth: 50,
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ value }) => (
          <div style={{ textAlign: 'right' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value)}
          </div>
        ),
        width: 50,
        minWidth: 50,
        maxWidth: 50,
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
        hiddenColumns: ['claimId'],
        sortBy: [{ id: 'claim', desc: false }],
      },
    },
    useFlexLayout,
    useSortBy,
    usePagination,
    useRowSelect
  )

  return <TableLayout {...tableInstance} />
}
