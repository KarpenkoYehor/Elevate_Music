// Музичний плеєр з розширеним функціоналом
let currentAudio = null;
let currentCard = null;
let isPlaying = false;
let currentTrackIndex = 0;

// Дані треків для міні-плеєра
const tracks = [
  {
    title: "Заплутались",
    artist: "TWY",
    cover: "img/track1.jpg",
    audio: "audio/music1.mp3",
  },
  {
    title: "Хвилини",
    artist: "Lexmar",
    cover: "img/track2.jpg",
    audio: "audio/LEXMAR - Хвилини.mp3",
  },
  {
    title: "Опіум",
    artist: "Lika Gavar",
    cover: "img/track3.jpeg",
    audio: "audio/track3.wav",
  },
  {
    title: "Glitch",
    artist: "GLITCH",
    cover: "img/track4.jpg",
    audio: "audio/track4.wav",
  },
];

function playTrack(card) {
  const audio = card.querySelector("audio");
  if (!audio) {
    showNotification("Помилка: Аудіо не знайдено", "error");
    return;
  }

  const source = audio.getAttribute("src");
  if (!source) {
    showNotification("Вкажіть шлях до аудіо файлу", "error");
    return;
  }

  // Якщо грає цей самий трек
  if (currentAudio === audio) {
    if (audio.paused) {
      playAudio(audio, card);
      showMiniPlayer();
      updateMiniPlayer(card);
    } else {
      pauseAudio(audio, card);
    }
  } else {
    // Зупиняємо попередній трек
    if (currentAudio) {
      pauseAudio(currentAudio, currentCard);
    }

    // Граємо новий
    currentAudio = audio;
    currentCard = card;
    playAudio(audio, card);
    showMiniPlayer();
    updateMiniPlayer(card);
  }

  // Коли трек закінчився
  audio.onended = function () {
    card.classList.remove("playing");
    updateIcon(card, false);
    currentAudio = null;
    currentCard = null;
    isPlaying = false;
    document.querySelector(".floating-player")?.classList.remove("active");
  };
}

function playAudio(audio, card) {
  audio
    .play()
    .then(() => {
      card.classList.add("playing");
      updateIcon(card, true);
      isPlaying = true;
      addWaveAnimation(card);
    })
    .catch((error) => {
      console.error("Помилка відтворення:", error);
      showNotification("Не вдалося відтворити аудіо", "error");
    });
}

function pauseAudio(audio, card) {
  audio.pause();
  card.classList.remove("playing");
  updateIcon(card, false);
  isPlaying = false;
  removeWaveAnimation(card);
}

function updateIcon(card, playing) {
  const iconPlay = card.querySelector(".icon-play");
  const iconPause = card.querySelector(".icon-pause");

  if (iconPlay && iconPause) {
    iconPlay.style.display = playing ? "none" : "block";
    iconPause.style.display = playing ? "block" : "none";
  }
}

function addWaveAnimation(card) {
  const waveHtml = `
        <div class="wave-animation">
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
        </div>
    `;
  const trackInfo = card.querySelector(".track-info");
  if (trackInfo && !trackInfo.querySelector(".wave-animation")) {
    trackInfo.insertAdjacentHTML("beforeend", waveHtml);
  }
}

function removeWaveAnimation(card) {
  const wave = card.querySelector(".wave-animation");
  if (wave) wave.remove();
}

// Міні-плеєр функції
function showMiniPlayer() {
  const miniPlayer = document.querySelector(".floating-player");
  if (miniPlayer) {
    miniPlayer.classList.add("active");
  }
}

function updateMiniPlayer(card) {
  const title = card.querySelector("h3")?.textContent || "Невідомо";
  const artist = card.querySelector("p")?.textContent || "Невідомо";
  const cover = card.querySelector("img")?.src || "img/track1.jpg";

  document.getElementById("mini-title").textContent = title;
  document.getElementById("mini-artist").textContent = artist;
  document.getElementById("mini-cover-img").src = cover;
}

function toggleMiniPlayer() {
  if (currentAudio) {
    if (currentAudio.paused) {
      playAudio(currentAudio, currentCard);
    } else {
      pauseAudio(currentAudio, currentCard);
    }
  }
}

function prevMiniTrack() {
  // Логіка перемикання на попередній трек
  const cards = document.querySelectorAll(".track-card");
  const currentIndex = Array.from(cards).indexOf(currentCard);
  const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
  playTrack(cards[prevIndex]);
}

function nextMiniTrack() {
  const cards = document.querySelectorAll(".track-card");
  const currentIndex = Array.from(cards).indexOf(currentCard);
  const nextIndex = (currentIndex + 1) % cards.length;
  playTrack(cards[nextIndex]);
}

// Анімації при скролі
document.addEventListener("DOMContentLoaded", function () {
  // Спостерігач для анімації елементів
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document
    .querySelectorAll(
      ".service-card, .track-card, .pricing-card, .dist-item, .feature-box, .contact-card",
    )
    .forEach((el) => {
      el.classList.add("fade-in-up");
      observer.observe(el);
    });

  // Кнопка "Вгору"
  const backToTopBtn = document.getElementById("backToTopBtn");
  window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("show", window.scrollY > 500);
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Частинки фону
  createParticles();

  // Паралакс ефект
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(".parallax-section");
    parallaxElements.forEach((el) => {
      const speed = el.dataset.speed || 0.5;
      el.style.setProperty("--parallax-offset", `${scrolled * speed}px`);
    });
  });

  // Модальне вікно
  document.querySelectorAll(".pricing-btn, .hero-button").forEach((btn) => {
    if (!btn.href.includes("t.me")) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("modalOverlay").classList.add("active");
      });
    }
  });

  // Форма замовлення
  document
    .getElementById("orderForm")
    ?.addEventListener("submit", function (e) {
      e.preventDefault();
      showNotification(
        "Заявка відправлена! Ми зв'яжемося з вами протягом 24 годин.",
        "success",
      );
      closeModal();
      setTimeout(() => this.reset(), 500);
    });
});

// Створення частинок
function createParticles() {
  const container = document.querySelector(".particles-container");
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    const size = Math.random() * 20 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.opacity = Math.random() * 0.3 + 0.1;

    container.appendChild(particle);
  }
}

// Модальне вікно
function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
}

// Сповіщення
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "error" ? "#ff4757" : type === "success" ? "#2ed573" : "#1e90ff"};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Додайте ці анімації в CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification {
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        font-weight: 500;
    }
`;
document.head.appendChild(style);
