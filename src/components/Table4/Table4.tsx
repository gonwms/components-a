/* eslint-disable no-debugger */
import { debug } from 'console';
import React, { ChangeEvent, useEffect, useState } from 'react';

import style from './style.module.scss';

interface IsTableData {
  [k: string]: any
  id: string
}

interface IsTableComponentProps {
  data: IsTableData[]
}

const Table4 = (): JSX.Element => {
  const [FetchedData, setFetchedData] = useState([])

  useEffect(() => {
    const get = async () => {
      const data = await (
        await fetch(`${process.env.REACT_APP_API_BASE}invoices.json`)
      ).json()

      setFetchedData(data)
    }

    setTimeout(() => {
      get()
    }, 1000)
  }, [])

  return <TableComponent data={FetchedData} />
}

const TableComponent = ({ data }: IsTableComponentProps): JSX.Element => {
  // console.log('RENDER TABLE COMP')

  const [tableData, setTableData] = useState(data)
  const [order, setOrder] = useState('ASC')
  const [checked, setChecked] = useState(new Set())
  const [lastChecked, setLastChecked] = useState('')

  useEffect(() => {
    setTableData(data)
  }, [data])
  useEffect(() => {
    console.log(checked)
  }, [checked])
  function handleClick(heading: string) {
    console.log(heading)

    const sorted = [...tableData].sort((a, b) => {
      return a[heading] > b[heading] ? 1 : -1
    })

    order === 'ASC'
      ? (setTableData(sorted), setOrder('DES'))
      : (setTableData(sorted.reverse()), setOrder('ASC'))
  }

  function handleDelete(id: string) {
    const filtered = [...tableData].filter((row) => row.id !== id)

    setTableData(filtered)
  }
  function handleBulkDelete() {
    const filtered = [...tableData].filter((row) => !checked.has(row.id))

    setTableData(filtered)
  }

  function handleCheck(e: React.MouseEvent<HTMLInputElement>, id: string) {
    setLastChecked(id)
    const tempChecked = new Set([...checked])

    // If Simple Check
    if (e.currentTarget.checked) {
      tempChecked.add(id)
      setLastChecked(id)
    } else {
      tempChecked.delete(id)
    }

    setChecked(tempChecked)

    // If Multi Check (shift + click)
    if (e.shiftKey) {
      const AllIds = [...tableData].reduce(
        (acc: string[], row) => [...acc, row.id],
        [],
      )
      let range: string[] = []
      const firstClick = AllIds.indexOf(lastChecked)
      const secondClick = AllIds.indexOf(id)

      // check the direction of multiselection
      if (firstClick < secondClick) {
        range = AllIds.slice(firstClick, secondClick + 1)
      } else {
        range = AllIds.slice(secondClick, firstClick + 1)
      }

      if (firstClick !== secondClick) {
        // if second click on a checked input => add all the intermediates inputs
        if (tempChecked.has(id)) {
          const finalSet = new Set([...tempChecked, ...range])

          setChecked(finalSet)
        } else {
          // if second click is on an unchecked input => remove all the intermediates inputs
          const finalSet = new Set([...tempChecked])

          range.map((id) => {
            finalSet.delete(id)
          })

          setChecked(finalSet)
        }
      }
    }
  }

  function handleCheckAll(e: ChangeEvent<HTMLInputElement>) {
    const all = tableData.reduce((acc: string[], row) => {
      return [...acc, row.id]
    }, [])

    e.currentTarget.checked ? setChecked(new Set(all)) : setChecked(new Set())
    // console.log(all)
  }

  return (
    <section>
      <h1>Table</h1>
      <div className={style.bulk}>
        <button onClick={handleBulkDelete}>Delect Selected</button>
        <button onClick={() => console.log(checked)}>log selected</button>
        <button onClick={() => console.log(lastChecked)}>last Checked</button>
      </div>
      {!tableData.length && (
        <>
          <h3>No hay datos</h3>
        </>
      )}
      <table className={style.table}>
        <thead>
          <tr>
            {!!tableData.length && (
              <>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleCheckAll}
                    checked={tableData.length === checked.size}
                  />
                </th>
              </>
            )}
            {!!tableData.length && (
              <>
                {Object.keys(tableData[0]).map((key) => {
                  return (
                    <th key={key} onClick={() => handleClick(key)}>
                      {key}
                    </th>
                  )
                })}
                <th>delete</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {!!tableData.length &&
            tableData.map((row) => {
              return (
                <tr key={row.id}>
                  <>
                    <td>
                      <input
                        type="checkbox"
                        checked={checked.has(row.id)}
                        onClick={(e) => handleCheck(e, row.id)}
                        readOnly
                      />
                    </td>
                    {Object.values(row).map((val) => {
                      return <td key={val}>{val}</td>
                    })}
                  </>
                  <td>
                    <button onClick={() => handleDelete(row.id)}>delete</button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </section>
  )
}

export default Table4
