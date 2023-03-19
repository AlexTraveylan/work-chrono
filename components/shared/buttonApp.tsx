export function ButtonApp({ title }: { title: string }) {
  return (
    <>
      <button className="bg-slate-200 shadow-md px-4 py-2 rounded-lg transition ease-in-out duration-75 hover:bg-slate-400 hover:scale-110 active:bg-indigo-600 active:shadow-inner">
        {title}
      </button>
    </>
  )
}
