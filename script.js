window.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  const countElem = document.getElementById("count");
  const scoreDisplay = document.getElementById("score-display");
  const clickable = document.getElementById("clickable");
  const container = document.getElementById("app-container");
  const rankDisplay = document.getElementById("rank-display");
  document.getElementById("rating-tab").addEventListener("click", (event) => {
    const card = event.target.closest(".clickable-reward");
    if (card) {
      const reward = parseInt(card.dataset.value, 10) || 0;
      count += reward;
      countElem.textContent = count;
      scoreDisplay.textContent = count;
      updateRank();
      card.remove();
    }
  });
  

  let count = 0;
  let currentRank = "bronze";

  const ranks = [
    { name: "Бронза", class: "bronze", min: 0, value: 1 },
    { name: "Серебро", class: "silver", min: 310, value: 3 },
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

  clickable.addEventListener("click", (e) => {
    // Анимация клика
    clickable.classList.add("clicked");
    setTimeout(() => clickable.classList.remove("clicked"), 100);

    // Получаем текущий множитель
    const rank = ranks.slice().reverse().find(rank => count >= rank.min);
    const addValue = rank ? rank.value : 1;
    count += addValue;

    countElem.textContent = count;
    scoreDisplay.textContent = count;

    updateRank();

    // Анимация "+N"
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

  // Telegram WebApp user
  const user = tg.initDataUnsafe?.user;
  if (user) {
    document.getElementById("username").textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById("avatar").src = `https://t.me/i/userpic/320/${user.username}.jpg`;
  }

  // Переключение вкладок
  document.querySelectorAll(".tab-button").forEach(button => {
    document.querySelectorAll(".clickable-reward").forEach(card => {
      card.addEventListener("click", () => {
        count += 100;
        countElem.textContent = count;
        scoreDisplay.textContent = count;
        updateRank();
        card.remove(); // Удалить карточку после клика
      });
    });
    
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
      document.getElementById(button.dataset.tab).classList.add("active");
      button.classList.add("active");
    });
  });
});
