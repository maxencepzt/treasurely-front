import { useState } from 'react';
import { faUsers, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { TeamAPI } from '../../types/api';

interface TeamSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (teamId?: number) => void;
  teams: TeamAPI[];
  isLoading?: boolean;
}

export default function TeamSelectionModal({
  isOpen,
  onClose,
  onSelectTeam,
  teams,
  isLoading = false,
}: TeamSelectionModalProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(undefined);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSelectTeam(selectedTeamId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Mode de participation</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {/* Solo option */}
          <button
            type="button"
            onClick={() => setSelectedTeamId(undefined)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              selectedTeamId === undefined
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  selectedTeamId === undefined ? 'border-green-500' : 'border-gray-300'
                }`}
              >
                {selectedTeamId === undefined && <div className="w-3 h-3 rounded-full bg-green-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                  <span className="font-semibold text-gray-900">Jouer seul</span>
                </div>
                <p className="text-sm text-gray-600">Participez individuellement à cette chasse</p>
              </div>
            </div>
          </button>

          {/* Teams section */}
          {teams.length > 0 && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-700">Jouer pour une équipe :</p>

              {teams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTeamId === team.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedTeamId === team.id ? 'border-green-500' : 'border-gray-300'
                      }`}
                    >
                      {selectedTeamId === team.id && <div className="w-3 h-3 rounded-full bg-green-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faUsers} className="text-green-600" />
                        <span className="font-semibold text-gray-900">{team.name}</span>
                      </div>
                      {team.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{team.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}

          {teams.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p>Vous ne faites partie d'aucune équipe.</p>
              <p className="text-sm mt-2">Vous pouvez uniquement participer en solo.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
            }`}
          >
            {isLoading ? 'Création...' : 'Participer'}
          </button>
        </div>
      </div>
    </div>
  );
}

