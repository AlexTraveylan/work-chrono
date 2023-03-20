import { days, formatOneorTwoDigitOnToTwoDigits } from './shared/format'

export function AffResume({
  startedAt,
  endedAt,
}: {
  startedAt: string
  endedAt: string
}) {
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
  const month = startOnFormatDate.getMonth()
  // Format le mois pour afficher toujours 2 chiffres
  const realNumberMonth = formatOneorTwoDigitOnToTwoDigits(month)
  // Obtenir l'heure du debut et de fin
  const startHour = formatOneorTwoDigitOnToTwoDigits(
    startOnFormatDate.getHours()
  )
  const endHour = formatOneorTwoDigitOnToTwoDigits(endOnFormatDate.getHours())
  // Obtenir les minutes du debut et de fin
  const startMinutes = formatOneorTwoDigitOnToTwoDigits(
    startOnFormatDate.getMinutes()
  )
  const endMinutes = formatOneorTwoDigitOnToTwoDigits(
    endOnFormatDate.getMinutes()
  )

  // Calcul du temps de travail de la journée et formatage.
  const diffInMs = endOnFormatDate.getTime() - startOnFormatDate.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const realDiffHours = formatOneorTwoDigitOnToTwoDigits(diffInHours)
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))
  const realDiffMinutes = formatOneorTwoDigitOnToTwoDigits(diffInMinutes)

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
