import type { TreasureHuntAPI } from "../../types/api.ts";

export default function TreasureHuntPublic({treasureHunt}: {treasureHunt: TreasureHuntAPI}) {
  return (
    <div className="min-h-screen flex justify-center">
      {/* Conteneur téléphone avec bordures */}
      <div className="w-full max-w-md bg-white min-h-screen">
        <img src={import.meta.env.VITE_API_BASE_URL + treasureHunt["@id"] + "/picture"} alt={"Photo de " + treasureHunt.title} className="w-full h-60 object-cover rounded-b-xl" />
        <div className="flex flex-row justify-between w-full p-4">
          <strong className="text-lg">{treasureHunt.title}</strong>
          <div className="flex flex-row gap-1">
            <span className="text-lg">Difficulté</span>
            <span>{"🔥".repeat(treasureHunt.difficulty)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}