import CSS from 'csstype';
import React, { useEffect, useState } from 'react';

interface IsCategories {
  id: number
  name: string
  sublevels?: IsCategories[]
}

interface IsMenuItemProps {
  cat: IsCategories
  style?: CSS.Properties
}

const TreeMenu1 = () => {
  const [data, setData] = useState<IsCategories[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://components-a.vercel.app/API/categories.json')
        const data = await res.json()

        setData(data.categories)
      } catch (error) {
        error instanceof Error ? console.log(error.message) : console.log(error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <ol>
        {data &&
          data.map((d) => {
            return <MenuItem key={d.id} cat={d} />
          })}
      </ol>
    </>
  )
}

const MenuItem = ({ cat }: IsMenuItemProps) => {
  const [toggle, setToggle] = useState(false)

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault()
    setToggle(!toggle)
  }

  return (
    <>
      <li
        style={{
          color: `${cat.sublevels ? 'black' : 'red'}`,
          cursor: `${cat.sublevels ? 'pointer' : 'initial'}`,
        }}
        key={cat.id}
        onClick={(e) => {
          handleClick(e)
        }}
      >
        {cat.name}
      </li>
      {cat.sublevels && toggle && (
        <ol>
          {cat.sublevels.map((sub) => {
            return <MenuItem key={sub.id} cat={sub} />
          })}
        </ol>
      )}
    </>
  )
}

export default TreeMenu1
