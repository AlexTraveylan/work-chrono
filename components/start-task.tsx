import { ChangeEvent, Dispatch, SetStateAction } from 'react'
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
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
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
          <input
            type="text"
            value={taskName}
            onChange={handleInputChange}
            placeholder="Nom de la tache"
            className="border rounded-md bg-white p-2 shadow-md"
          />
          <div onClick={() => beginWork()}>
            <ButtonApp title="Commencer" />
          </div>
        </div>
      )}
    </>
  )
}
