import { useEffect, useState } from 'react';

import style from './style.module.scss';

interface IsResponse {
  status: string
  data: IsDataTable[]
  error: string | null
}
interface IsTable {
  data: IsDataTable[]
}
interface IsDataTable {
  id: string
  checked: string
  [key: string]: any
}

const Table3 = () => {
  const [data, setData] = useState<IsResponse>({ status: 'idle', data: [], error: null })

  useEffect(() => {
    const getData = async () => {
      try {
        setData({ status: 'pending', data: [], error: null })
        const res = await fetch('http://localhost:3000/API/invoices.json')
        const data = await res.json()

        setData({ status: 'fullfilled', data: data, error: null })
      } catch (error) {
        if (error instanceof Error) {
          setData({ status: 'error', data: [], error: error.message })
        }
      }
    }

    getData()
  }, [])

  return (
    <>
      <p>{data.status}</p>
      {data.status === 'error' && <p>{data.error}</p>}
      <Table data={data.data} />
    </>
  )
}

const Table = ({ data }: IsTable) => {
  const [dataTable, setDataTable] = useState(data)
  const [sorted, setSorted] = useState({ heading: '', order: 'asc' })

  useEffect(() => {
    setDataTable(data)
  }, [data])
  function sortColumn(th: string) {
    const res = [...dataTable].sort((a, b) => {
      if (sorted.order === 'asc') {
        setSorted({ heading: th, order: 'des' })

        return a[th] > b[th] ? 1 : -1
      } else {
        setSorted({ heading: th, order: 'asc' })

        return a[th] < b[th] ? 1 : -1
      }
    })

    setDataTable(res)
  }

  return (
    <>
      <table className={style.mytable}>
        <thead>
          <tr>
            {!!dataTable.length &&
              Object.keys(dataTable[0]).map((k) => {
                return (
                  <th
                    key={k}
                    onClick={() => sortColumn(k)}
                    className={sorted.heading === k ? `${style[`sort_${sorted.order}`]}` : ''}
                    // className={sorted.heading === k ? `${style.mytable}.sort_${sorted.order}` : ''}
                  >
                    {k}
                  </th>
                )
              })}
          </tr>
        </thead>
        <tbody>
          {!!dataTable.length &&
            dataTable.map((row) => {
              return (
                <tr key={row.id}>
                  {Object.entries(row).map(([k, v]) => {
                    return <td key={k}>{v}</td>
                  })}
                </tr>
              )
            })}
        </tbody>
      </table>
    </>
  )
}

export default Table3
