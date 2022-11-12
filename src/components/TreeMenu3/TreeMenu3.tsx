import { default as cl } from 'classnames';
import React, { useEffect, useState } from 'react';

import style from './style.module.scss';

interface IsCategories {
  id: number
  name: string
  sublevels?: IsCategories[]
}
interface IsProduct {
  quantity: number
  price: string
  available: string
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

type IsElements = HTMLFormControlsCollection & {
  min_quantity: HTMLInputElement
  max_quantity: HTMLInputElement
  min_price: HTMLInputElement
  max_price: HTMLInputElement
  available: HTMLSelectElement
}
interface IsValues {
  min_price: string
  max_price: string
  min_quantity: string
  max_quantity: string
  available: string
}

interface IsFilterFormElements extends HTMLFormElement {
  readonly elements: IsElements
}

const TreeMenu3 = (): JSX.Element => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState<IsProduct[]>([])
  const [currentProducts, setCurrentProducts] = useState(products)
  const [active, setActive] = useState<IsActive>({ name: 'all', id: 0 })

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

  useEffect(() => {
    setCurrentProducts(products)
  }, [products])

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

  function handleSubmit(e: React.FormEvent<IsFilterFormElements>) {
    e.preventDefault()
    const elements = [...e.currentTarget.elements]
    const values: IsValues = elements.reduce((acc: any, el: Element) => {
      return el instanceof HTMLInputElement || el instanceof HTMLSelectElement
        ? { ...acc, [el.name]: el.value }
        : acc
    }, {})

    let filtered = [...products]

    filtered = filtered.filter((product) => {
      if (
        (values.min_price === '' ||
          +values.min_price < priceToNum(product.price)) &&
        (values.max_price === '' ||
          +values.max_price > priceToNum(product.price)) &&
        (values.min_quantity === '' ||
          +values.min_quantity < product.quantity) &&
        (values.max_quantity === '' ||
          +values.max_quantity > product.quantity) &&
        (values.available === 'all' ||
          product.available.toString() === values.available)
      )
        return product
    })
    setCurrentProducts(filtered)
  }
  function handleReset() {
    setCurrentProducts(products)
  }

  return (
    <section>
      {categories && (
        <Menu categories={categories} setActive={setActive} active={active} />
      )}
      <div>
        <h3>Selected category {active.name}</h3>

        <div className={style.filters}>
          {/* //----------------------------- FORM ------------------------ */}
          <form onSubmit={handleSubmit}>
            <label htmlFor="quantity">
              <span>Quantity</span>
              <div>
                <input name="min_quantity" type="number" placeholder="min" />
                <input name="max_quantity" type="number" placeholder="max" />
              </div>
            </label>
            <label htmlFor="price">
              <span>Price</span>
              <div>
                <input name="min_price" type="number" placeholder="min" />
                <input name="max_price" type="number" placeholder="max" />
              </div>
            </label>
            <label htmlFor="available">
              <span>Available</span>
              <select id="available" name="available">
                <option value="all">all</option>
                <option value="true">in stock</option>
                <option value="false">sold</option>
              </select>
            </label>
            <button type="submit">Aplicar filtros</button>
            <button type="reset" onClick={handleReset}>
              Reset filters
            </button>
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
          {currentProducts &&
            currentProducts.map((product: IsProduct) => {
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
                        <small>quantity:{product.quantity}</small>
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
    </section>
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

const Item = ({ level, handlerClick, visible, active }: IsItemProps) => {
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
