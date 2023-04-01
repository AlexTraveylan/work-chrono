import Link from 'next/link'
import BtnAccesIfLogged from '../components/btn-acces-iflogged'
import Layout from '../components/layout'
import { ButtonApp } from '../components/shared/buttonApp'
import { useState } from 'react'

export default function ServerSidePage() {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-7xl text-center">Work Chrono</h1>
        <BtnAccesIfLogged />
        <Link href="/settingtask">
          <ButtonApp title="Settings tâches" />
        </Link>
        <div className="flex flex-col gap-3 items-center my-3 text-center">
          <Link href="/week-review">Résumé de la semaine</Link>
          <Link href="/previous-week-review">
            Résumé de la semaine précédente
          </Link>
        </div>
      </div>
    </Layout>
  )
}
