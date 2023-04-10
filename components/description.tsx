import { useState } from 'react'

export function Description() {
  const [isDescrHidden, setIsDescrHidden] = useState(true)

  function toggleDescr() {
    setIsDescrHidden(!isDescrHidden)
  }

  const description_1: string =
    'Work-chrono est une application de pointage, permettant de pointer son temps de travail, et ses pauses.'
  const description_2: string =
    "Inutile de créer un compte, connectez-vous avec votre compte google, seulement les informations indispensables sont utilisées par l'application : votre email, et votre nom. Aucune donnée est stockée. Cela vous permet de commencer votre journée à pointer sur un ordinateur et reprendre la session sur votre téléphone ou votre tablette."
  const description_3: string =
    "Avec Work-chrono, vous pouvez créer vos taches ou projets, et ainsi avoir un récapitulatif du temps passé pour chacun d'entre elle pour facturer vos clients précisemment."
  const description_4: string =
    'Vous avez accès à vos récapitulatifs pour optimiser votre temps, et optimiser vos habitudes de travail.'
  const description_5: string =
    'Vous pouvez aussi en fin de mois, télécharger un pdf vos bilans mensuels pour les transmettre a votre employeur.'
  const descriptions: string[] = [
    description_1,
    description_2,
    description_3,
    description_4,
    description_5,
  ]
  return (
    <div className="mx-3 flex flex-col w-[60%] shadow p-3">
      {isDescrHidden ? (
        <h3 className="text-center" onClick={() => toggleDescr()}>
          Voir description
        </h3>
      ) : (
        <>
          <h3 className="text-center" onClick={() => toggleDescr()}>
            Cacher la description
          </h3>
          <div className="flex flex-col items-begin justify-center text-center">
            {descriptions.map((desc) => (
              <p className="my-3" key={desc}>
                {desc}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
