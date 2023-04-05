import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ResumeWeekIfLogged() {
  const { data: session } = useSession()

  // If session exists, display content
  return (
    <>
      {session && (
        <div className="flex flex-col gap-3 items-center my-3 text-center">
          <Link href="/week-review">Résumé de la semaine</Link>
          <Link href="/previous-week-review">
            Résumé de la semaine précédente
          </Link>
          <Link href="/settingtask">
            <svg
              width="40"
              height="40"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.3"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 6.75H7.75a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H15"></path>
              <path d="M14 8.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1Z"></path>
              <path d="M9.75 12.25h4.5"></path>
              <path d="M9.75 15.25h4.5"></path>
            </svg>
          </Link>
        </div>
      )}
    </>
  )
}