import Link from 'next/link'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { Taches } from '../pages/settingtask'
import { ButtonApp } from './shared/buttonApp'

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
      if (taskName === '' && taches.taches.length > 0) {
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

    if (response.ok) {
      const data = await response.json()
      const startedAt = new Date(data.startedAt).getTime()
      setTaskTimer(startedAt)
    }
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
        <div className="flex flex-col items-center gap-3">
          <div onClick={() => saveTask()}>
            <ButtonApp>
              <span>Terminer la tâche</span>
            </ButtonApp>
          </div>
          <div onClick={() => cancelTask()}>
            <ButtonApp>
              <span className="text-red-800">Annuler la tâche</span>
            </ButtonApp>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center p-3">
          <h3 className="font-semibold">Commencer une nouvelle tache :</h3>
          <div className="flex flex-row items-center gap-3">
            <select
              value={taskName}
              onChange={handleInputChange}
              className="border rounded-md bg-white p-4 text-center m-2 mb-3 shadow-md hover:border-blue-700"
            >
              {taches.map((tache) => (
                <option key={tache} value={tache}>
                  {tache}
                </option>
              ))}
            </select>
          </div>
          <div onClick={() => beginWork()}>
            <ButtonApp>C'est parti !</ButtonApp>
          </div>
          <Link href="settingtask">
            <svg
              className="hover:scale-110 ease-in duration-100 my-2"
              width="30px"
              height="30px"
              strokeWidth="1.3"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#000000"
            >
              <path
                d="M22 14V8.5M6 13V6a3 3 0 013-3h5M16.992 4h3m3 0h-3m0 0V1m0 3v3M12 21H6a4 4 0 010-8h12a4 4 0 104 4v-3"
                stroke="#000000"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </Link>
        </div>
      )}
    </>
  )
}
