// src/api/analyticsAPI.js

export const BASE_URL = "https://breevo-backend.onrender.com";

export async function fetchWithAuth(endpoint, payload = {}) {
  const token = localStorage.getItem("user_token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}
