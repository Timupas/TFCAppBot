window.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  const countElem = document.getElementById("count");
  const scoreDisplay = document.getElementById("score-display");
  const clickable = document.getElementById("clickable");
  const container = document.getElementById("app-container");
  const rankDisplay = document.getElementById("rank-display");

  let count = 0;
  let currentRank = "bronze";

  const ranks = [
    { name: "Бронза", class: "bronze", min: 0, value: 1 },
    { name: "Серебро", class: "silver", min: 1000, value: 3 },
    { name: "Золото", class: "gold", min: 5000, value: 5 },
    { name: "Алмаз", class: "diamond", min: 10000, value: 10 },
    { name: "Платина", class: "platinum", min: 25000, value: 25 }
  ];

  function updateRank() {
    const newRank = ranks.slice().reverse().find(rank => count >= rank.min);
    if (newRank && newRank.class !== currentRank) {
      container.className = `container ${newRank.class}`;
      clickable.className = `${newRank.class}`;
      rankDisplay.textContent = newRank.name;
      currentRank = newRank.class;
    }
  }

  clickable?.addEventListener("click", (e) => {
    clickable.classList.add("clicked");
    setTimeout(() => clickable.classList.remove("clicked"), 100);

    const rank = ranks.slice().reverse().find(rank => count >= rank.min);
    const addValue = rank ? rank.value : 1;
    count += addValue;

    countElem.textContent = count;
    scoreDisplay.textContent = count;

    updateRank();

    const flying = document.createElement("div");
    flying.className = "flying-one";
    flying.textContent = `+${addValue}`;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    flying.style.left = `${x}px`;
    flying.style.top = `${y}px`;
    container.appendChild(flying);
    setTimeout(() => flying.remove(), 1000);
  });

  // === 📌 Обработка бонусных карточек ===
  document.querySelectorAll(".bonus-card").forEach(card => {
    card.addEventListener("click", () => {
      count += 100;
      countElem.textContent = count;
      scoreDisplay.textContent = count;
      card.remove(); // Удалить карточку после клика
      updateRank();
    });
  });

  // === 🪙 Обработка кнопки "Привязать кошелёк" ===
  const walletBtn = document.getElementById("connect-wallet");
  if (walletBtn) {
    walletBtn.addEventListener("click", () => {
      alert("Заглушка: здесь будет привязка кошелька.");
      // Здесь можно вставить логику подключения крипто-кошелька
    });
  }

  // === 👤 Telegram WebApp user (аватар и имя) ===
  const user = tg.initDataUnsafe?.user;
  if (user) {
    const fullName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    const avatarUrl = `https://t.me/i/userpic/320/${user.username}.jpg`;

    const usernameElem = document.getElementById("username");
    const avatarElem = document.getElementById("avatar");
    if (usernameElem) usernameElem.textContent = fullName;
    if (avatarElem) avatarElem.src = avatarUrl;

    const accountAvatar = document.getElementById("account-avatar");
    const accountUsername = document.getElementById("account-username");
    if (accountAvatar) accountAvatar.src = avatarUrl;
    if (accountUsername) accountUsername.textContent = fullName;
  }

  // === 🔄 Переключение вкладок ===
  document.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.tab;
      if (!tabId) return;

      document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

      const activeTab = document.getElementById(tabId);
      if (activeTab) activeTab.classList.add("active");

      button.classList.add("active");
    });
  });
});
