import { jsPDF } from 'jspdf'
import { Session } from 'next-auth'
import {
  formatDatefromTimestamp,
  formatOneorTwoDigitOnToTwoDigits,
  get_total_hours_and_minutes_from_timeStamp,
} from '../shared/format'
import { WeekReview } from './../../pages/api/reviews/monthReview'

type FormatedLabelSession = {
  label: string
  totaltime?: string
  tempTime?: number
}

export function generateMonthlyReportPdf(
  weekReview: WeekReview,
  weekSessions: WeekReview[],
  session: Session
) {
  const doc = new jsPDF()
  let i_start = 20

  // Titre
  const month = weekReview.daysSessions[0].startedAt.toLocaleString('fr-fr', {
    month: 'long',
  })
  doc.setFontSize(26)
  doc.text(
    `Bilan du mois de ${month} ${weekReview.daysSessions[0].startedAt.getFullYear()}`,
    50,
    i_start
  )

  i_start += 10

  // Nombres de jours
  const totalDays = weekReview.daysSessions.length
  doc.setFontSize(12)
  doc.text(
    `${weekSessions.length} semaines pour ${totalDays} jours`,
    80,
    i_start
  )

  i_start += 10

  // Présence total
  const totalTime = weekReview.daysSessions.reduce((acc, curr) => {
    if (curr.endedAt) {
      return acc + (curr.endedAt.getTime() - curr.startedAt.getTime())
    } else {
      return acc
    }
  }, 0)

  const formatedTotalTime =
    get_total_hours_and_minutes_from_timeStamp(totalTime)

  doc.text(
    `Nombre d'heures de présence du mois : ${
      formatedTotalTime.hour
    }h${formatOneorTwoDigitOnToTwoDigits(formatedTotalTime.minute)}`,
    20,
    i_start
  )

  i_start += 10

  // Pauses total
  const pauseTotal = weekReview.pausesSessions.reduce((acc, curr) => {
    if (curr.endedAt) {
      return acc + (curr.endedAt.getTime() - curr.startedAt.getTime())
    } else {
      return acc
    }
  }, 0)

  const formatedPausesTime =
    get_total_hours_and_minutes_from_timeStamp(pauseTotal)

  doc.text(
    `Nombre d'heures de pauses du mois : ${
      formatedPausesTime.hour
    }h${formatOneorTwoDigitOnToTwoDigits(formatedPausesTime.minute)}`,
    20,
    i_start
  )

  i_start += 15

  // Heures travaillées
  const formatedTotalWorked = get_total_hours_and_minutes_from_timeStamp(
    totalTime - pauseTotal
  )

  doc.setFontSize(24)
  doc.setTextColor(255, 0, 0)
  const encadrerText = `${
    formatedTotalWorked.hour
  }h${formatOneorTwoDigitOnToTwoDigits(formatedTotalWorked.minute)}`
  const textWidth = doc.getTextWidth(encadrerText)
  const x = 95
  const y = i_start
  const padding = 2

  // Dessinez un rectangle avec des coins arrondis autour du texte
  doc.setLineWidth(0.4)
  doc.roundedRect(
    x - padding,
    y - 7 - padding, // Soustraire la taille de la police pour positionner correctement le rectangle
    textWidth + padding * 2,
    7 + padding * 2, // Utilisez la taille de la police comme hauteur du rectangle
    1,
    1
  )

  doc.text(encadrerText, x, y)
  doc.setTextColor(0, 0, 0)

  i_start += 15

  // 1er titre
  doc.setFontSize(18)
  doc.text('Heures pour chaque semaine', 70, i_start)
  doc.setFontSize(12)

  // Heures par semaines.
  i_start += 10
  let weekIndex = 1
  for (const week of weekSessions) {
    const totalWeekTime = week.daysSessions.reduce((acc, curr) => {
      if (curr.endedAt) {
        return acc + (curr.endedAt.getTime() - curr.startedAt.getTime())
      } else {
        return acc
      }
    }, 0)

    const totalPausesWeek = week.pausesSessions.reduce((acc, curr) => {
      if (curr.endedAt) {
        return acc + (curr.endedAt.getTime() - curr.startedAt.getTime())
      } else {
        return acc
      }
    }, 0)

    const formatedWeekTime = get_total_hours_and_minutes_from_timeStamp(
      totalWeekTime - totalPausesWeek
    )

    doc.text(
      `Semaine ${weekIndex} : ${
        formatedWeekTime.hour
      }h${formatOneorTwoDigitOnToTwoDigits(formatedWeekTime.minute)}`,
      weekIndex % 2 == 0 ? 155 : 20,
      i_start
    )

    if (weekIndex % 2 == 0) {
      i_start += 10
    }
    weekIndex += 1
  }

  if (weekIndex % 2 == 1) {
    i_start += 10
  }

  // heures total par taches calculs
  const taskFormatedDict: FormatedLabelSession[] = []

  for (const task of weekReview.tasksSessions) {
    if (task?.endedAt && task?.startedAt) {
      const duration = task.endedAt.getTime() - task.startedAt.getTime()
      if (
        taskFormatedDict.filter((obj) => obj.label == task.label).length == 1
      ) {
        const foundTaskWithLabel = taskFormatedDict.find(
          (session) => session.label === task.label
        )

        if (foundTaskWithLabel?.tempTime) {
          foundTaskWithLabel.tempTime += duration
        } else {
          console.error('Impossible de trouver le label')
        }
      } else {
        const newFormatedTask = {
          label: task.label,
          tempTime: duration,
        }
        taskFormatedDict.push(newFormatedTask)
      }
    } else {
      console.error('Impossible de trouver les informations de la tache')
    }
  }

  for (const task of taskFormatedDict) {
    if (task.tempTime) {
      const getTotalTimeFormated = get_total_hours_and_minutes_from_timeStamp(
        task.tempTime
      )
      task.totaltime = `${
        getTotalTimeFormated.hour
      }h${formatOneorTwoDigitOnToTwoDigits(getTotalTimeFormated.minute)}`
    } else {
      console.error('Impossible de calculer le temps total de la tache')
    }
  }

  i_start += 10

  // 2eme titre
  doc.setFontSize(18)
  doc.text('Détails pour chaque tâche', 70, i_start)

  i_start += 10

  doc.setFontSize(12)

  // affichage taches
  for (const task of taskFormatedDict) {
    doc.text(`Tâche ${task.label} : ${task.totaltime}`, 20, i_start)
    i_start += 8
  }

  i_start += 7

  // 3eme titre
  doc.setFontSize(18)
  doc.text('Détails pour chaque jour', 70, i_start)

  i_start += 10

  doc.setFontSize(12)

  // Affichage jours
  const i_start_stock = i_start
  let next_col = 0
  for (const daySession of weekReview.daysSessions) {
    const formatedDate = formatDatefromTimestamp(daySession.startedAt.getTime())

    const pausesOfThisDay = weekReview.pausesSessions.filter(
      (pause) => pause.daySessionId == daySession.id
    )
    const totalPauseTime = pausesOfThisDay.reduce((acc, curr) => {
      if (curr.endedAt) {
        return acc + (curr.endedAt.getTime() - curr.startedAt.getTime())
      } else {
        return acc
      }
    }, 0)

    if (daySession.endedAt) {
      const totalTime = get_total_hours_and_minutes_from_timeStamp(
        daySession.endedAt.getTime() -
          daySession.startedAt.getTime() -
          totalPauseTime
      )

      doc.text(
        `${formatedDate} - Total : ${
          totalTime.hour
        }h${formatOneorTwoDigitOnToTwoDigits(totalTime.minute)}`,
        next_col > 12 ? 140 : 20,
        i_start
      )
      i_start += 8
      if (next_col > 12) {
        i_start = i_start_stock
      }
    }
  }

  // crédit
  doc.text('https://work-chrono.vercel.app/', 140, 290)

  // date
  const now = new Date()
  doc.text(
    `${formatOneorTwoDigitOnToTwoDigits(
      now.getDate()
    )} / ${formatOneorTwoDigitOnToTwoDigits(
      now.getMonth() + 1
    )} / ${now.getFullYear()}`,
    95,
    290
  )

  // utilisateur
  if (session.user?.name && session.user?.email) {
    doc.text(`${session.user.name}`, 20, 285)
    doc.text(`${session.user.email}`, 20, 290)
  }

  return doc
}
