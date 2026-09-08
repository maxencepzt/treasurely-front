import { type FormEvent, useDeferredValue, useState } from "react";
import { Link, useNavigate } from "react-router";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Loading } from "../../components";
import { inputClasses, submitClasses } from "../../components/settings/fields";
import FormFeedback from "../../components/settings/FormFeedback";
import JoinRequestButton from "../../components/teams/JoinRequestButton";
import TeamCard from "../../components/teams/TeamCard";
import { useUser } from "../../contexts/user";
import { useDesignerSso } from "../../hooks/useDesignerSso";
import { useJoinTeamByCodeMutation, usePlayerTeamsQuery, useUserTeamsByIdQuery } from "../../store/slices/api";
import { getIdFromUrl, parseApiError } from "../../utils/api";
import ErrorView from "../error/Error";

/**
 * L'onglet Équipes : les miennes, un code à saisir, l'annuaire des équipes de joueurs. Les
 * équipes de concepteurs se créent et se recrutent dans l'espace concepteur du back.
 */
export default function TeamsIndex() {
  const { user } = useUser();
  const navigate = useNavigate();
  const openDesigner = useDesignerSso();
  const { data: mine, isLoading } = useUserTeamsByIdQuery({ id: user?.id ?? 0 }, { skip: !user });
  const [code, setCode] = useState("");
  const [joinTeam, { isLoading: joining, error: joinError }] = useJoinTeamByCodeMutation();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const { data: directory, isFetching: searching } = usePlayerTeamsQuery({ name: deferredSearch || undefined });

  if (!user) {
    return <ErrorView status={401} message="Connectez-vous pour voir vos équipes" />;
  }

  const myIris = new Set(mine?.teams.map((team) => team["@id"]) ?? []);
  const total = directory?.totalItems ?? 0;

  async function handleJoin(event: FormEvent) {
    event.preventDefault();
    try {
      const team = await joinTeam({ code }).unwrap();
      navigate(`/teams/${team.id}`);
    } catch {
      // L'erreur est affichée sous le formulaire via joinError
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Équipes</h1>
          <p className="text-lg text-gray-700">Jouez à plusieurs : rejoignez une équipe ou créez la vôtre</p>
        </div>

        <section aria-labelledby="my-teams" className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 id="my-teams" className="text-2xl font-bold text-gray-900">Mes équipes</h2>
            <Link to="/teams/new" className={`${submitClasses} inline-flex items-center gap-2`}>
              <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
              Créer une équipe
            </Link>
          </div>
          {isLoading ? (
            <Loading />
          ) : mine && mine.teams.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mine.teams.map((team) => (
                <li key={team["@id"]}>
                  <TeamCard id={getIdFromUrl(team["@id"])} name={team.name} type={team.type} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-base text-gray-700">
              Vous n'avez pas encore d'équipe : rejoignez-en une avec un code, cherchez-la dans l'annuaire ou créez la vôtre.
            </p>
          )}
          <p className="text-sm text-gray-700">
            Les équipes de concepteurs se créent et se recrutent dans l'espace concepteur.{" "}
            <button type="button" onClick={() => void openDesigner()} className="underline font-medium text-green-800">
              Ouvrir l'espace concepteur
            </button>
          </p>
        </section>

        <section aria-labelledby="join-code" className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 flex flex-col gap-4">
          <h2 id="join-code" className="text-xl font-bold text-gray-900">Rejoindre avec un code</h2>
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="code" className="flex-1 flex flex-col gap-1">
              <span className="text-sm font-medium">Code reçu du créateur de l'équipe</span>
              <input
                type="text"
                id="code"
                name="code"
                autoComplete="off"
                required
                placeholder="treasurely_0000000000000"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className={`${inputClasses} font-mono`}
              />
            </label>
            <button type="submit" disabled={joining} className={`${submitClasses} sm:self-end`}>
              {joining ? "Vérification…" : "Rejoindre"}
            </button>
          </form>
          <FormFeedback error={joinError ? parseApiError(joinError).message : null} />
        </section>

        <section aria-labelledby="directory" className="flex flex-col gap-4">
          <h2 id="directory" className="text-2xl font-bold text-gray-900">Annuaire des équipes de joueurs</h2>
          <label htmlFor="team-search" className="flex flex-col gap-1">
            <span className="text-sm font-medium">Rechercher</span>
            <span className="relative block">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                id="team-search"
                autoComplete="off"
                placeholder="Nom de l'équipe"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`${inputClasses} w-full pl-10`}
              />
            </span>
          </label>
          <p role="status" className="text-base text-gray-700">
            {searching ? "Recherche…" : <><span className="font-semibold text-green-800">{total}</span> {total > 1 ? "équipes" : "équipe"}</>}
          </p>
          {directory && directory.member.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {directory.member.map((team) => (
                <li key={team.id}>
                  <TeamCard id={team.id} name={team.name} type={team.type} description={team.description} memberCount={team.memberCount}>
                    <JoinRequestButton teamId={team.id} teamIri={team["@id"]} isMember={myIris.has(team["@id"])} />
                  </TeamCard>
                </li>
              ))}
            </ul>
          ) : (
            !searching && (
              <p className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-base text-gray-700">
                Aucune équipe ne porte ce nom.
              </p>
            )
          )}
          {directory && total > directory.member.length && (
            <p className="text-sm text-gray-600">Seules les vingt premières sont affichées : affinez la recherche.</p>
          )}
        </section>
      </div>
    </div>
  );
}
