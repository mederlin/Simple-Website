let current = 0;

const hero = document.getElementById("hero");
const title = document.getElementById("hero-title");
const info = document.getElementById("hero-info");
const dotsContainer = document.getElementById("hero-dots");

const overlay = document.querySelector(".hero-overlay");
const videoContainer = document.getElementById("hero-video-container");
const video = document.getElementById("hero-video");
const videoSource = document.getElementById("hero-video-source");
const closeBtn = document.getElementById("close-video-btn");

const videoPopup = document.getElementById("video-popup");
const popupVideo = document.getElementById("popup-video");
const popupVideoSource = document.getElementById("popup-video-source");
const popupCloseBtn = document.getElementById("popup-close-btn");

let autoCloseTimer;
let isUserSeeking = false;
let hasUserSeeked = false;
let playbackStartTime = 0;

function createDots() {
  dotsContainer.innerHTML = "";
  movies.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "hero-dot";
    dot.onclick = () => {
      current = i;
      closeTrailer();
      updateHero();
    };
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  document.querySelectorAll(".hero-dot").forEach((d, i) => {
    d.classList.toggle("active", i === current);
  });
}

function updateHero() {
  overlay.classList.remove("fade-in");
  overlay.classList.add("fade-out");
  setTimeout(() => {
    hero.style.backgroundImage = `url(images/${movies[current].hero_image})`;
    title.textContent = movies[current].title;
    info.textContent =
      `${movies[current].year} • ${movies[current].rating} • ${movies[current].duration} • ${movies[current].genre}`;
    updateDots();
    overlay.classList.remove("fade-out");
    overlay.classList.add("fade-in");
    overlay.style.display = "flex";
  }, 300);
}

function nextMovie() {
  closeTrailer();
  current = (current + 1) % movies.length;
  updateHero();
}

function prevMovie() {
  closeTrailer();
  current = (current - 1 + movies.length) % movies.length;
  updateHero();
}

video.addEventListener("seeking", () => {
  isUserSeeking = true;
});

video.addEventListener("seeked", () => {
  isUserSeeking = false;
  hasUserSeeked = true;
  clearTimeout(autoCloseTimer);
});

video.addEventListener("ended", () => {
  closeTrailer();
});

video.addEventListener("timeupdate", () => {
  if (hasUserSeeked || isUserSeeking) return;
  
  const elapsedTime = Date.now() - playbackStartTime;
  if (elapsedTime >= 60000) {
    closeTrailer();
  }
});

function openTrailer() {
  videoSource.src = `trailers/${movies[current].trailer}`;
  video.load();
  videoContainer.style.display = "block";
  videoContainer.style.opacity = 0;
  overlay.classList.add("fade-out");
  
  setTimeout(() => {
    videoContainer.style.transition = "opacity 0.5s ease";
    videoContainer.style.opacity = 1;
  }, 50);
  
  hasUserSeeked = false;
  playbackStartTime = Date.now();
  video.play();
}

function closeTrailer() {
  clearTimeout(autoCloseTimer);
  
  videoContainer.style.transition = "opacity 1s ease";
  videoContainer.style.opacity = 0;
  
  setTimeout(() => {
    video.pause();
    videoSource.src = "";
    video.load();
    video.currentTime = 0;
    videoContainer.style.display = "none";
    overlay.classList.remove("fade-out");
    overlay.classList.add("fade-in");
  }, 1000);
}

closeBtn.onclick = closeTrailer;

function openPopup(trailerFile) {
  popupVideoSource.src = `trailers/${trailerFile}`;
  popupVideo.load();
  videoPopup.classList.add("active");
  popupVideo.play();
}

function closePopup() {
  videoPopup.classList.remove("active");
  popupVideo.pause();
  popupVideoSource.src = "";
  popupVideo.load();
  popupVideo.currentTime = 0;
}

popupCloseBtn.onclick = closePopup;

videoPopup.addEventListener("click", (e) => {
  if (e.target === videoPopup) {
    closePopup();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && videoPopup.classList.contains("active")) {
    closePopup();
  }
});

createDots();
updateHero();

function playFromCard(movieId) {
  const movie = movies.find(m => m.id == movieId);
  if (!movie) return;

  openPopup(movie.trailer);
}
