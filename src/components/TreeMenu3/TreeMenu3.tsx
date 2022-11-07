import { default as cl } from 'classnames';
import React, { useEffect, useState } from 'react';

import App from '../../../../../../01_Clientes/Devoo/Proyectos/invoo/client/src/App';
import style from './style.module.scss';

interface IsCategories {
  id: number
  name: string
  sublevels?: IsCategories[]
}
interface IsProduct {
  quantity: number
  price: string
  available: boolean
  sublevel_id: number
  name: string
  id: string
}

interface IsMenuProps {
  categories: IsCategories[]
  setActive: React.Dispatch<React.SetStateAction<IsActive>>
  active: IsActive
}
interface IsActive {
  id: number
  name: string
}

interface IsItemProps {
  level: IsCategories
  handlerClick: (id: number, name: string) => void
  visible: string[]
  active: IsActive
}
interface IsFormData {
  min_quantity: string
  max_quantity: string
  min_price: string
  max_price: string
  available: 'all' | 'no-stock' | 'stock'
}
const TreeMenu3 = (): JSX.Element => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState<IsProduct[]>([])
  const [active, setActive] = useState<IsActive>({ name: 'all', id: 0 })
  const [formData, setFormData] = useState<IsFormData>({
    min_quantity: '0',
    max_quantity: '',
    min_price: '0',
    max_price: '',
    available: 'all',
  })

  useEffect(() => {
    const ApiFetch = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}categories.json`,
      )
      const data = await res.json()

      setCategories(data.categories)
    }

    ApiFetch()
  }, [])
  useEffect(() => {
    const ApiFetch = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}products.json`)
      const data = await res.json()

      setProducts(data.products)
    }

    ApiFetch()
  }, [])
  const priceToNum = (price: string): number => {
    return +price.replace(/[$]+/g, '').replace(/[,]+/g, '')
  }

  function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
    const by = e.target.value

    const sorted = [...products].sort((a: IsProduct, b: IsProduct) => {
      if (by === 'quantity') {
        return a.quantity > b.quantity ? 1 : -1
      }
      if (by === 'price') {
        return priceToNum(a.price) > priceToNum(b.price) ? 1 : -1
      }
      if (by === 'available') {
        return a.available > b.available ? 1 : -1
      } else return 0
    })

    setProducts(sorted)
  }

  // function filter(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   const coso = e.target.elements as HTMLFormControlsCollection
  //   // const cisi = coso.max_price.value

  //   console.log(e)
  // }

  function filter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    let filtered = [...products]

    filtered = filtered.filter((prod) => {
      if (priceToNum(prod.price) > +formData.min_price) return prod
    })
    filtered = filtered.filter((prod) => {
      if (
        formData.max_price === '' ||
        priceToNum(prod.price) < +formData.max_price
      )
        return prod
    })

    console.log(filtered)
  }

  function HandleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    // console.log(formData)

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '15% 80%' }}>
      {categories && (
        <Menu categories={categories} setActive={setActive} active={active} />
      )}
      <div>
        <h3>Selected category {active.name}</h3>

        <div className={style.filters}>
          {/* //----------------------------- FORM ------------------------ */}
          <form onSubmit={(e) => filter(e)}>
            <label htmlFor="quantity">
              <span>Quantity</span>
              <div>
                <input
                  id="min_quantity"
                  name="min_quantity"
                  type="number"
                  placeholder="min"
                  onChange={(e) => HandleChange(e)}
                />
                <input
                  id="max_quantity"
                  name="max_quantity"
                  type="number"
                  placeholder="max"
                  onChange={(e) => HandleChange(e)}
                />
              </div>
            </label>
            <label htmlFor="price">
              <span>Price</span>
              <div>
                <input
                  id="min_price"
                  name="min_price"
                  type="number"
                  placeholder="min"
                  onChange={(e) => HandleChange(e)}
                />
                <input
                  id="max_price"
                  name="max_price"
                  type="number"
                  placeholder="max"
                  onChange={(e) => HandleChange(e)}
                />
              </div>
            </label>
            <label htmlFor="available">
              <span>Available</span>
              <select
                id="available"
                name="available"
                onChange={(e) => HandleChange(e)}
              >
                <option value="all">all</option>
                <option value="stock">in stock</option>
                <option value="no-stock">sold</option>
              </select>
            </label>
            <button type="submit">Aplicar filtros</button>
            <button type="reset">Reset filters</button>
          </form>
          {/* //----------------------------- FORM ------------------------ */}
        </div>
        <div className={style.sort}>
          <label htmlFor="sort">
            <span>Ordenar</span>
            <select name="sort" id="sort" onChange={(e) => handleSort(e)}>
              <option value="quantity">Quantity</option>
              <option value="price">Price</option>
              <option value="available">Available</option>
            </select>
          </label>
        </div>
        <div className={style.grilla}>
          {products &&
            products.map((product: IsProduct) => {
              return (
                <>
                  {(active.id === product.sublevel_id || active.id === 0) && (
                    <div key={product.id} className={style.card}>
                      <p>
                        <small>lvl:{product.sublevel_id}</small>
                        <br />
                        <strong>{product.name} </strong>
                      </p>
                      <p>
                        <small>{product.price}</small> <br />
                        <small>qty:{product.quantity}</small>
                        <br />
                        <small>{product.available.toString()}</small>
                      </p>
                    </div>
                  )}
                </>
              )
            })}
        </div>
      </div>
    </div>
  )
}

const Menu = ({ categories, setActive, active }: IsMenuProps): JSX.Element => {
  const [visible, setVisible] = useState([''])

  function handlerClick(id = 0, name = 'all') {
    console.log(id, name)
    setActive({ id, name })
    if (visible.includes(name)) {
      const res = [...visible]

      res.splice(visible.indexOf(name), 1)
      setVisible(res)
    } else {
      setVisible([...visible, name])
    }
  }

  return (
    <ul className={style.menu}>
      <li>
        <span
          onClick={() => handlerClick()}
          className={cl({ [`${style.bold}`]: active.id === 0 })}
        >
          All
        </span>
      </li>
      {categories.map((level) => {
        return (
          <Item
            key={level.id}
            level={level}
            handlerClick={handlerClick}
            visible={visible}
            active={active}
          />
        )
      })}
    </ul>
  )
}

const Item = ({
  level,
  handlerClick,
  visible,
  active,
}: IsItemProps): JSX.Element => {
  return (
    <li>
      <span
        onClick={() => handlerClick(level.id, level.name)}
        className={cl({ [`${style.bold}`]: active.id === level.id })}
      >
        {level.name}
      </span>
      {level.sublevels && visible.includes(level.name) && (
        <ul className={style.menu}>
          {level.sublevels.map((lev) => {
            return (
              <Item
                key={lev.id}
                level={lev}
                handlerClick={handlerClick}
                visible={visible}
                active={active}
              />
            )
          })}
        </ul>
      )}
    </li>
  )
}

export default TreeMenu3
