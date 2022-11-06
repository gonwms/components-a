import { useEffect, useState } from 'react';

interface IsTable {
  defaultCols: string[]
  data: object[] | []
  className: string
}
interface IsTableData {
  id: string
  checked: boolean
  [key: string]: any
}

export const Table = () => {
  const [data, setdata] = useState([{}])

  useEffect(() => {
    const getdata = async () => {
      const res = await fetch('http://localhost:5000/invoice')
      const data = await res.json()

      console.log(data)
      setdata(data)
    }

    getdata()
  }, [])

  return (
    <TableGenerator
      className="dada"
      data={data}
      defaultCols={['id', 'projects', 'client', 'amount']}
    />
  )
}

const TableGenerator = ({ data, className, defaultCols }: IsTable): JSX.Element => {
  const formatData = (data: object[]) => {
    return [...data].map((row) => {
      const { id } = row as IsTableData
      const res: IsTableData = { checked: false, id: id, ...row }

      return res
    })
  }

  const [dataTable, setDataTable] = useState(formatData(data))
  const [visibleCols, setVisibleCols] = useState(defaultCols)

  useEffect(() => {
    setDataTable(formatData(data))
  }, [data])

  const renderTHead = (data: IsTableData[]) => {
    return (
      <tr>
        <th>
          <input type="checkbox" />
        </th>
        {Object.entries(data[0]).map(([k, v]) => {
          if (visibleCols.includes(k)) {
            return <th key={k}>{k}</th>
          }
        })}
      </tr>
    )
  }
  const renderTBody = (data: IsTableData[]) => {
    return data.map((obj) => {
      return (
        <tr key={obj.client}>
          <td>
            <input type="checkbox" />
          </td>
          {Object.entries(obj).map(([k, v]) => {
            if (visibleCols.includes(k)) {
              return <td key={k}>{v}</td>
            }
          })}
        </tr>
      )
    })
  }

  return (
    <table>
      <thead>{renderTHead(dataTable)}</thead>
      <tbody>{renderTBody(dataTable)}</tbody>
    </table>
  )
}

export default Table
