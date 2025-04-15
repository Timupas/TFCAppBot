window.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  const countElem = document.getElementById("count");
  const clickable = document.getElementById("clickable");
  const container = document.querySelector(".container");
  let count = 0;

  tg.expand();

  const user = tg.initDataUnsafe?.user;
  if (user) {
    document.getElementById("username").textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById("avatar").src = `https://t.me/i/userpic/320/${user.username}.jpg`;
  }

  clickable.addEventListener("click", (e) => {
    // Анимация нажатия
    clickable.classList.add("clicked");
    setTimeout(() => clickable.classList.remove("clicked"), 100);

    // Обновляем счётчик
    count++;
    countElem.textContent = count;

    // Анимация "летящей 1"
    const flying = document.createElement("div");
    flying.className = "flying-one";
    flying.textContent = "+1";

    // Позиция клика относительно контейнера
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    flying.style.left = `${x}px`;
    flying.style.top = `${y}px`;

    container.appendChild(flying);

    // Удаляем после анимации
    setTimeout(() => flying.remove(), 1000);
  });
});
