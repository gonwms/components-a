import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from 'utils/formatCurrency';

interface IsDataTable {
  [key: string]: any
}
interface isTable {
  data: IsDataTable[]
  defaultCols: string[]
}

const Table2 = (): JSX.Element => {
  const [fetchedData, setFetchedData] = useState([])

  useEffect(() => {
    const getdata = async () => {
      const res = await fetch('http://localhost:5000/invoice')
      const data = await res.json()

      setFetchedData(data)
      console.log(data)
    }

    getdata()
  }, [])

  return (
    <Table data={fetchedData} defaultCols={['projects', 'client', 'status', 'date', 'amount']} />
  )
}

const Table = ({ data, defaultCols }: isTable): JSX.Element => {
  const [visibleCols, setVisibleCols] = useState(defaultCols)
  const [tableData, setTableData] = useState(data)
  const [order, setOrder] = useState('ASC')
  const headingRef = useRef<HTMLTableHeaderCellElement | null>(null)

  useEffect(() => {
    setTableData(data)
  }, [data])

  useEffect(() => {
    console.log(headingRef.current)
  }, [headingRef])

  function sort(heading: string) {
    const res = [...tableData].sort((a, b) => {
      if (order === 'ASC') {
        setOrder('DES')
        if (a[heading] >= b[heading]) return -1
        else return 1
      }
      if (order === 'DES') {
        setOrder('ASC')
        if (a[heading] <= b[heading]) return -1
        else return 1
      } else return 0
    })

    setTableData(res)
  }

  return (
    <table>
      <thead>
        <tr>
          <th>
            <input type="checkbox" />
          </th>
          {tableData &&
            tableData.length > 0 &&
            Object.keys(tableData[0]).map((k) => {
              return (
                visibleCols.includes(k) && (
                  <th key={k} onClick={() => sort(k)}>
                    {k}
                  </th>
                )
              )
            })}
        </tr>
      </thead>

      <tbody>
        {!!tableData &&
          tableData.length > 0 &&
          tableData.map((row) => {
            return (
              <tr key={row.id}>
                <td>
                  <input type="checkbox" />
                </td>
                {Object.entries(row).map(([k, v]) => {
                  return (
                    visibleCols.includes(k) &&
                    (k === 'amount' ? <td key={v}>{formatCurrency(v)}</td> : <td key={v}>{v}</td>)
                  )
                })}
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}

export default Table2
