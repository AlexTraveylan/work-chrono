import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      {!session && (
        <>
          <div className="flex flex-row justify-between items-center gap-5 flex-wrap h-24 px-3">
            <Link href="/">
              <svg
                className="cursor-pointer ease-in duration-100 hover:scale-110 "
                width="38px"
                height="38px"
                strokeWidth="1.3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#000000"
              >
                <path
                  d="M9 2h6M12 10v4M12 22a8 8 0 100-16 8 8 0 000 16z"
                  stroke="#000000"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </Link>
            <h3>Connectez-vous</h3>
            <Link
              href={`/api/auth/signin`}
              onClick={(e) => {
                e.preventDefault()
                signIn()
              }}
            >
              <svg
                className="cursor-pointer ease-in duration-100 hover:scale-110"
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
                <path d="m9.75 8.75 3.5 3.25-3.5 3.25"></path>
                <path d="M9.75 4.75h7.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2h-7.5"></path>
                <path d="M13 12H4.75"></path>
              </svg>
            </Link>
          </div>
          <hr />
        </>
      )}
      {session?.user && (
        <>
          <div className="flex flex-row justify-between items-center gap-5 flex-wrap h-24 px-3">
            <Link className="min-w-[20%]" href="/">
              <h3>
                {' '}
                <svg
                  className="cursor-pointer ease-in duration-100 hover:scale-110"
                  width="38px"
                  height="38px"
                  strokeWidth="1.3"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#000000"
                >
                  <path
                    d="M9 2h6M12 10v4M12 22a8 8 0 100-16 8 8 0 000 16z"
                    stroke="#000000"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </h3>
            </Link>
            <div className="hidden flex-col items-center sm:flex">
              <p>Connecté en tant que :</p>
              <p className="font-bold">
                {session.user.name ?? session.user.email}
              </p>
            </div>
            <Link
              className="min-w-[20%] flex justify-end"
              href={`/api/auth/signout`}
              onClick={(e) => {
                e.preventDefault()
                signOut()
              }}
            >
              <svg
                className="cursor-pointer ease-in duration-100 hover:scale-110"
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
                <path d="m15.75 8.75 3.5 3.25-3.5 3.25"></path>
                <path d="M19 12h-8.25"></path>
                <path d="M15.25 4.75h-8.5a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h8.5"></path>
              </svg>
            </Link>
          </div>
          <hr />
        </>
      )}
    </header>
  )
}
