import Link from 'next/link'

export function ReturnButton({ path }: { path: string }) {
  return (
    <Link href={path} className="my-3">
      <div className="flex items-center gap-3">
        <svg
          width="32"
          height="32"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.25 6.75 4.75 12l5.5 5.25"></path>
          <path d="M19.25 12H5"></path>
        </svg>
        <h5>Retour accueil</h5>
      </div>
    </Link>
  )
}
