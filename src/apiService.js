const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchUsers = async () => {
  await delay(800);
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) {
    throw new Error(`Помилка завантаження! HTTP статус: ${response.status}`);
  }
  return await response.json();
};

export const createUser = async (newUserData) => {
  await delay(500);
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUserData),
  });

  if (!response.ok) {
    throw new Error(`Не вдалося створити користувача! HTTP статус: ${response.status}`);
  }
  return await response.json();
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Не вдалося видалити користувача! HTTP статус: ${response.status}`);
  }
  return true;
};

export const fetchNotFound = async () => {
  const response = await fetch(`${BASE_URL}/unknown-route-999`);
  if (!response.ok) {
    throw new Error(`Помилка 404: ресурс не знайдено (HTTP ${response.status})`);
  }
  return await response.json();
};