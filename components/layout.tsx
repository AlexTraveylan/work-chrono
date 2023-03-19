import Header from './header'
import { Footer } from './footer'
import type { ReactNode } from 'react'
import styles from './home.module.css'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}
