document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const dotsContainer = document.querySelector(".carousel-dots");

  let currentIndex = 0;
  let interval = null;
  const autoDelay = 3000;
  let isHovering = false;
  let startX = 0;

  // Lazy-load images
  slides.forEach(slide => {
    const img = slide.querySelector("img");
    if (img.dataset.src) img.src = img.dataset.src;
  });

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    // Calculate offset dynamically based on first slide width
    const slideWidth = slides[0].getBoundingClientRect().width + 16; // 16px gap
    const offset = -currentIndex * slideWidth;
    track.style.transform = `translateX(${offset}px)`;
    updateDots();
  }

  function updateDots() {
    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentIndex % dots.length].classList.add("active");
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAuto() {
    interval = setInterval(() => {
      if (!isHovering) nextSlide();
    }, autoDelay);
  }

  function stopAuto() {
    clearInterval(interval);
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  nextBtn.addEventListener("click", () => { nextSlide(); resetAuto(); });
  prevBtn.addEventListener("click", () => { prevSlide(); resetAuto(); });

  track.addEventListener("mouseenter", () => isHovering = true);
  track.addEventListener("mouseleave", () => isHovering = false);

  // Swipe support
  track.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  track.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX;
    if (delta > 50) prevSlide();
    else if (delta < -50) nextSlide();
    resetAuto();
  });

  // Initialize
  goToSlide(0);
  startAuto();
});
