import { FakeHour } from '../../testdata/models/FakeDate'

export function formatDatefromTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return `${formatOneorTwoDigitOnToTwoDigits(
    date.getDate()
  )}/${formatOneorTwoDigitOnToTwoDigits(
    date.getMonth() + 1
  )}/${date.getFullYear()}`
}

export function formatOneorTwoDigitOnToTwoDigits(thingToFormat: number) {
  if (thingToFormat < 10) {
    return `0${thingToFormat}`
  } else if (thingToFormat >= 10) {
    return `${thingToFormat}`
  } else {
    return 'Error'
  }
}

export const days = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
]

export function get_hour_minute_from_timeStamp(timestamp: number): FakeHour {
  const date = new Date(timestamp)
  const hour = date.getHours()
  const minute = date.getMinutes()

  return {
    hour: hour,
    minute: minute,
  }
}

export function get_total_hours_and_minutes_from_timeStamp(
  timestamp: number
): FakeHour {
  const hours = Math.floor(timestamp / (1000 * 60 * 60))
  const minutes = Math.floor(
    (timestamp - hours * (1000 * 60 * 60)) / (1000 * 60)
  )

  return {
    hour: hours,
    minute: minutes,
  }
}

export function get_7h_from_timeStamp(timestamp: number) {
  const date = new Date(timestamp)

  const date7h = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    7,
    0,
    0
  )
  return date7h.getTime()
}

export function get_20h_from_timeStamp(timestamp: number) {
  const date = new Date(timestamp)

  const date20h = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    20,
    0,
    0
  )
  return date20h.getTime()
}

export function get_height_from(startedAt: number, endedAt: number) {
  const max_size =
    get_20h_from_timeStamp(startedAt) - get_7h_from_timeStamp(startedAt)

  return Math.floor(
    (100 * (new Date(endedAt).getTime() - new Date(startedAt).getTime())) /
      max_size
  )
}

export function get_top_from_startedAt(startedAt: number) {
  const max_size =
    get_20h_from_timeStamp(startedAt) - get_7h_from_timeStamp(startedAt)

  return Math.floor(
    100 *
      ((new Date(startedAt).getTime() -
        get_7h_from_timeStamp(new Date(startedAt).getTime())) /
        max_size)
  )
}
