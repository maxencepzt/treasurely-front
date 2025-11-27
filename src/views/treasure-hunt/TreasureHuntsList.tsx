import { useState } from "react";
import { useNavigate } from "react-router";

import { Loading } from "../../components";
import TreasureHuntCard from "../../components/treasure-hunt/TreasureHuntCard";
import { useGetAllTreasureHuntsQuery } from "../../store/slices/api";
import ErrorView from "../error/Error";

export default function TreasureHuntsList() {
  const navigate = useNavigate();
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
  // Documentation : Le filtre 'Tous' exclut les chasses fermées et brouillons
  const filteredHunts = treasureHunts.filter((hunt) => {
    let matchesStatus = false;
    if (statusFilter === "all") {
      matchesStatus = hunt.status !== "closed" && hunt.status !== "draft";
    } else {
      matchesStatus = hunt.status === statusFilter;
    }
    const matchesDifficulty = difficultyFilter === "all" || hunt.difficulty === difficultyFilter;
    return matchesStatus && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-green-700 hover:text-green-900 font-medium flex items-center gap-2"
          >
            ← Retour
          </button>

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
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    statusFilter === "all"
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tous
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("opened")}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    statusFilter === "opened"
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="inline-block mr-1">🟢</span>
                  Ouvertes
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("closed")}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    statusFilter === "closed"
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="inline-block mr-1">🔴</span>
                  Fermées
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("draft")}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    statusFilter === "draft"
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="inline-block mr-1">📝</span>
                  Brouillons
                </button>
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
                <button
                  type="button"
                  onClick={() => setDifficultyFilter("all")}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    difficultyFilter === "all"
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="inline-block mr-1">🌐</span>
                  Toutes
                </button>
                <button
                  type="button"
                  onClick={() => setDifficultyFilter(1)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    difficultyFilter === 1
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="inline-block mr-1">🔥</span>
                  Facile
                </button>
                <button
                  type="button"
                  onClick={() => setDifficultyFilter(2)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    difficultyFilter === 2
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="inline-block mr-1">🔥🔥</span>
                  Moyen
                </button>
                <button
                  type="button"
                  onClick={() => setDifficultyFilter(3)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    difficultyFilter === 3
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="inline-block mr-1">🔥🔥🔥</span>
                  Difficile
                </button>
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
