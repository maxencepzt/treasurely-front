import { useState } from "react";
import { useNavigate } from "react-router";
import {faCog, faLocationDot, faMapLocationDot, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { BackButton, CoverImage, DescriptionModal, TeamButton } from "../../components";
import HuntTypeBadge from "../../components/treasure-hunt/HuntTypebadge.tsx";
import THButton from "../../components/treasure-hunt/thButton.tsx";
import TeamSelectionModal from "../../components/treasure-hunt/TeamSelectionModal.tsx";
import { useUser } from "../../contexts/user";
import {
  useCreateParticipateHuntMutation,
  useGetTreasureHuntRiddlesQuery,
  useLazyGetParticipateHuntByUserAndHuntQuery,
  useTeamByIdQuery,
  useUserTeamsByIdQuery,
} from "../../store/slices/api.ts";
import type { TeamAPI, TreasureHuntAPI } from "../../types/api.ts";
import { getIdFromUrl } from "../../utils/api.ts";
import formatDuration from "../../utils/formatDuration.ts";

export default function TreasureHuntPublic({treasureHunt}: {treasureHunt: TreasureHuntAPI}) {
  const navigate = useNavigate();
  const { user } = useUser();

  const [showModal, setShowModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const [checkParticipation] = useLazyGetParticipateHuntByUserAndHuntQuery();
  const [createParticipation, { isLoading: isCreating }] = useCreateParticipateHuntMutation();
  const { data: userTeamsData } = useUserTeamsByIdQuery(
    { id: user?.id || 0 },
    { skip: !user }
  );
  const { data: riddlesList } = useGetTreasureHuntRiddlesQuery({ huntId: treasureHunt.id });

  // Charger les détails des équipes de l'utilisateur
  const { data: team1 } = useTeamByIdQuery(
    { id: userTeamsData && userTeamsData.teams.length > 0 ? getIdFromUrl(userTeamsData.teams[0]) : 0 },
    { skip: !userTeamsData || userTeamsData.teams.length === 0 }
  );
  const { data: team2 } = useTeamByIdQuery(
    { id: userTeamsData && userTeamsData.teams.length > 1 ? getIdFromUrl(userTeamsData.teams[1]) : 0 },
    { skip: !userTeamsData || userTeamsData.teams.length < 2 }
  );
  const { data: team3 } = useTeamByIdQuery(
    { id: userTeamsData && userTeamsData.teams.length > 2 ? getIdFromUrl(userTeamsData.teams[2]) : 0 },
    { skip: !userTeamsData || userTeamsData.teams.length < 3 }
  );

  // Construire le tableau des équipes
  const teams: TeamAPI[] = [team1, team2, team3].filter((t): t is TeamAPI => t !== undefined);

  const maxLength = 250;
  const isLong = treasureHunt.description?.length > maxLength;
  const description = isLong
    ? treasureHunt.description.slice(0, maxLength) + '...'
    : treasureHunt.description;

  const isOwner = user && getIdFromUrl(treasureHunt.owner) === user.id;

  const handleParticipate = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    console.log('🔍 Vérification participation pour user:', user.id, 'hunt:', treasureHunt.id);

    try {
      // Vérifier si une participation existe déjà
      const result = await checkParticipation({
        userId: user.id,
        huntId: treasureHunt.id,
      });

      console.log('📊 Résultat checkParticipation:', result);

      if (result.data) {
        console.log('✅ Participation existante trouvée:', result.data);
        // Rediriger vers l'énigme en cours
        const riddleId = typeof result.data.currentRiddle === 'string'
          ? getIdFromUrl(result.data.currentRiddle)
          : result.data.currentRiddle;
        console.log('➡️ Redirection vers riddle:', riddleId);
        navigate(`/riddle/${riddleId}`);
        return;
      }

      console.log('❌ Aucune participation existante (result.data est null/undefined)');
    } catch (error) {
      console.log('⚠️ Erreur lors de la vérification:', error);
    }

    // Aucune participation existante, afficher le modal de sélection d'équipe
    console.log('🎯 Affichage du modal de sélection d\'équipe');
    setShowTeamModal(true);
  };

  const handleTeamSelect = async (teamId?: number) => {
    if (!user) return;

    // Récupérer le premier riddle de la chasse
    const firstRiddle = riddlesList && riddlesList.length > 0 ? riddlesList[0] : null;

    if (!firstRiddle) {
      alert('Erreur: Aucune énigme trouvée pour cette chasse');
      return;
    }

    try {
      const body: {
        lastParticipate: string;
        hunter: string;
        hunt: string;
        currentRiddle: string;
        playerTeam?: string;
      } = {
        lastParticipate: new Date().toISOString(),
        hunter: `/api/users/${user.id}`,
        hunt: `/api/treasure_hunts/${treasureHunt.id}`,
        currentRiddle: firstRiddle['@id'],
      };

      if (teamId) {
        body.playerTeam = `/api/teams/${teamId}`;
      }

      const participation = await createParticipation(body).unwrap();

      // Rediriger vers l'énigme en cours
      const riddleId = typeof participation.currentRiddle === 'string'
        ? getIdFromUrl(participation.currentRiddle)
        : participation.currentRiddle;
      navigate(`/riddle/${riddleId}`);
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error &&
        typeof error.data === 'object' && error.data && 'detail' in error.data
        ? String(error.data.detail)
        : 'Impossible de créer la participation';

      console.error('Erreur lors de la création de la participation:', error);
      alert(`Erreur: ${errorMessage}`);
    }
  };


  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col">
        {/* Image de couverture avec boutons */}
        <CoverImage
          type="treasure-hunt"
          id={treasureHunt.id}
          alt={"Photo de " + treasureHunt.title}
          backButton={<BackButton variant="dark" />}
          actionButton={
            isOwner ? (
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-gray-800/70 hover:bg-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                onClick={() => navigate(`/treasure-hunts/${treasureHunt.id}/edit`)}
                aria-label="Éditer"
                title="Éditer la chasse au trésor"
              >
                <FontAwesomeIcon icon={faCog} className="text-xl text-white" />
              </button>
            ) : undefined
          }
        />

        {/* Titre et difficulté */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-white to-green-50">
          <div className="flex flex-row justify-between items-start gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">{treasureHunt.title}</h1>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-medium text-gray-600">Difficulté</span>
              <div className="flex items-center gap-1">
                <span className="text-xl">{"🔥".repeat(treasureHunt.difficulty)}</span>
              </div>
            </div>
          </div>

          {/* Équipe conceptrice */}
          <TeamButton teamRoute={treasureHunt.designerTeam} />
        </div>

        {/* Stats */}
        <div className="px-6 pb-4 bg-gradient-to-b from-green-50 to-white">
          <div className="flex flex-row gap-6 bg-white rounded-2xl p-4 border-2 border-green-100 shadow-sm">
            <div className="flex flex-row items-center gap-2" title={`${treasureHunt.riddleCount} énigmes`}>
              <FontAwesomeIcon icon={faMapLocationDot} className="text-xl text-green-600" />
              <span className="text-base font-semibold text-gray-800">{treasureHunt.riddleCount} énigmes</span>
            </div>
            <div className="flex flex-row items-center gap-2" title={treasureHunt.location}>
              <FontAwesomeIcon icon={faLocationDot} className="text-xl text-green-600" />
              <span className="text-base font-semibold text-gray-800">{treasureHunt.location}</span>
            </div>
            <div className="flex flex-row items-center gap-2" title={formatDuration(treasureHunt.estimatedTime*60)}>
              <FontAwesomeIcon icon={faStopwatch} className="text-xl text-green-600" />
              <span className="text-base font-semibold text-gray-800">{formatDuration(treasureHunt.estimatedTime*60)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span>À propos</span>
          </h2>
          <div
            className={`text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gradient-to-br from-white to-green-50 rounded-2xl p-4 border-2 border-green-100 shadow-sm ${
              isLong ? "cursor-pointer hover:border-green-200" : ""
            }`}
            onClick={() => isLong && setShowModal(true)}
            title={isLong ? "Voir la description complète" : undefined}
          >
            {description}
          </div>
        </div>

        {/* Modal pour la description complete */}
        <DescriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          description={treasureHunt.description}
        />

        {/* Catégories */}
        <div className="px-6 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🏷️</span>
            <span>Catégories</span>
          </h2>
          <div className="flex flex-row gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {treasureHunt.huntType.map((cat) => (
              <HuntTypeBadge key={cat.id}>
                {cat.title}
              </HuntTypeBadge>
            ))}
          </div>
        </div>

        {/* Bouton participer */}
        <div className="mt-auto px-6 pb-6">
          <THButton onClick={handleParticipate}>Participer</THButton>
        </div>

        {/* Modal de sélection d'équipe */}
        <TeamSelectionModal
          isOpen={showTeamModal}
          onClose={() => setShowTeamModal(false)}
          onSelectTeam={handleTeamSelect}
          teams={teams}
          isLoading={isCreating}
        />
      </div>
    </div>
  );
}
