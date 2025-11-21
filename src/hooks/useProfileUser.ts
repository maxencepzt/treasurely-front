import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { useGetAuthentifiedUserQuery, useUserByIdQuery } from "../store/slices/api.ts";

export function useProfileUser() {
  const params = useParams();
  const navigate = useNavigate();

  // Si l'URL contient un id, on le prend, sinon on attend l'utilisateur connecté
  const { data: me, isLoading: isLoadingMe, error: errorMe } = useGetAuthentifiedUserQuery(null);
  const userId = params.id ? parseInt(params.id) : me?.id;
  // Si userId est undefined, on ne fait pas la requête userById
  const skip = userId === undefined;
  const { data: user, isLoading: isLoadingUser, error: errorUser } = useUserByIdQuery(
    skip ? ({ id: 0 } as any) : { id: userId }
  );

  useEffect(() => {
    if (!params.id && me && me.id) {
      navigate(`/profile/${me.id}`, { replace: true });
    }
  }, [params.id, me, navigate]);

  // Si pas d'id dans l'URL, on attend l'utilisateur connecté
  if (!params.id) {
    return {
      user: undefined,
      isLoading: isLoadingMe,
      error: errorMe,
    };
  }

  // Si on a sauté la requête userById, on attend me
  if (skip) {
    return {
      user: undefined,
      isLoading: isLoadingMe,
      error: errorMe,
    };
  }

  return {
    user,
    isLoading: isLoadingUser,
    error: errorUser,
  };
}
