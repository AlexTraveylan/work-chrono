export function Footer() {
  const date = new Date()
  const year = date.getFullYear()
  const mouth = date.toLocaleString('fr-fr', { month: 'long' })
  const formatMouth = mouth.charAt(0).toUpperCase() + mouth.slice(1)
  return (
    <footer className="flex flex-row justify-between items-center px-3 h-24">
      <p className="min-w-[20%]">Beta v 0.0.2</p>
      <p>{`${formatMouth} ${year}`}</p>
      <p className="min-w-[20%] text-right">Alex Traveylan</p>
    </footer>
  )
}
