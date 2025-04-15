window.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram.WebApp;
    const countElem = document.getElementById("count");
    const clickable = document.getElementById("clickable");
    let count = 0;
  
    // Расширяем WebApp
    tg.expand();
  
    // Устанавливаем имя и аватар
    const user = tg.initDataUnsafe?.user;
    if (user) {
      document.getElementById("username").textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
      document.getElementById("avatar").src = `https://t.me/i/userpic/320/${user.username}.jpg`;
    }
  
    // Счётчик на клик
    clickable.addEventListener("click", () => {
      count++;
      countElem.textContent = count;
    });
  });
  