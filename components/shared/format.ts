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
