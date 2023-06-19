import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { FaRegEdit } from 'react-icons/fa'
import { useTable, useFlexLayout, usePagination, useSortBy } from 'react-table'
import { TableLayout } from '../../../components/TableLayout'
import { s } from '../../../styles/variables'
import { SCard, SCardFull } from '../../../styles/cardStyles'
import { SSelect } from '../../../styles/formStyles'
import { useTimeslipsQuery } from '../../timeslips/timeslipsApiSlice'
import {
  SFixedContainer,
  SFlexContainer,
  SFlexRow,
} from '../../../styles/containerStyles'

export function ClaimHours(claim) {
  const [billingStatus, setBillingStatus] = useState(false)
  const onChangeBillingStatus = (event) => {
    const billingStatus = event.target.value
    setBillingStatus(billingStatus)
  }

  const { data: timeslips, isLoading } = useTimeslipsQuery(
    `claim=${claim.id}&billed=${billingStatus}`,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <SCardFull>
      <SFixedContainer minwidth={`${s.lg}`}>
        <SFlexRow>
          <h2>Time Transactions</h2>
          <SSelect
            onChange={(event) => {
              onChangeBillingStatus(event)
            }}
            width='10rem'
            style={{ marginLeft: 'auto' }}
          >
            <option value='false'>Show Unbilled</option>
            <option value='true'>Show Billed</option>
            <option value=''>Show All</option>
          </SSelect>
        </SFlexRow>
        <TableInstance tableData={timeslips} billingStatus={billingStatus} />
      </SFixedContainer>
    </SCardFull>
  )
}

const TableInstance = ({ tableData }) => {
  const [columns, data] = useMemo(() => {
    const columns = [
      {
        Header: 'Date',
        accessor: 'date',
        align: 'right',
        Cell: ({ value }) => {
          return format(parseISO(value), 'MM/dd/yyyy')
        },
        width: 50,
        minWidth: 50,
        maxWidth: 50,
      },
      {
        accessor: 'timekeeper.initials',
        width: 25,
        minWidth: 25,
        maxWidth: 25,
      },
      {
        Header: 'Hours',
        accessor: 'hours',
        Cell: ({ value }) => (
          <div style={{ textAlign: 'center' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
            }).format(value)}
          </div>
        ),
        width: 30,
        minWidth: 30,
        maxWidth: 30,
      },
      {
        Header: 'Description',
        accessor: 'description',
        width: 225,
        minWidth: 150,
        maxWidth: 250,
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
        minWidth: 35,
        width: 35,
        maxWidth: 35,
        align: 'center',
        Cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Link to={`/timeslip/${row.original._id}`}>
              <FaRegEdit
                style={{
                  color: 'green',
                  marginRight: '.7em',
                }}
              />
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
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFlexLayout,
    useSortBy,
    usePagination,
    actionColumn
  )

  return <TableLayout {...tableInstance} />
}
