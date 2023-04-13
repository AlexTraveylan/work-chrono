import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ResumeWeekIfLogged() {
  const { data: session } = useSession()

  // If session exists, display content
  return (
    <>
      {session && (
        <div className="flex flex-col items-center my-3 justify-between">
          <Link
            className="h-10 text-gray-500 cursor-pointer hover:scale-110 ease-in duration-100"
            href="/week-review/0"
          >
            Voir cette semaine
          </Link>
          <Link
            className="h-10 text-gray-500 cursor-pointer hover:scale-110 ease-in duration-100"
            href="/week-review/1"
          >
            Voir la semaine précédente
          </Link>
          <Link
            className="h-10 text-gray-500 cursor-pointer hover:scale-110 ease-in duration-100"
            href="/review_month"
          >
            Bilans mensuels
          </Link>
          <Link className="h-10" href="/settingtask">
            <svg
              className="hover:scale-110 ease-in duration-100 my-2"
              width="34px"
              height="34px"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#000000"
            >
              <path
                d="M22 14V8.5M6 13V6a3 3 0 013-3h5M16.992 4h3m3 0h-3m0 0V1m0 3v3M12 21H6a4 4 0 010-8h12a4 4 0 104 4v-3"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </Link>
        </div>
      )}
    </>
  )
}
