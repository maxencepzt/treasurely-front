import { useParams } from "react-router";

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
  const { data: treasureHunt, isLoading, error } = useTreasureHuntGetByIdQuery({id: parseInt(params.id)});

  if (isLoading) return <Loading />;

  if (error) {
    let status = 500;
    let message = "Une erreur est survenue";

    if ("status" in error) {
      status = typeof error.status === "number" ? error.status : 500;
      message = (error.data && typeof error.data === "object" && "message" in error.data)
        ? (error.data as any).message
        : "Erreur serveur";
    } else if ("message" in error) {
      message = error.message || message;
    }

    return <ErrorView status={status} message={message} />;
  }

  if (!treasureHunt) return <ErrorView status={404} message="Chasse introuvable" />;
  if (!treasureHunt.public) return <TreasureHuntPrivate />;

  return (
    <TreasureHuntPublic treasureHunt={treasureHunt}  />
  );
}
