import { useEffect, useState } from 'react'
import { AffTestTask } from '../testdata/models/AffTestTask'
import {
  days,
  formatOneorTwoDigitOnToTwoDigits,
  get_total_hours_and_minutes_from_timeStamp,
} from './shared/format'

export function AffResume({
  startedAt,
  endedAt,
  daySessionId,
}: {
  startedAt: string
  endedAt: string
  daySessionId: number
}) {
  const [timePauses, setTimePauses] = useState<number>(0)

  async function recupPause(daySessionId: number) {
    const response = await fetch(`/api/reviews/pauseReview`, {
      method: 'POST',
      body: JSON.stringify({ daySessionId: daySessionId }),
    })

    if (response.ok) {
      const data: { pauses: AffTestTask[] } = await response.json()
      const timePauses = data.pauses.reduce((acc, curr) => {
        const localPauseStartedAt = new Date(curr.startedAt).getTime()
        const localPauseEndedAt = new Date(curr.endedAt).getTime()
        return acc + (localPauseEndedAt - localPauseStartedAt)
      }, 0)

      setTimePauses(timePauses)
    }
  }

  useEffect(() => {
    recupPause(daySessionId)
  }, [])

  // Conversion des Dates venant la bdd qui sont en string en Date
  const startOnFormatDate = new Date(startedAt)
  const endOnFormatDate = new Date(endedAt)

  // Obtenir le nom du jour de la semaine à partir du tableau des jours
  const day = days[startOnFormatDate.getDay()]
  // Obtenir le numéro du jour du mois
  const numberDay = startOnFormatDate.getDate()
  // Format le jour pour afficher toujours 2 chiffres
  const realNumberDay = formatOneorTwoDigitOnToTwoDigits(numberDay)
  // Obtenir l'année
  const year = startOnFormatDate.getFullYear()
  // Obtenir le nom du mois en français
  const month = startOnFormatDate.getMonth() + 1
  // Format le mois pour afficher toujours 2 chiffres
  const realNumberMonth = formatOneorTwoDigitOnToTwoDigits(month)
  // Obtenir l'heure du debut et de fin
  const startHour = startOnFormatDate.getHours()

  const endHour = endOnFormatDate.getHours()
  // Obtenir les minutes du debut et de fin
  const startMinutes = formatOneorTwoDigitOnToTwoDigits(
    startOnFormatDate.getMinutes()
  )
  const endMinutes = formatOneorTwoDigitOnToTwoDigits(
    endOnFormatDate.getMinutes()
  )

  // Calcul du temps de pauses
  // Calcul du temps de travail de la journée et formatage.
  const diffInMs = get_total_hours_and_minutes_from_timeStamp(
    endOnFormatDate.getTime() - startOnFormatDate.getTime() - timePauses
  )
  const realDiffHours = diffInMs.hour
  const realDiffMinutes = formatOneorTwoDigitOnToTwoDigits(diffInMs.minute)

  return (
    <div className="flex flex-col items-start shadow-md rounded p-3 gap-3">
      <div className="flex flex-col items-center w-full">
        <p className="font-bold">{day}</p>
        <p>
          {realNumberDay}/{realNumberMonth}/{year}
        </p>
      </div>
      <h4>
        Durée totale :{' '}
        <span className="font-bold">
          {realDiffHours}h{realDiffMinutes}
        </span>
      </h4>
      <div className="flex flex-col items-center w-full">
        <p>
          Début : {startHour}h{startMinutes}
        </p>
        <p>
          Fin : {endHour}h{endMinutes}
        </p>
      </div>
    </div>
  )
}
