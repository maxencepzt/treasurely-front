import { useParams } from "react-router";

import {Loading} from "../../components";
import { useTreasureHuntGetByIdQuery } from "../../store/slices/api.ts";
import {parseApiError} from "../../utils/api.ts";
import ErrorView from "../error/Error.tsx";
import TreasureHuntPublic from "./TreasureHuntPublic.tsx";

export default function TreasureHunt() {
  const params = useParams();
  if (!params.id) {
    throw new Error('No id provided.');
  }
  const { data: treasureHunt, isLoading, error } = useTreasureHuntGetByIdQuery({id: parseInt(params.id)});

  if (isLoading) return <Loading />;

  if (error) {
    const { status, message } = parseApiError(error);
    return <ErrorView status={status} message={message} />;
  }

  if (!treasureHunt) return <ErrorView status={404} message="Chasse introuvable" />;
  // Une chasse fermée se lit encore (score, classement) ; un brouillon est refusé par le serveur

  return (
    <TreasureHuntPublic treasureHunt={treasureHunt}  />
  );
}
