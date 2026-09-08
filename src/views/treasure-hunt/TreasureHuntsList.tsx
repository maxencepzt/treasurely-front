import { useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Loading } from "../../components";
import { inputClasses, secondaryClasses } from "../../components/settings/fields";
import ButtonFilter from "../../components/treasure-hunt/ButtonFilter";
import TreasureHuntCard from "../../components/treasure-hunt/TreasureHuntCard";
import { useGetAllTreasureHuntsQuery } from "../../store/slices/api";
import type { TreasureHuntAPI } from "../../types/api";
import ErrorView from "../error/Error";

const DIFFICULTIES = [
  { value: 1, label: "Facile" },
  { value: 2, label: "Moyen" },
  { value: 3, label: "Difficile" },
] as const;

type Difficulty = (typeof DIFFICULTIES)[number]["value"];

/** Minuscules sans accents : « forêt » trouve « Foret » et l'inverse. */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function matches(hunt: TreasureHuntAPI, search: string): boolean {
  const needle = normalize(search.trim());

  return needle === "" || normalize(`${hunt.title} ${hunt.location}`).includes(needle);
}

/**
 * Les chasses à rejoindre. Le serveur ne liste que les ouvertes à un joueur ; ici on cherche
 * par titre ou lieu, par catégorie et par difficulté.
 */
export default function TreasureHuntsList() {
  const { data, isLoading, error } = useGetAllTreasureHuntsQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<number | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");

  if (error) {
    return <ErrorView status={500} message="Erreur lors du chargement des chasses au trésor" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const treasureHunts = data?.member ?? [];
  // Les catégories proposées sont celles des chasses listées : pas de puce qui ne trouve rien
  const categories = [...new Map(treasureHunts.flatMap((hunt) => hunt.huntType).map((type) => [type.id, type])).values()];
  const filtered = treasureHunts.filter(
    (hunt) =>
      matches(hunt, search)
      && (category === "all" || hunt.huntType.some((type) => type.id === category))
      && (difficulty === "all" || hunt.difficulty === difficulty),
  );
  const filtering = search.trim() !== "" || category !== "all" || difficulty !== "all";
  const reset = () => {
    setSearch("");
    setCategory("all");
    setDifficulty("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Chasses au trésor</h1>
          <p className="text-lg text-gray-700">Les chasses ouvertes, à rejoindre seul ou en équipe</p>
        </div>

        <section aria-label="Filtres" className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-200 flex flex-col gap-5">
          <label htmlFor="search" className="flex flex-col gap-1">
            <span className="text-sm font-medium">Rechercher</span>
            <span className="relative block">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                id="search"
                autoComplete="off"
                placeholder="Titre ou lieu"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`${inputClasses} w-full pl-10`}
              />
            </span>
          </label>

          {categories.length > 0 && (
            <div role="group" aria-labelledby="category-label">
              <span id="category-label" className="block text-sm font-medium mb-2">Catégorie</span>
              <div className="flex flex-wrap gap-2">
                <ButtonFilter label="Toutes" active={category === "all"} onClick={() => setCategory("all")} />
                {categories.map((type) => (
                  <ButtonFilter key={type.id} label={type.title} active={category === type.id} onClick={() => setCategory(type.id)} />
                ))}
              </div>
            </div>
          )}

          <div role="group" aria-labelledby="difficulty-label">
            <span id="difficulty-label" className="block text-sm font-medium mb-2">Difficulté</span>
            <div className="flex flex-wrap gap-2">
              <ButtonFilter label="Toutes" active={difficulty === "all"} onClick={() => setDifficulty("all")} />
              {DIFFICULTIES.map((level) => (
                <ButtonFilter key={level.value} label={level.label} active={difficulty === level.value} onClick={() => setDifficulty(level.value)} />
              ))}
            </div>
          </div>
        </section>

        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <p role="status" className="text-base text-gray-700">
            <span className="font-semibold text-green-800">{filtered.length}</span> {filtered.length > 1 ? "chasses" : "chasse"}
          </p>
          {filtering && (
            <button type="button" onClick={reset} className={secondaryClasses}>
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center flex flex-col items-center gap-4">
            <p className="text-lg text-gray-700">
              {treasureHunts.length === 0 ? "Aucune chasse n'est ouverte pour le moment." : "Aucune chasse ne correspond à ces critères."}
            </p>
            {filtering && (
              <button type="button" onClick={reset} className={secondaryClasses}>
                Voir toutes les chasses
              </button>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((hunt) => (
              <li key={hunt.id}>
                <TreasureHuntCard treasureHunt={hunt} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
