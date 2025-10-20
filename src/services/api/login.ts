export const BASE_URL = "http://127.0.0.1:8000";

type loginResponse = {
  token: string;
  code?: number;
  message?: string;
}

export async function login(username: string, password: string): Promise<loginResponse>
{
  const response = await fetch(`${BASE_URL}/api/auth`, {
    method: "POST",
    body: JSON.stringify({ nickname: username, password }),
    headers: {
      "Content-Type": "application/ld+json",
    },
  });

  return await response.json();
}
