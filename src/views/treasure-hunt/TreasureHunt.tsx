import {useParams} from "react-router";

import {Loading} from "../../components";
import { useTreasureHuntGetByIdQuery } from "../../store/slices/api.ts";
import ErrorView from "../Error.tsx";
import TreasureHuntPrivate from "./TreasureHuntPrivate.tsx";
import TreasureHuntPublic from "./TreasureHuntPublic.tsx";

export default function TreasureHunt() {
  const params = useParams();
  if (!params.id) {
    throw new Error('No id provided.');
  }
  const { data: treasureHunt, isLoading } = useTreasureHuntGetByIdQuery({id: parseInt(params.id)});

  if (isLoading) return <Loading />;
  if (!treasureHunt) return <ErrorView status={404} message="Chasse introuvable" />;
  if (!treasureHunt.public) return <TreasureHuntPrivate />;

  return (
    <TreasureHuntPublic treasureHunt={treasureHunt}  />
  );
}