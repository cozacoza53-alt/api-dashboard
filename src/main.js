import confetti from 'canvas-confetti';
import { fetchUsers, createUser, deleteUser, fetchNotFound } from './apiService.js';

const btnLoad = document.querySelector('#btn-load');
const btnError = document.querySelector('#btn-error');
const userForm = document.querySelector('#user-form');
const inputName = document.querySelector('#input-name');
const inputEmail = document.querySelector('#input-email');
const statusBox = document.querySelector('#status-box');
const userList = document.querySelector('#user-list');

let users = [];

function setLoading(isLoading) {
  btnLoad.disabled = isLoading;
  btnError.disabled = isLoading;
  const submitBtn = userForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = isLoading;

  if (isLoading) {
    statusBox.style.color = '#1e293b';
    statusBox.style.background = 'transparent';
    statusBox.style.padding = '0';
    statusBox.textContent = '⏳ Завантаження даних із сервера...';
  }
}

function showError(message) {
  statusBox.style.color = '#991b1b';
  statusBox.style.background = '#fee2e2';
  statusBox.style.padding = '10px';
  statusBox.style.borderRadius = '6px';
  statusBox.textContent = `❌ ${message}`;
}

function clearLoadingText() {
  if (statusBox.textContent.startsWith('⏳')) {
    statusBox.textContent = '';
    statusBox.style.background = 'transparent';
    statusBox.style.padding = '0';
  }
}

function renderUsers(list) {
  userList.innerHTML = '';

  list.forEach((user) => {
    const li = document.createElement('li');
    li.style.cssText =
      'border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; background: #fff;';

    const city = user.address?.city ?? 'Не вказано';
    const company = user.company?.name ?? 'Власний проєкт / Не вказано';

    li.innerHTML = `
      <div>
        <div><strong>${user.name}</strong> <span style="color: #64748b;">(ID: ${user.id})</span></div>
        <div>📧 ${user.email}</div>
        <div>🏙️ Місто: ${city} | 🏢 Компанія: ${company}</div>
      </div>
      <button class="btn-delete" data-id="${user.id}" style="background: #ef4444; color: #fff; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer;">
        🗑️ Видалити
      </button>
    `;

    userList.appendChild(li);
  });
}

btnLoad.addEventListener('click', async () => {
  setLoading(true);
  try {
    users = await fetchUsers();
    renderUsers(users);
  } catch (error) {
    showError(error.message || 'Сталася невідома помилка під час завантаження');
  } finally {
    clearLoadingText();
    setLoading(false);
  }
});

userForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const newUserData = {
    name: inputName.value.trim(),
    email: inputEmail.value.trim(),
    address: { city: 'Миколаїв' },
    company: { name: 'Local Demo Co.' },
  };

  setLoading(true);
  try {
    const createdUser = await createUser(newUserData);
    const userForUi = {
      ...createdUser,
      id: Date.now(),
      address: createdUser.address ?? newUserData.address,
      company: createdUser.company ?? newUserData.company,
    };

    users = [userForUi, ...users];
    renderUsers(users);
    userForm.reset();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  } catch (error) {
    showError(error.message || 'Помилка під час створення користувача');
  } finally {
    clearLoadingText();
    setLoading(false);
  }
});

userList.addEventListener('click', async (event) => {
  const btn = event.target.closest('.btn-delete');
  if (!btn) return;

  const userId = Number(btn.dataset.id);
  setLoading(true);
  try {
    await deleteUser(userId);
    users = users.filter((u) => u.id !== userId);
    renderUsers(users);
  } catch (error) {
    showError(error.message || 'Помилка під час видалення');
  } finally {
    clearLoadingText();
    setLoading(false);
  }
});

btnError.addEventListener('click', async () => {
  setLoading(true);
  try {
    await fetchNotFound();
  } catch (error) {
    showError(error.message);
  } finally {
    clearLoadingText();
    setLoading(false);
  }
});