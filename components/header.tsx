import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { ButtonApp } from './shared/buttonApp'

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
        <div className="flex flex-row justify-between items-center gap-5 flex-wrap h-24 bg-gray-200 px-3">
          <Link href="/">
            <h3>Logo</h3>
          </Link>
          <h3>You are not signed in</h3>
          <Link
            href={`/api/auth/signin`}
            onClick={(e) => {
              e.preventDefault()
              signIn()
            }}
          >
            <ButtonApp title="Se connecter" />
          </Link>
        </div>
      )}
      {session?.user && (
        <>
          <div className="flex flex-row justify-between items-center gap-5 flex-wrap h-24 bg-gray-200 px-3">
            <Link className="min-w-[20%]" href="/">
              <h3>Logo</h3>
            </Link>
            <div className="hidden flex-col items-center sm:flex">
              <p>Connecté en tant que :</p>
              <p className="font-bold">
                {session.user.name ?? session.user.email}
              </p>
            </div>
            <Link
              className="min-w-[20%] text-end"
              href={`/api/auth/signout`}
              onClick={(e) => {
                e.preventDefault()
                signOut()
              }}
            >
              <ButtonApp title="Se déconnecter" />
            </Link>
          </div>
        </>
      )}
    </header>
  )
}
