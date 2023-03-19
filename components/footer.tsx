export function Footer() {
  const date = new Date()
  const year = date.getFullYear()
  const mouth = date.getMonth()
  return (
    <footer className="flex flex-row justify-between items-center px-3 h-24">
      <p className="min-w-[20%]">Beta v 0.0.1</p>
      <p>{`${mouth + 1}/${year}`}</p>
      <p className="min-w-[20%] text-right">Alex Traveylan</p>
    </footer>
  )
}
