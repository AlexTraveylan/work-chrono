import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ButtonApp } from './shared/buttonApp'
import Link from 'next/link'
import { Description } from './description'

export default function BtnAccesIfLogged() {
  const { data: session } = useSession()

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/examples/protected')
      const json = await res.json()
      //   if (json.content) {
      //     setContent(json.content)
      //   }
    }
    fetchData()
  }, [session])

  // If no session exists, display access denied message
  if (!session) {
    return (
      <>
        <Description />
      </>
    )
  }

  // If session exists, display content
  return (
    <Link href="/protected">
      <ButtonApp title="Entrer" />
    </Link>
  )
}
