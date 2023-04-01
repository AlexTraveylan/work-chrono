import { useSession } from 'next-auth/react'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'
import { useEffect, useState } from 'react'
import { AddTaskForm } from '../components/AddTaskForm'
import Link from 'next/link'

export type Taches = {
  taches: string[]
}

export default function ProtectedPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<string[] | undefined>()

  async function recupTasks() {
    const response = await fetch(`/api/taches/getTask`)
    if (response.ok) {
      const tasks: Taches = await response.json()
      setTasks(tasks.taches)
    }
  }

  async function deleteTaches(taskToDelete: string) {
    const response = await fetch(`/api/taches/deleteTask`, {
      method: 'POST',
      body: JSON.stringify({ taskToDelete: taskToDelete }),
    })
    if (response.ok) {
      const tasks: Taches = await response.json()
      setTasks(tasks.taches)
    }
  }

  useEffect(() => {
    recupTasks()
  }, [])

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <Link href="/" className="mt-3">
        Retour
      </Link>
      <div>
        {tasks && Array.isArray(tasks) && tasks?.length != 0 ? (
          <>
            <h1 className="text-5xl mb-6 text-center">
              Liste des Tâches ajoutées
            </h1>
            <ul>
              {tasks.map((task) => {
                return (
                  <li
                    key={task}
                    className="flex items-center justify-center gap-3 my-3"
                  >
                    {task}
                    <svg
                      className="text-rose-600 cursor-pointer"
                      onClick={() => deleteTaches(task)}
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m6.75 7.75.841 9.673a2 2 0 0 0 1.993 1.827h4.832a2 2 0 0 0 1.993-1.827l.841-9.673"></path>
                      <path d="M9.75 7.5v-.75a2 2 0 0 1 2-2h.5a2 2 0 0 1 2 2v.75"></path>
                      <path d="M5 7.75h14"></path>
                    </svg>
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <h1>Aucune taches pour le moment</h1>
        )}
        <AddTaskForm setTasks={setTasks} />
      </div>
    </Layout>
  )
}
