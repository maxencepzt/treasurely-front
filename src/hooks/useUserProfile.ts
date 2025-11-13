import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import type { User } from '../types/api';

export function useUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/users/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('User not found');
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return { user, loading, error };
}
