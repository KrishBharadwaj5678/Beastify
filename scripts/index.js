import { animalsData, animalPoster } from "../constants/beastify.js";
import { share } from "../utils/share.js";
import { screenshot } from "../utils/screenshot.js";
import {
  correctSound,
  incorrectSound,
  victorySound,
} from "../constants/beastify.js";
import { confettiCelebration } from "../utils/confettiCelebration.js";

const modelViewer = document.querySelector("model-viewer");
const toggleButton = document.getElementById("toggle-skybox-button");
const hornButton = document.getElementById("horn-button");
const infoButton = document.getElementById("info-button");
const infoBox = document.getElementById("info-box");
const animalFact = document.getElementById("animal-fact");
const animalName = document.querySelector("h3.animal-name");
const playButton = document.getElementById("play-button");
const resetButton = document.getElementById("reset-button");
const screenshotButton = document.getElementById("screenshot-button");
const shareButton = document.getElementById("share-button");

let audio = null;
let isAudioPlaying = false;
let currentModelIndex = 0;
let narrationAudio = null;
let modelBaseName;

// Variables for game state
let flippedCards = [];
let matchedCards = [];
let score = 0;
let turns = 0;
let gameTime = 0; // Game time in seconds
let timerInterval;
let gameStarted = false;

// Share Feature
share({ shareButton });

// Initial Audio for first model by default
narrationAudio = new Audio(animalsData[0].narrationSoundUrl);

let skyboxEnabled = false;
let isNarrationPlaying = false;
animalName.textContent = animalsData[0].animalName;

window.switchSrc = (element, modelIndex) => {
  const model = animalsData[modelIndex];
  const glbModel = model.glbModelUrl;
  const usdzModel = model.usdzModelUrl;
  const poster = model.posterUrl;
  modelBaseName = model.modelName.toLowerCase();
  console.log("Switching to model:", modelBaseName);

  modelViewer.src = `${glbModel}`;
  modelViewer.poster = `${poster}`;
  modelViewer.iosSrc = `${usdzModel}`;
  modelViewer.exposure = model.exposure;

  if (
    modelBaseName == "whale" ||
    modelBaseName == "shark" ||
    modelBaseName == "adultturtle"
  ) {
    modelViewer.setAttribute("shadow-intensity", "0");
  } else if (modelBaseName == "snake") {
    modelViewer.setAttribute("shadow-intensity", "1.1");
  } else {
    modelViewer.setAttribute("shadow-intensity", "2");
  }

  // Update selected slide
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide) => slide.classList.remove("selected"));
  element.classList.add("selected");

  currentModelIndex = modelIndex;
  animalName.textContent = model.animalName;
  animalFact.textContent = model.description;

  // Stop any ongoing narration or horn sound before switching models
  if (narrationAudio) {
    narrationAudio.pause();
    narrationAudio.currentTime = 0; // Reset narration to the start
  }

  // Update the animal sound (if needed)
  if (audio) {
    audio.pause();
  }

  // Set up new narration audio
  narrationAudio = new Audio(model.narrationSoundUrl);

  // Set the Play button to active state
  playButton.disabled = false;
  // pauseButton.disabled = true;
  resetButton.disabled = true;
};

// Play button functionality
playButton.addEventListener("click", () => {
  // Always start the narration from the beginning
  if (narrationAudio) {
    // Reset narration to the start before playing
    narrationAudio.currentTime = 0; // Reset to start
    narrationAudio.play(); // Play narration
    isNarrationPlaying = true;

    // Disable Play and enable Pause and Reset buttons
    playButton.disabled = true;
    resetButton.disabled = false;
  }
});

// Reset button functionality
resetButton.addEventListener("click", () => {
  if (narrationAudio) {
    narrationAudio.currentTime = 0; // Reset the narration to start
    narrationAudio.pause(); // Pause narration
    isNarrationPlaying = false;

    // Enable Play button and disable Pause/Reset buttons
    playButton.disabled = false;
    resetButton.disabled = true;
  }
});

// Screenshot functionality
screenshot({ screenshotButton, modelViewer });

// Toggle skybox and exposure
toggleButton.addEventListener("click", () => {
  const model = animalsData[currentModelIndex];
  if (skyboxEnabled) {
    modelViewer.removeAttribute("skybox-image");
    modelViewer.setAttribute("exposure", "1");
    skyboxEnabled = false;
    toggleButton.innerHTML = '<i class="fas fa-image"></i>';
  } else {
    modelViewer.setAttribute("skybox-image", model.skyboxUrl);

    modelViewer.setAttribute("exposure", 5);
    modelBaseName == "polarbear"
      ? modelViewer.setAttribute("exposure", 1.7)
      : modelViewer.setAttribute("exposure", 5);
    skyboxEnabled = true;
    toggleButton.innerHTML = '<i class="fas fa-image"></i>';
  }
});

// Play horn sound for the selected model
hornButton.addEventListener("click", () => {
  const model = animalsData[currentModelIndex];
  const hornAudio = new Audio(model.animalSoundUrl);
  hornAudio.play();
});

// Toggle facts visibility with GSAP animation
infoButton.addEventListener("click", () => {
  const isVisible = infoBox.style.display === "block";
  if (isVisible) {
    gsap.to(infoBox, {
      y: "30%",
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        infoBox.style.display = "none";
      },
    });
  } else {
    infoBox.style.display = "block";
    gsap.fromTo(
      infoBox,
      { y: "30%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.5, ease: "power2.inOut" },
    );
  }
});

// Function to shuffle the array (Fisher-Yates shuffle algorithm)
let shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
};

// Reset score function
let resetScore = () => {
  score = 0;
  turns = 0;
  gameTime = 0;
  updateScore();
  updateTurns();
  updateTime();
};

