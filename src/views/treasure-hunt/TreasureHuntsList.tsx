import { useState } from "react";
import { useNavigate } from "react-router";

import { Loading } from "../../components";
import TreasureHuntCard from "../../components/treasure-hunt/TreasureHuntCard";
import { useGetAllTreasureHuntsQuery } from "../../store/slices/api";
import ErrorView from "../error/Error";

export default function TreasureHuntsList() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAllTreasureHuntsQuery();
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
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filtre par statut */}
            <div className="flex-1">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "opened" | "closed" | "draft")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="opened">Ouvertes</option>
                <option value="closed">Fermées</option>
                <option value="draft">Brouillons</option>
              </select>
            </div>

            {/* Filtre par difficulté */}
            <div className="flex-1">
              <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulté
              </label>
              <select
                id="difficulty-filter"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value === "all" ? "all" : Number(e.target.value) as 1 | 2 | 3)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Toutes les difficultés</option>
                <option value="1">🔥 Facile</option>
                <option value="2">🔥🔥 Moyen</option>
                <option value="3">🔥🔥🔥 Difficile</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-4 text-gray-700">
          <span className="font-medium">{filteredHunts.length}</span> chasse(s) trouvée(s)
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

