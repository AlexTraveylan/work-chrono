import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from 'react'
import { ButtonApp } from './shared/buttonApp'
import { Taches } from '../pages/settingtask'

export function AddTaskForm({
  setTasks,
}: {
  setTasks: Dispatch<SetStateAction<string[] | undefined>>
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [newTask, setNewTask] = useState<string | undefined>()

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const response = await fetch(`/api/taches/createTask`, {
      method: 'POST',
      body: JSON.stringify({ newTask: newTask }),
    })
    if (response.ok) {
      const tasks: Taches = await response.json()
      setTasks(tasks.taches)
    }
  }

  function changeIsVisible() {
    setIsVisible(!isVisible)
  }

  return (
    <div className="flex flex-col items-center justify-center my-3">
      <svg
        onClick={() => changeIsVisible()}
        width="50"
        height="50"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 5.75v12.5"></path>
        <path d="M18.25 12H5.75"></path>
      </svg>
      {isVisible && (
        <div className="flex flex-col gap-3 justify-center items-center shadow-md rounded p-3 border-1">
          <h3 className="font-bold">Ajouter une tâche :</h3>
          <form className="flex flex-col gap-3">
            <input
              type="text"
              name={newTask}
              className="border rounded-md bg-white p-2 shadow-md"
              onChange={(e) => handleInputChange(e)}
            />
            <div onClick={(e) => handleSubmit(e)}>
              <ButtonApp title="Ajouter" />
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