// Function to update score
let updateScore = () => {
  document.getElementById("score").innerText = `Score: ${score}`;

  // Trigger confetti if score reaches 90
  if (score >= 75) {
    victorySound.play(); // Play victory sound
    confettiCelebration(); // Trigger confetti
  }

  // Stop the timer when score reaches or exceeds 75
  if (score >= 75 && timerInterval) {
    stopTimer(); // Stop the timer
  }
};

// Function to update turns
let updateTurns = () => {
  document.getElementById("turns").innerText = `Turns: ${turns}`;
};

// Function to update time (in minutes and seconds format)
let updateTime = () => {
  const minutes = Math.floor(gameTime / 60); // Get minutes
  const seconds = gameTime % 60; // Get remaining seconds
  document.getElementById("timer").innerText =
    minutes == 0 ? `${seconds} sec` : `${minutes} min ${seconds} sec`;
};

let shuffledImages = [];

// Function to generate 20 shuffled cards
let generateCards = () => {
  const gameGrid = document.getElementById("memory-game-grid");

  // Clear the game grid if cards already exist (prevents appending)
  gameGrid.innerHTML = "";

  // Reset game state
  flippedCards = [];
  matchedCards = [];
  resetScore(); // Reset score at the start of each game

  // Determine how many unique images we can use (up to 15 pairs for a total of 30 cards)
  const sampleCount = Math.min(15, animalPoster.length);

  // Make a shallow copy and shuffle to pick a random sample
  const pool = [...animalPoster];

  shuffleArray(pool);
  // Assign to outer `shuffledImages` so other functions can read its length

  shuffledImages = [
    ...pool.slice(0, sampleCount),
    ...pool.slice(0, sampleCount),
  ];
  shuffleArray(shuffledImages); // Shuffle the final deck

  // Generate cards dynamically based on the shuffled images
  shuffledImages.forEach((image, index) => {
    const card = document.createElement("div");
    card.classList.add("memory-card");
    card.setAttribute("data-id", index); // Unique data attribute for each card

    const front = document.createElement("div");
    front.classList.add("front");

    const back = document.createElement("div");
    back.classList.add("back");

    // Create an image element for the back of the card
    const img = document.createElement("img");
    img.src = image; // Set the image source dynamically
    img.alt = `Animal Image ${index}`; // Add alt text for accessibility
    img.style.width = "100%"; // Ensure the image fills the card
    img.style.height = "100%"; // Ensure the image fills the card
    img.style.objectFit = "cover"; // Cover the space within the card, maintaining aspect ratio
    img.style.opacity = 0; // Initially hide the image
    img.loading = "lazy";

    back.appendChild(img); // Append the image to the back of the card
    card.appendChild(front);
    card.appendChild(back);
    gameGrid.appendChild(card);
  });

  addCardEventListeners(); // Add event listeners to the generated cards
  startTimer(); // Start the timer when the game begins
};

// Handle card flip logic with GSAP animation for reveal
let addCardEventListeners = () => {
  const cards = document.querySelectorAll(".memory-card");
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      if (
        flippedCards.length < 2 &&
        !card.classList.contains("flip") &&
        !matchedCards.includes(card)
      ) {
        // Flip the card using GSAP
        gsap.to(card, {
          rotationY: 180, // Flip the card to show the back
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            // Reveal the image only after the flip animation is complete
            const backImage = card.querySelector(".back img");
            gsap.to(backImage, { opacity: 1, duration: 0.5 }); // Fade in the image
          },
        });

        card.classList.add("flip");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
          turns++;
          updateTurns(); // Update the turn count
          checkMatch();
        }
      }
    });
  });
};

// Check if two flipped cards match
let checkMatch = () => {
  const [card1, card2] = flippedCards;

  if (card1.querySelector("img").src === card2.querySelector("img").src) {
    // Cards match, increase score
    score += 5;
    matchedCards.push(card1, card2);
    flippedCards = [];

    // Play correct sound
    correctSound.play();

    updateScore(); // Update the score on the screen

    // Check if all cards are matched
    if (matchedCards.length === shuffledImages.length) {
      confettiCelebration(); // Trigger confetti when all cards match
      stopTimer(); // Stop the timer when the game is won
    }
  } else {
    setTimeout(() => {
      gsap.to(card1, {
        rotationY: 0, // Flip back the first card
        duration: 0.5,
        ease: "power2.inOut",
      });
      gsap.to(card2, {
        rotationY: 0, // Flip back the second card
        duration: 0.5,
        ease: "power2.inOut",
      });

      card1.classList.remove("flip");
      card2.classList.remove("flip");
      flippedCards = [];
      incorrectSound.play(); // Play incorrect sound
    }, 1000); // Delay before flipping back
  }
};

// Start the timer
let startTimer = () => {
  if (!gameStarted) {
    gameStarted = true; // Mark the game as started
    timerInterval = setInterval(() => {
      gameTime++;
      updateTime();
    }, 1000);
  }
};

// Stop the timer
let stopTimer = () => {
  clearInterval(timerInterval);
  gameStarted = false; // Mark the game as not started
};

// Open the memory box and start the game
document
  .querySelector(".gamepad-button")
  .addEventListener("click", function () {
    document.getElementById("memory-box").style.display = "block";
    generateCards(); // Generate the game when the button is clicked
  });

// Close the memory box
document
  .getElementById("close-memory-box")
  .addEventListener("click", function () {
    document.getElementById("memory-box").style.display = "none";
    document.getElementById("memory-game-grid").innerHTML = ""; // Clear the game
    stopTimer(); // Stop the timer when the game is closed
  });
