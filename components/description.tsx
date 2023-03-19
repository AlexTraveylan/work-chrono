import { useState } from 'react'

export function Description() {
  const [isDescrHidden, setIsDescrHidden] = useState(true)

  function toggleDescr() {
    setIsDescrHidden(!isDescrHidden)
  }

  const description_1: string =
    "Work-Chrono est une application Next.js de pointage pour le travail conçue pour aider les employés à suivre leur temps de travail de manière précise et efficace. L'application est facile à utiliser et offre une interface utilisateur intuitive pour enregistrer les heures d'entrée et de sortie, les pauses déjeuner, les congés et les heures supplémentaires."
  const description_2: string =
    'Avec Work-Chrono, les utilisateurs peuvent créer leur propre compte et accéder à leur tableau de bord personnalisé, qui affiche toutes leurs informations de temps de travail dans un format facile à comprendre. Les employés peuvent facilement visualiser leurs horaires de travail, leurs heures travaillées et leur solde de congé.'
  const description_3: string =
    "L'application prend également en charge plusieurs projets et tâches, permettant aux employés de saisir le temps passé sur chaque projet ou tâche pour une meilleure gestion du temps et une facturation précise des clients."
  const description_4: string =
    "Enfin, Work-Chrono est également équipé de fonctionnalités de rapport et d'analyse pour aider les employeurs à suivre et à analyser les données de temps de travail de leurs employés, y compris les heures travaillées, les heures supplémentaires et les absences. Cela permet aux employeurs de prendre des décisions éclairées pour améliorer l'efficacité et la productivité de leur entreprise."
  const description_5: string =
    'En somme, Work-Chrono est une application Next.js de pointage pour le travail qui offre une solution complète pour suivre et gérer le temps de travail des employés de manière efficace et précise.'
  const descriptions: string[] = [
    description_1,
    description_2,
    description_3,
    description_4,
    description_5,
  ]
  return (
    <div className="mx-3">
      {isDescrHidden ? (
        <h3 className="text-center" onClick={() => toggleDescr()}>
          Voir description
        </h3>
      ) : (
        <>
          <h3 className="text-center" onClick={() => toggleDescr()}>
            Cacher la description
          </h3>
          {descriptions.map((desc) => (
            <p className="my-3" key={desc}>
              {desc}
            </p>
          ))}
        </>
      )}
    </div>
  )
}
