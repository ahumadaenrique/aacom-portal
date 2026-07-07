document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Scroll Animations using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-fade-in-up');
  animatedElements.forEach(el => observer.observe(el));

  // Carousel Logic (Dynamic Loader)
  const track = document.getElementById('dynamic-carousel-track');
  const indicatorsContainer = document.getElementById('dynamic-carousel-indicators');
  
  if (track && indicatorsContainer) {
    const maxPhotos = 10;
    let loadedSlides = 0;

    // Títulos por defecto para las primeras 3 (opcional)
    const captions = [
      { title: "Nuestro Equipo", desc: "Personas apasionadas trabajando juntas para garantizar tu éxito y tranquilidad." },
      { title: "Logros y Reconocimientos", desc: "Más de 20 años de experiencia que nos respaldan como líderes." },
      { title: "Instalaciones de Primer Nivel", desc: "Operamos con las mejores herramientas desde nuestras oficinas." }
    ];

    function checkImage(index) {
      const extensions = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
      return new Promise((resolve) => {
        let i = 0;
        function tryNext() {
          if (i >= extensions.length) {
            resolve(null);
            return;
          }
          const src = `assets/foto${index}.${extensions[i]}`;
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => {
            i++;
            tryNext();
          };
          img.src = src;
        }
        tryNext();
      });
    }

    async function loadCarousel() {
      for (let i = 1; i <= maxPhotos; i++) {
        const validSrc = await checkImage(i);
        if (validSrc) {
          const slideDiv = document.createElement('div');
          slideDiv.className = `carousel-slide ${loadedSlides === 0 ? 'active' : ''}`;
          
          const imgEl = document.createElement('img');
          imgEl.src = validSrc;
          imgEl.alt = `Fotografía ${i}`;
          slideDiv.appendChild(imgEl);

          // Agregar texto a las primeras si hay disponibles
          const caption = captions[i-1];
          if (caption) {
            const capDiv = document.createElement('div');
            capDiv.className = 'carousel-caption';
            capDiv.innerHTML = `<h3 class="text-2xl font-bold mb-2">${caption.title}</h3><p>${caption.desc}</p>`;
            slideDiv.appendChild(capDiv);
          }

          track.appendChild(slideDiv);

          const indBtn = document.createElement('button');
          indBtn.className = `indicator ${loadedSlides === 0 ? 'active' : ''}`;
          indBtn.setAttribute('data-slide', loadedSlides);
          indicatorsContainer.appendChild(indBtn);

          loadedSlides++;
        }
      }
      initCarousel(loadedSlides);
    }

    function initCarousel(totalSlides) {
      if (totalSlides === 0) {
        track.innerHTML = `
          <div class="carousel-slide active">
            <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#eee; color:#666;">
              <p>Sube imágenes nombradas foto1.jpg, foto2.jpg... hasta foto10 en la carpeta assets</p>
            </div>
          </div>`;
        return;
      }

      let currentIndex = 0;
      const slides = Array.from(track.children);
      const nextBtn = document.querySelector('.carousel-btn.next');
      const prevBtn = document.querySelector('.carousel-btn.prev');
      const indicators = document.querySelectorAll('.indicator');
      
      function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        indicators.forEach((ind, index) => {
          ind.classList.toggle('active', index === currentIndex);
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
          updateCarousel();
        });
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
          updateCarousel();
        });
      }
      
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
      });

      setInterval(() => {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateCarousel();
      }, 5000);
    }

    loadCarousel();
  }
});
