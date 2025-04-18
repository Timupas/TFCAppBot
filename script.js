window.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  const countElem = document.getElementById("count");
  const scoreDisplay = document.getElementById("score-display");
  const clickable = document.getElementById("clickable");
  const container = document.getElementById("app-container");
  const rankDisplay = document.getElementById("rank-display");
  const usernameDisplay = document.getElementById("username");

  let count = 0;
  let currentRank = "bronze";
  let clickMultiplier = 1;
  let robotEnabled = false;
  let multiClickEnabled = false;
  let boostTimeout;

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

  clickable.addEventListener("click", (e) => {
    clickable.classList.add("clicked");
    setTimeout(() => clickable.classList.remove("clicked"), 100);

    let baseValue = ranks.slice().reverse().find(rank => count >= rank.min)?.value || 1;
    let bonus = multiClickEnabled ? 3 : 0;
    let added = (baseValue + bonus) * clickMultiplier;

    count += added;
    countElem.textContent = count;
    scoreDisplay.textContent = count;
    updateRank();

    const flying = document.createElement("div");
    flying.className = "flying-one";
    flying.textContent = `+${added}`;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    flying.style.left = `${x}px`;
    flying.style.top = `${y}px`;
    container.appendChild(flying);
    setTimeout(() => flying.remove(), 1000);
  });

  // Мини карточки бонуса
  document.querySelectorAll(".bonus-card").forEach(card => {
    let clickedOnce = false;
    card.addEventListener("click", () => {
      if (!clickedOnce) {
        clickedOnce = true;
        card.classList.add("half-clicked");
        window.open("https://t.me/tfcmemecoin", "_blank");
      } else {
        card.remove();
        count += 100;
        countElem.textContent = count;
        scoreDisplay.textContent = count;
        updateRank();
      }
    });
  });

  // Улучшения
  const upgradeBtns = document.querySelectorAll(".upgrade-btn");

  upgradeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      if (btn.classList.contains("disabled")) return;

      if (type === "boost" && count >= 100) {
        count -= 100;
        clickMultiplier = 10;
        btn.classList.add("disabled");
        setTimeout(() => {
          clickMultiplier = 1;
          btn.classList.remove("disabled");
        }, 5 * 60 * 1000);
      }

      if (type === "robot" && count >= 150 && !robotEnabled) {
        count -= 150;
        robotEnabled = true;
        btn.classList.add("disabled");
        setInterval(() => {
          count += 1;
          countElem.textContent = count;
          scoreDisplay.textContent = count;
          updateRank();
        }, 1000);
      }

      if (type === "multi" && count >= 200 && !multiClickEnabled) {
        count -= 200;
        multiClickEnabled = true;
        btn.classList.add("disabled");
      }

      countElem.textContent = count;
      scoreDisplay.textContent = count;
      updateRank();
    });
  });

  // Telegram WebApp user
  const user = tg.initDataUnsafe?.user;
  if (user) {
    usernameDisplay.textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById("avatar").src = `https://t.me/i/userpic/320/${user.username}.jpg`;
    const accountAvatar = document.getElementById("account-avatar");
    const accountName = document.getElementById("account-username");
    if (accountAvatar) accountAvatar.src = `https://t.me/i/userpic/320/${user.username}.jpg`;
    if (accountName) accountName.textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
  }

  // Переключение вкладок
  document.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
      document.getElementById(button.dataset.tab).classList.add("active");
      button.classList.add("active");
    });
  });
});