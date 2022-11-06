import React, { useEffect, useState } from 'react';

interface IsCategories {
  id: number
  name: string
  sublevels?: IsCategories[]
  visible: boolean
}
interface IsMenuProps {
  data: IsCategories[]
}

const TreeMenu2 = (): JSX.Element => {
  const [data, setData] = useState<IsCategories[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://components-a.vercel.app/API/categories.json')
      const data = await res.json()

      // console.log(data)

      setData(data.categories)
    }

    fetchData()
  }, [])

  return <>{data.length > 0 && <Menu data={data} />}</>
}

export const Menu = ({ data }: IsMenuProps): JSX.Element => {
  const [visibles, setVisibles] = useState<string[]>([])

  useEffect(() => {
    console.log(visibles)
  }, [visibles])

  function handleClick(name: string) {
    if (!visibles.includes(name)) {
      setVisibles([...visibles, name])
    } else {
      const res = [...visibles]

      res.splice(visibles.indexOf(name), 1)
      setVisibles(res)
    }
  }

  function itemLoop(categorie: IsCategories[]) {
    return (
      <>
        {categorie.map((cat) => {
          return (
            <li key={cat.id}>
              <span
                style={{
                  cursor: `${cat.sublevels ? 'pointer' : 'initial'}`,
                  color: `${cat.sublevels ? 'black' : 'red'} `,
                }}
                onClick={() => handleClick(cat.name)}
              >
                {cat.name}
              </span>
              {visibles.includes(cat.name) && cat.sublevels && <ol>{itemLoop(cat.sublevels)}</ol>}
            </li>
          )
        })}
      </>
    )
  }

  return <ol>{itemLoop(data)}</ol>
}

export default TreeMenu2
