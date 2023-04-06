import { signIn } from 'next-auth/react'

export default function AccessDenied() {
  return (
    <div>
      <h1 className="text-center">Acces Refusé</h1>
      <a
        className="flex flex-col items-center"
        href="/api/auth/signin"
        onClick={(e) => {
          e.preventDefault()
          signIn()
        }}
      >
        <svg
          width="46"
          height="46"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.75 11.75a1 1 0 0 1 1-1h10.5a1 1 0 0 1 1 1v5.5a2 2 0 0 1-2 2h-8.5a2 2 0 0 1-2-2v-5.5Z"></path>
          <path d="M7.75 10.5v-.157c0-1.562-.094-3.302.996-4.42C9.368 5.288 10.374 4.75 12 4.75c1.626 0 2.632.537 3.254 1.174 1.09 1.117.996 2.857.996 4.419v.157"></path>
        </svg>
        Vous devez être connecté pour acceder à cette page.
      </a>
    </div>
  )
}
