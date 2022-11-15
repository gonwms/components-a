import React, { useEffect, useRef, useState } from 'react';

import style from './style.module.scss';

interface IsProps {
  options: string[]
}

const Select = ({ options }: IsProps) => {
  const [selected, setSelected] = useState('')
  const [visible, setVisible] = useState(false)
  const [selectOptions, setSelectOptions] = useState(options)
  const selector = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selector.current && !selector.current.contains(e.target as Node)) {
        // console.log('CLICK AFUERA')
        setVisible(false)
        setSelectOptions(options)
      }
    }

    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  function handleClick(option: string) {
    setSelected(option)
    setVisible(false)
    setSelectOptions(options)
  }

  function filterOptions(e: React.ChangeEvent<HTMLInputElement>) {
    const filtered = [...options]
    const res = filtered.filter((option) => {
      if (option.indexOf(e.target.value) > -1) {
        return option
      }
    })

    setSelectOptions(res)
  }

  return (
    <>
      <div ref={selector} className={style.select}>
        <input
          type="text"
          placeholder="select"
          value={selected}
          onFocus={() => setVisible(true)}
        />
        {!!visible && (
          <div className={style.options}>
            {selectOptions.map((option) => {
              return (
                <p
                  className={style.option}
                  key={option}
                  onClick={() => handleClick(option)}
                >
                  {option}
                </p>
              )
            })}
            <input type="text" onChange={(e) => filterOptions(e)} />
          </div>
        )}
      </div>
    </>
  )
}

export default Select
