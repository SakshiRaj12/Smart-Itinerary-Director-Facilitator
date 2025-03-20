const seasonalDestinations = {
  winter: [
    {
      image: "https://www.holidify.com/images/bgImages/AULI.jpg",
      name: "Auli",
      perfect: "Perfect for: Skiing & Snow Adventures",
      weather: "-2°C - 7°C",
    },
    {
      image: "https://www.holidify.com/images/bgImages/CHOPTA.jpg",
      name: "Chopta",
      perfect: "Perfect for: Snow Trek to Tungnath",
      weather: "-5°C - 10°C",
    },
    {
      image: "https://www.holidify.com/images/bgImages/ANDAMAN.jpg",
      name: "Andaman",
      perfect: "Perfect for: Beach Holiday",
      weather: "23°C - 30°C",
    },
  ],
  spring: [
    {
      image: "https://www.holidify.com/images/bgImages/VALLEY-OF-FLOWERS.jpg",
      name: "Valley of Flowers",
      perfect: "Perfect for: Floral Landscapes",
      weather: "15°C - 25°C",
    },
    {
      image: "https://www.holidify.com/images/bgImages/DARJEELING.jpg",
      name: "Darjeeling",
      perfect: "Perfect for: Tea Gardens & Mountain Views",
      weather: "10°C - 20°C",
    },
    {
      image: "https://www.holidify.com/images/bgImages/RISHIKESH.jpg",
      name: "Rishikesh",
      perfect: "Perfect for: River Rafting",
      weather: "20°C - 35°C",
    },
  ],
  summer: [
    {
      image: "https://www.holidify.com/images/bgImages/LADAKH.jpg",
      name: "Ladakh",
      perfect: "Perfect for: High Altitude Adventures",
      weather: "10°C - 25°C",
    },
    {
      image: "https://www.holidify.com/images/bgImages/MANALI.jpg",
      name: "Manali",
      perfect: "Perfect for: Mountain Escapes",
      weather: "15°C - 30°C",
    },
    {
      image: "https://www.holidify.com/images/bgImages/COORG.jpg",
      name: "Coorg",
      perfect: "Perfect for: Coffee Plantations",
      weather: "20°C - 35°C",
    },
  ],
  monsoon: [
    {
      image: "https://www.holidify.com/images/bgImages/MUNNAR.jpg",
      name: "Munnar",
      perfect: "Perfect for: Tea Plantations in Rain",
      weather: "19°C - 28°C",
    },
    {
      image: "https://www.holidify.com/images/bgImages/LONAVALA.jpg",
      name: "Lonavala",
      perfect: "Perfect for: Waterfalls & Greenery",
      weather: "23°C - 32°C",
    },
    {
      image: "https://www.holidify.com/images/bgImages/UDAIPUR.jpg",
      name: "Udaipur",
      perfect: "Perfect for: Lake Views",
      weather: "25°C - 35°C",
    },
  ],
};

AOS.init({
  duration: 800,
  offset: 100,
});

// Initialize Swiper
new Swiper(".hero-slider", {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
});
// Navbar scroll effect
window.addEventListener("scroll", () => {
  document
    .querySelector(".navbar")
    .classList.toggle("scrolled", window.scrollY > 50);
});

function updateDestinations(season) {
  const placesGrid = document.querySelector(".places-grid");
  const destinations = seasonalDestinations[season];

  placesGrid.innerHTML = destinations
    .map(
      (dest) => `
        <div class="place-card" data-aos="fade-up">
            <img src="${dest.image}" alt="${dest.name}">
            <div class="place-content">
                <h3>${dest.name}</h3>
                <p>${dest.perfect}</p>
                <div class="weather">🌡️ ${dest.weather}</div>
            </div>
        </div>
    `
    )
    .join("");
}

const destinationCarousel = new Swiper(".destination-carousel", {
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    document
      .querySelectorAll(".tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    // Add active class to clicked button
    button.classList.add("active");

    // Update destinations and reinitialize swiper
    updateDestinations(button.dataset.season);
    destinationCarousel.update();
    destinationCarousel.slideToLoop(0); // Reset to first slide
  });
});

// Initialize with winter destinations
updateDestinations("winter");

document
  .querySelector(".trip-planner-container")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Handle form submission
  });

// Function to handle language changes
function handleLanguageChange(value) {
  try {
    // Find the Google Translate select element
    const googleTranslateSelect = document.querySelector(".goog-te-combo");

    if (!googleTranslateSelect) {
      console.error("Google Translate widget not found");
      return;
    }

    // Map our language codes to Google Translate codes if needed
    const languageMap = {
      en: "en",
      hi: "hi",
      es: "es",
      fr: "fr",
      de: "de",
      ja: "ja",
      zh: "zh-CN",
    };

    // Get the corresponding Google Translate language code
    const translateCode = languageMap[value] || value;

    // Set the value and trigger the change event
    googleTranslateSelect.value = translateCode;
    googleTranslateSelect.dispatchEvent(new Event("change"));

    // Save language preference
    localStorage.setItem("preferredLanguage", value);

    console.log(`Language changed to: ${value}`);
  } catch (error) {
    console.error("Error changing language:", error);
  }
}

// Initialize with saved language preference on page load
document.addEventListener("DOMContentLoaded", function () {
  const savedLanguage = localStorage.getItem("preferredLanguage");
  if (savedLanguage) {
    // Set the visible select value
    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect) {
      languageSelect.value = savedLanguage;
    }

    // Wait a bit for Google Translate to initialize
    setTimeout(() => {
      handleLanguageChange(savedLanguage);
    }, 1000);
  }
});

// Add styles to hide Google Translate elements but keep functionality
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .goog-te-banner-frame,
  .goog-te-balloon-frame {
    display: none !important;
  }
  .goog-te-gadget {
    font-size: 0 !important;
  }
  .goog-te-gadget .goog-te-combo {
    display: none !important;
  }
  .VIpgJd-ZVi9od-l4eHX-hSRGPd {
    display: none !important;
  }
  body {
    top: 0 !important;
  }
  .goog-tooltip,
  .goog-tooltip:hover {
    display: none !important;
  }
  .goog-text-highlight {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
`;
document.head.appendChild(styleSheet);
