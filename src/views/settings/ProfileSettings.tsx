import { useParams } from "react-router";

import { BackButton } from "../../components";

export default function ProfileSettings() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl p-6">

        <BackButton variant="dark" />

        <h1 className="text-2xl font-bold mt-4 mb-6">Paramètres d'utilisateur</h1>

        <p className="text-gray-700">
          Page de réglages pour l’utilisateur <strong>#{id}</strong>.
        </p>
      </div>
    </div>
  );
}
