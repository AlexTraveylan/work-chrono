import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { ButtonApp } from './shared/buttonApp'
import { Taches } from '../pages/settingtask'
import Link from 'next/link'

export function StartTask({
  taskTimer,
  setTaskTimer,
  taskName,
  setTaskName,
}: {
  taskTimer: number | undefined
  taskName: string
  setTaskTimer: Dispatch<SetStateAction<number | undefined>>
  setTaskName: Dispatch<SetStateAction<string>>
}) {
  const [taches, setTaches] = useState<string[]>([])

  async function recupTaches() {
    const response = await fetch(`/api/taches/getTask`)
    if (response.ok) {
      const taches: Taches = await response.json()
      setTaches(taches.taches)
      if (taches.taches.length > 0) {
        setTaskName(taches.taches[0])
      }
    }
  }

  useEffect(() => {
    recupTaches()
  }, [])

  function handleInputChange(event: ChangeEvent<HTMLSelectElement>) {
    setTaskName(event.target.value)
  }

  async function beginWork() {
    const response = await fetch(`/api/work/tasks`, {
      method: 'POST',
      body: JSON.stringify({ taskName }),
    })

    const data = await response.json()
    const startedAt = new Date(data.startedAt).getTime()

    setTaskTimer(startedAt)
  }

  async function cancelTask() {
    const response = await fetch(`/api/work/cancelTasks`)

    if (response.ok) {
      setTaskTimer(undefined)
    }
  }

  async function saveTask() {
    const response = await fetch(`/api/work/saveTask`)

    if (response.ok) {
      setTaskTimer(undefined)
    }
  }

  return (
    <>
      {taskTimer ? (
        <div className="flex flex-row gap-3 p-3">
          <div onClick={() => cancelTask()}>
            <ButtonApp title="Annuler la tâche" />
          </div>
          <div onClick={() => saveTask()}>
            <ButtonApp title="Terminer la tâche" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center shadow-md rounded p-3 border-1">
          <h3 className="font-bold">Commencer une nouvelle tache :</h3>
          <div className="flex flex-row items-center gap-3">
            <select
              value={taskName}
              onChange={handleInputChange}
              className="border rounded-md bg-white p-2 shadow-md"
            >
              {taches.map((tache) => (
                <option key={tache} value={tache}>
                  {tache}
                </option>
              ))}
            </select>
            <Link href="settingtask">
              <svg
                className="cursor-pointer"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 6.75H7.75a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H15"></path>
                <path d="M14 8.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1Z"></path>
                <path d="M9.75 12.25h4.5"></path>
                <path d="M9.75 15.25h4.5"></path>
              </svg>
            </Link>
          </div>
          <div onClick={() => beginWork()}>
            <ButtonApp title="Commencer" />
          </div>
        </div>
      )}
    </>
  )
}
