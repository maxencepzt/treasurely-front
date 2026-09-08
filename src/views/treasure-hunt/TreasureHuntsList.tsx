import { useState } from "react";

import { Loading } from "../../components";
import ButtonFilter from "../../components/treasure-hunt/ButtonFilter";
import TreasureHuntCard from "../../components/treasure-hunt/TreasureHuntCard";
import { useGetAllTreasureHuntsQuery } from "../../store/slices/api";
import ErrorView from "../error/Error";

export default function TreasureHuntsList() {
  const { data, isLoading, error } = useGetAllTreasureHuntsQuery();
  // Par défaut, le filtre est sur 'all' (tous sauf fermés et brouillons)
  const [statusFilter, setStatusFilter] = useState<"all" | "opened" | "closed" | "draft">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | 1 | 2 | 3>("all");

  if (error) {
    return <ErrorView status={500} message="Erreur lors du chargement des chasses au trésor" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const treasureHunts = data?.member || [];

  // Filtrer les chasses selon les critères
  const filteredHunts = treasureHunts.filter((hunt) => {
    const matchesStatus = statusFilter === "all" || hunt.status === statusFilter;
    const matchesDifficulty = difficultyFilter === "all" || hunt.difficulty === difficultyFilter;
    return matchesStatus && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <div className="text-5xl mb-4">
              🗺️
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Toutes les Chasses au Trésor
            </h1>
            <p className="text-lg sm:text-xl text-gray-700">
              Découvrez toutes les chasses disponibles
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-100">
          <div className="space-y-4">
            {/* Filtre par statut */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>📊</span>
                <span>Statut</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <ButtonFilter
                  label={<>Tous</>}
                  emoji={"🌐"}
                  active={statusFilter === "all"}
                  onClick={() => setStatusFilter("all")}
                />
                <ButtonFilter
                  label={<>Ouvertes</>}
                  emoji={"🟢"}
                  active={statusFilter === "opened"}
                  onClick={() => setStatusFilter("opened")}
                />
                <ButtonFilter
                  label={<>Fermées</>}
                  emoji={"🔴"}
                  active={statusFilter === "closed"}
                  onClick={() => setStatusFilter("closed")}
                />
                <ButtonFilter
                  label={<>Brouillons</>}
                  emoji={"📝"}
                  active={statusFilter === "draft"}
                  onClick={() => setStatusFilter("draft")}
                />
              </div>
            </div>

            {/* Séparateur */}
            <div className="border-t border-gray-100"></div>

            {/* Filtre par difficulté */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>🎯</span>
                <span>Difficulté</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <ButtonFilter
                  label={<>Toutes</>}
                  emoji={"🌐"}
                  active={difficultyFilter === "all"}
                  onClick={() => setDifficultyFilter("all")}
                />
                <ButtonFilter
                  label={<>Facile</>}
                  emoji={"🔥"}
                  active={difficultyFilter === 1}
                  onClick={() => setDifficultyFilter(1)}
                />
                <ButtonFilter
                  label={<>Moyen</>}
                  emoji={"🔥🔥"}
                  active={difficultyFilter === 2}
                  onClick={() => setDifficultyFilter(2)}
                />
                <ButtonFilter
                  label={<>Difficile</>}
                  emoji={"🔥🔥🔥"}
                  active={difficultyFilter === 3}
                  onClick={() => setDifficultyFilter(3)}
                />
              </div>
            </div>

            {/* Bouton reset */}
            {(statusFilter !== "all" || difficultyFilter !== "all") && (
              <>
                <div className="border-t border-gray-100"></div>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setDifficultyFilter("all");
                  }}
                  className="w-full sm:w-auto text-sm text-green-600 hover:text-green-700 hover:bg-green-50 font-medium flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors"
                >
                  <span className="text-base">↻</span>
                  Réinitialiser les filtres
                </button>
              </>
            )}
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <span className="text-green-700 font-semibold text-base">{filteredHunts.length}</span>
            <span className="text-sm text-gray-600">
              {filteredHunts.length > 1 ? "chasses trouvées" : "chasse trouvée"}
            </span>
          </div>
        </div>

        {/* Liste des chasses */}
        {filteredHunts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg text-gray-600">
              Aucune chasse au trésor ne correspond à vos critères
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHunts.map((hunt) => (
              <TreasureHuntCard key={hunt.id} treasureHunt={hunt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
