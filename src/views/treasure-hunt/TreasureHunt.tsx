import { useParams } from "react-router";

import {Loading} from "../../components";
import { useTreasureHuntGetByIdQuery } from "../../store/slices/api.ts";
import { TreasureHuntStatusClosed } from '../../types/api';
import {parseApiError} from "../../utils/api.ts";
import ErrorView from "../error/Error.tsx";
import TreasureHuntPrivate from "./TreasureHuntPrivate.tsx";
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
  if (treasureHunt.status === TreasureHuntStatusClosed) return <TreasureHuntPrivate />;

  return (
    <TreasureHuntPublic treasureHunt={treasureHunt}  />
  );
}
