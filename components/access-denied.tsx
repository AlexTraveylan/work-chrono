import { signIn } from "next-auth/react"

export default function AccessDenied() {
  return (
    <>
      <h1>Acces Refusé</h1>
      <p>
        <a
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault()
            signIn()
          }}
        >
          Vous devez être connecté pour acceder à cette page.
        </a>
      </p>
    </>
  )
}
