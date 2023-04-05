import styles from './loader.module.css'

export function Loader({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
    </div>
  )
}
