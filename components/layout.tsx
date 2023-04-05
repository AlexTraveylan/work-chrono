import { ReactNode } from 'react'
import { Footer } from './footer'
import Header from './header'
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
