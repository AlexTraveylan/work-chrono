import { ReactNode } from 'react'
import style from './button.module.css'

export function ButtonApp({ children }: { children: ReactNode }) {
  return (
    <>
      <button className={style.btn_app}>{children}</button>
    </>
  )
}
