import { useMemo } from 'react'
import { useTable, useFlexLayout, useSortBy } from 'react-table'
import { addHours, format, parseISO } from 'date-fns'
import { STablePrint } from '../../styles/tableStyles'

import { useTimeslipsQuery } from './timeslipsApiSlice'

const headerProps = (props, { column }) => getStyles(props, column.align)
const getStyles = (props, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]

function Table({ columns, data }) {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 200,
    }),
    []
  )
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
        initialState: {
          sortBy: [{ id: 'date', desc: false }],
        },
      },
      useFlexLayout,
      useSortBy
    )
  return (
    <>
      <STablePrint>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(headerProps)}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </STablePrint>
    </>
  )
}

export function TimesheetDetail({ timeslips }) {
  //define columns
  const columns = [
    {
      Header: 'Claim',
      accessor: 'claim.name',
      width: 160,
      wrapText: true,
      autoHeight: true,
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
      width: 35,
    },
    {
      Header: 'Description',
      accessor: 'description',
      width: 250,
      maxWidth: 350,
      wrapText: true,
      autoHeight: true,
    },
  ]
  return <Table columns={columns} data={timeslips} />
}
