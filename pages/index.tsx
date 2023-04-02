import BtnAccesIfLogged from '../components/btn-acces-iflogged'
import Layout from '../components/layout'
import ResumeWeekIfLogged from '../components/resume-week-link-iflogged'

export default function ServerSidePage() {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-7xl text-center">Work Chrono</h1>
        <BtnAccesIfLogged />
        <ResumeWeekIfLogged />
      </div>
    </Layout>
  )
}
