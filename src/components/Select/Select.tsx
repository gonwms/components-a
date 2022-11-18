import React, { useEffect, useRef, useState } from 'react';

import style from './style.module.scss';

export interface IsProps {
   options: string[]
   title: string
}

const Select = ({ options, title }: IsProps) => {
   const [selected, setSelected] = useState('')
   const [visible, setVisible] = useState(false)
   const [selectOptions, setSelectOptions] = useState(options)
   const selector = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         if (selector.current && !selector.current.contains(e.target as Node)) {
            setVisible(false)
            setSelectOptions(options)
         }
      }

      document.addEventListener('click', handleClickOutside, true)

      return () => {
         document.removeEventListener('click', handleClickOutside, true)
      }
   }, [])

   function handleClick(
      option: string,
      e:
         | React.KeyboardEvent<HTMLAnchorElement>
         | React.MouseEvent<HTMLAnchorElement>,
   ) {
      e.preventDefault()
      setSelected(option)
      setVisible(false)
      setSelectOptions(options)
      if (selector.current && selector.current.firstChild) {
         const target = selector.current.firstChild as HTMLLIElement

         target.focus()
      }
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
         <div data-testid="dropdown" ref={selector} className={style.dd}>
            <div
               className={style.dd_header}
               data-testid="header"
               role="button"
               tabIndex={0}
               onClick={() => setVisible(!visible)}
               onKeyDown={(e) => e.key === 'Enter' && setVisible(!visible)}
            >
               <>
                  <span>{selected ? selected : title}</span>
                  {visible ? (
                     <span className={style.state}>close </span>
                  ) : (
                     <span className={style.state}>open </span>
                  )}
               </>
            </div>
            {!!visible && (
               <div className={style.options} data-testid="options">
                  {selectOptions.map((option) => {
                     return (
                        <a
                           key={option}
                           className={style.option}
                           href=""
                           role="button"
                           onClick={(e) => handleClick(option, e)}
                           onKeyDown={(e) =>
                              e.key === 'Enter' && handleClick(option, e)
                           }
                        >
                           {option}
                        </a>
                     )
                  })}

                  <input
                     type="text"
                     onChange={(e) => filterOptions(e)}
                     tabIndex={0}
                  />
               </div>
            )}
         </div>
      </>
   )
}

export default Select
