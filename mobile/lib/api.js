const API_URL = "https://ekinay-smart-agriculture-system.onrender.com";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();
  return { response, data };
}

export default API_URL;