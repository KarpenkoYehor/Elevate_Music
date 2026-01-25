let currentAudio = null;
let currentCard = null;

function playTrack(card) {
  console.log("--- Початок обробки кліку ---");

  // 1. Шукаємо аудіо тег всередині картки
  const audio = card.querySelector("audio");

  if (!audio) {
    alert("ПОМИЛКА: В HTML коді цієї картки немає тегу <audio>!");
    return;
  }

  // 2. Перевіряємо, чи вказано шлях до файлу
  const source = audio.getAttribute("src");
  if (!source || source === "") {
    alert("ПОМИЛКА: В тегу <audio> пустий атрибут src! Вкажіть шлях до файлу.");
    return;
  }

  console.log("Спроба відтворити файл:", source);

  // 3. Логіка перемикання (якщо це та сама пісня)
  if (currentAudio === audio) {
    if (audio.paused) {
      safePlay(audio, card);
    } else {
      audio.pause();
      updateIcon(card, false);
      card.classList.remove("playing");
    }
  }
  // 4. Логіка перемикання (якщо це нова пісня)
  else {
    // Зупиняємо попередню
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if (currentCard) {
        updateIcon(currentCard, false);
        currentCard.classList.remove("playing");
      }
    }

    // Готуємо нову
    currentAudio = audio;
    currentCard = card;
    safePlay(audio, card);
  }

  // Коли пісня закінчиться
  audio.onended = function () {
    card.classList.remove("playing");
    updateIcon(card, false);
    currentAudio = null;
    currentCard = null;
  };
}

// Функція безпечного запуску
function safePlay(audio, card) {
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then((_) => {
        // Успіх!
        card.classList.add("playing");
        updateIcon(card, true);
      })
      .catch((error) => {
        console.error("Помилка відтворення:", error);

        // Розшифровка помилок для вас
        if (error.name === "NotAllowedError") {
          alert("Браузер заблокував звук. Спробуйте клікнути ще раз.");
        } else if (error.name === "NotSupportedError") {
          alert("Формат файлу не підтримується або шлях неправильний.");
        } else {
          alert(
            "Не вдалося завантажити файл: " +
              audio.getAttribute("src") +
              "\n\nПеревірте:\n1. Чи лежить файл поруч з index.html?\n2. Чи точно збігається назва (великі/малі літери)?",
          );
        }
      });
  }
}

// Функція оновлення іконок (Play/Pause)
function updateIcon(card, isPlaying) {
  // Ця частина працює через CSS класи .playing,
  // але для надійності можна додати примусове перемикання,
  // якщо CSS раптом не спрацює.
}
