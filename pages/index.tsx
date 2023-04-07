import { useSession } from 'next-auth/react'
import BtnAccesIfLogged from '../components/btn-acces-iflogged'
import Layout from '../components/layout'
import ResumeWeekIfLogged from '../components/resume-week-link-iflogged'
import { Loader } from '../components/shared/loader'

export default function ServerSidePage() {
  const { status } = useSession()

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-7xl text-center">Work Chrono</h1>
        {status === 'loading' && <Loader show={true} />}
        <BtnAccesIfLogged />
        <ResumeWeekIfLogged />
      </div>
    </Layout>
  )
}
