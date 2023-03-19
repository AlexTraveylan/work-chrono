import BtnAccesIfLogged from '../components/btn-acces-iflogged'
import Layout from '../components/layout'

export default function ServerSidePage() {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-7xl text-center">Work Chrono</h1>
        <BtnAccesIfLogged />
      </div>
    </Layout>
  )
}
