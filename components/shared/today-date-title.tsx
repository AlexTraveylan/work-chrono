// TodayDateTitle est un composant React qui affiche la date du jour
// formatée avec le nom du jour de la semaine, le numéro du jour, le mois et l'année.
export function TodayDateTitle() {
  // Un tableau des jours de la semaine en français
  const days = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ]

  // Obtenir la date actuelle
  const now = new Date()
  // Obtenir le nom du jour de la semaine à partir du tableau des jours
  const day = days[now.getDay()]
  // Obtenir le numéro du jour du mois
  const numberDay = now.getDate()
  // Obtenir l'année
  const year = now.getFullYear()
  // Obtenir le nom du mois en français
  const month = now.toLocaleString('fr-fr', { month: 'long' })

  // Renvoie un élément h1 avec la date formatée
  return (
    <h1 className="text-5xl font-bold">{`${day} ${numberDay} ${month} ${year}`}</h1>
  )
}
