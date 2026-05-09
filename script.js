const modelViewer = document.querySelector("model-viewer");
const toggleButton = document.getElementById("toggle-skybox-button");
const hornButton = document.getElementById("horn-button");
const infoButton = document.getElementById("info-button");
const infoBox = document.getElementById("info-box");
const animalFact = document.getElementById("animal-fact");
const animalName = document.querySelector("h3.animal-name");

const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");
const screenshotButton = document.getElementById("screenshot-button");
const copyButton = document.querySelector("button.copy-button");

let audio = null;
let isAudioPlaying = false;
let currentModelIndex = 0;
let narrationAudio = null;

// Animals Data
const modelData = [
  {
    animalName: "Lion",
    modelName: "Lion",
    skyboxUrl: "./models/Lion/scene.jpg",
    hornSoundUrl: "./models/Lion/lion.mp3",
    narrationSoundUrl: "./models/Lion/lionNarration.mp3",
    folder: "./models/Lion",
    description:
      "Lions are powerful big cats known for their majestic manes and dominance.",
  },
  {
    animalName: "Rhino",
    modelName: "Rhino",
    skyboxUrl: "./models/Rhino/scene.jpg",
    hornSoundUrl: "./models/Rhino/rhino.mp3",
    narrationSoundUrl: "./models/Rhino/rhinoNarration.mp3",
    folder: "./models/Rhino",
    description:
      "Rhinos are large, herbivorous mammals known for their thick skin and iconic horn.",
  },
  {
    animalName: "Polar Bear",
    modelName: "Bear",
    skyboxUrl: "./models/Polar/scene.jpg",
    hornSoundUrl: "./models/Polar/bear.mp3",
    narrationSoundUrl: "./models/Polar/polarNarration.mp3",
    folder: "./models/Polar",
    description:
      "Polar bears are large marine mammals adapted to Arctic life, known for their thick fur and strong swimming abilities.",
  },
  {
    animalName: "Ostrich",
    modelName: "Ostrich",
    skyboxUrl: "./models/Ostrich/scene.jpg",
    narrationSoundUrl: "./models/Ostrich/ostrichNarration.mp3",
    hornSoundUrl: "./models/Ostrich/ostrich.mp3",
    folder: "./models/Ostrich",
    description:
      "Ostriches are the world's largest birds, known for their fast running speed and flightless nature.",
  },
  {
    animalName: "Camel",
    modelName: "Camel",
    skyboxUrl: "./models/Camel/scene.jpg",
    narrationSoundUrl: "./models/Camel/camelNarration.mp3",
    hornSoundUrl: "./models/Camel/camel.mp3",
    folder: "./models/Camel",
    description:
      "Camels are desert animals which stores fat for energy, and their ability to survive harsh conditions.",
  },
  {
    animalName: "Dog",
    modelName: "Dog",
    skyboxUrl: "./models/Dog/scene.jpg",
    narrationSoundUrl: "./models/Dog/dogNarration.mp3",
    hornSoundUrl: "./models/Dog/dog.mp3",
    folder: "./models/Dog",
    description:
      "Dogs are loyal and intelligent companions, often known as man's best friend. ",
  },
  {
    animalName: "Sheep",
    modelName: "Sheep",
    skyboxUrl: "./models/Sheep/scene.jpg",
    narrationSoundUrl: "./models/Sheep/sheepNarration.mp3",
    hornSoundUrl: "./models/Sheep/sheep.mp3",
    folder: "./models/Sheep",
    description:
      "Sheep are domesticated herbivores known for their wool, which is used for textiles.",
  },
  {
    animalName: "Texas Longhorn",
    modelName: "TexasLonghorn",
    skyboxUrl: "./models/TexasLonghorn/scene.jpg",
    narrationSoundUrl: "./models/TexasLonghorn/texasNarration.mp3",
    hornSoundUrl: "./models/TexasLonghorn/texas.mp3",
    folder: "./models/TexasLonghorn",
    description:
      "Texas Longhorns are a breed of cattle known for their distinctive long, curved horns and hardy nature.",
  },
  {
    animalName: "Jaguar",
    modelName: "Jaguar",
    skyboxUrl: "./models/Jaguar/scene.jpg",
    narrationSoundUrl: "./models/Jaguar/jaguarNarration.mp3",
    hornSoundUrl: "./models/Jaguar/jaguar.mp3",
    folder: "./models/Jaguar",
    description:
      "Jaguars are powerful big cats native to the Americas, known for their spotted coats and strength as apex predators.",
  },
  {
    animalName: "American Buffalo",
    modelName: "buffalo",
    skyboxUrl: "./models/AfricanBuffalo/scene.jpg",
    narrationSoundUrl: "./models/AfricanBuffalo/buffaloNarration.mp3",
    hornSoundUrl: "./models/AfricanBuffalo/buffalo.mp3",
    folder: "./models/AfricanBuffalo",
    description:
      "American buffalo are large, shaggy mammals native to North America, known for their iconic and strong build.",
  },
  {
    animalName: "Gazella",
    modelName: "gazella",
    skyboxUrl: "./models/Gazella/scene.jpg",
    narrationSoundUrl: "./models/Gazella/gazellaNarration.mp3",
    hornSoundUrl: "./models/Gazella/gazella.mp3",
    folder: "./models/Gazella",
    description:
      "Gazelles are graceful, fast-running antelopes found in Africa and Asia, known for their slender bodies and agility.",
  },
  {
    animalName: "Penguin",
    modelName: "Penguin",
    skyboxUrl: "./models/Penguin/scene.jpg",
    narrationSoundUrl: "./models/Penguin/penguinNarration.mp3",
    hornSoundUrl: "./models/Penguin/penguin.mp3",
    folder: "./models/Penguin",
    description:
      "Penguins are flightless birds that thrive in cold climates, known for their excellent swimming abilities.",
  },
  {
    animalName: "Skunk",
    modelName: "Skunk",
    skyboxUrl: "./models/Skunk/scene.jpg",
    narrationSoundUrl: "./models/Skunk/skunkNarration.mp3",
    hornSoundUrl: "./models/Skunk/skunk.mp3",
    folder: "./models/Skunk",
    description:
      "Skunks are small mammals known for their black and white fur and the potent spray they use as a defense mechanism.",
  },
  {
    animalName: "Caracal Cat",
    modelName: "cat",
    skyboxUrl: "./models/CaracalCat/scene.jpg",
    narrationSoundUrl: "./models/CaracalCat/catNarration.mp3",
    hornSoundUrl: "./models/CaracalCat/cat.mp3",
    folder: "./models/CaracalCat",
    description:
      "Caracal cats are wild felines with distinctive tufted ears and exceptional agility, native to Africa.",
  },
  {
    animalName: "White Tiger",
    modelName: "Tiger",
    skyboxUrl: "./models/Tiger/scene.jpg",
    narrationSoundUrl: "./models/Tiger/tigerNarration.mp3",
    hornSoundUrl: "./models/Tiger/tiger.mp3",
    folder: "./models/Tiger",
    description:
      "White tigers are rare, strikingly beautiful big cats with white fur and black stripes, known for their power and grace.",
  },
  {
    animalName: "Flamingo",
    modelName: "flamingo",
    skyboxUrl: "./models/Flamingo/scene.jpg",
    narrationSoundUrl: "./models/Flamingo/flamingoNarration.mp3",
    hornSoundUrl: "./models/Flamingo/flamingo.mp3",
    folder: "./models/Flamingo",
    description:
      "Flamingos are tall, wading birds known for their vibrant pink feathers and distinctive curved beaks.",
  },
  {
    animalName: "Whale",
    modelName: "Whale",
    skyboxUrl: "./models/Whale/scene.jpeg",
    narrationSoundUrl: "./models/Whale/whaleNarration.mp3",
    hornSoundUrl: "./models/Whale/whale.mp3",
    folder: "./models/Whale",
    description:
      "Whales are massive marine mammals known for their size and complex communication.",
  },
  {
    animalName: "Shark",
    modelName: "Shark",
    skyboxUrl: "./models/Shark/scene.jpeg",
    narrationSoundUrl: "./models/Shark/sharkNarration.mp3",
    hornSoundUrl: "./models/Shark/shark.mp3",
    folder: "./models/Shark",
    description:
      "Sharks are apex predators with sharp teeth and excellent senses, playing a key role in marine ecosystems.",
  },
];

// Copy Feature
copyButton.addEventListener("click", () => {
  let code = `<iframe
                src="https://beastify.onrender.com/"
                width="500px"
                height="500px"
                style="border: none;"
              ></iframe>`;

  // Create a temporary textarea element to hold the code
  const textarea = document.createElement("textarea");
  document.body.appendChild(textarea);
  textarea.value = code;
  textarea.select();
  document.execCommand("copy");

  // Remove the temporary textarea
  document.body.removeChild(textarea);
  alert("Code Copied!");
});

// Initial Audio for first model by default
narrationAudio = new Audio(modelData[0].narrationSoundUrl);

let skyboxEnabled = false;
let isNarrationPlaying = false;
animalName.textContent = modelData[0].animalName;

window.switchSrc = (element, modelIndex) => {
  const model = modelData[modelIndex];
  const modelFolder = model.folder;
  const modelBaseName = model.modelName.toLowerCase();

  modelViewer.src = `${modelFolder}/${modelBaseName}.glb`;
  modelViewer.poster = `${modelFolder}/${modelBaseName}.png`;
  modelViewer.iosSrc = `${modelFolder}/${modelBaseName}.usdz`;

  if (modelBaseName == "whale" || modelBaseName == "shark") {
    modelViewer.setAttribute("shadow-intensity", "0");
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

  // Update the horn sound (if needed)
  if (audio) {
    audio.pause();
  }

  // Set up new narration audio
  narrationAudio = new Audio(model.narrationSoundUrl);

  // Set the Play button to active state
  playButton.disabled = false;
  pauseButton.disabled = true;
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
    pauseButton.disabled = false;
    resetButton.disabled = false;
  }
});

// Pause button functionality
pauseButton.addEventListener("click", () => {
  if (narrationAudio) {
    narrationAudio.pause(); // Pause narration
    isNarrationPlaying = false;

    // Disable Pause and enable Play and Reset buttons
    playButton.disabled = false;
    pauseButton.disabled = true;
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
    pauseButton.disabled = true;
    resetButton.disabled = true;
  }
});

// Check if the model-viewer supports the `toDataURL` method
screenshotButton.addEventListener("click", () => {
  // Check if the `model-viewer` element supports the toDataURL method for screenshots
  if (modelViewer.toDataURL) {
    const imageUrl = modelViewer.toDataURL("image/png"); // Capture the screenshot as a PNG

    // Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "Beastify.png"; // Name the downloaded file
    link.click();
  } else {
    alert("Screenshot functionality is not supported by this model viewer.");
  }
});

// Toggle skybox and exposure
toggleButton.addEventListener("click", () => {
  const model = modelData[currentModelIndex];
  if (skyboxEnabled) {
    modelViewer.removeAttribute("skybox-image");
    modelViewer.setAttribute("exposure", "1");
    skyboxEnabled = false;
    toggleButton.innerHTML = '<i class="fas fa-image"></i>';
  } else {
    modelViewer.setAttribute("skybox-image", model.skyboxUrl);
    modelViewer.setAttribute("exposure", "5");
    skyboxEnabled = true;
    toggleButton.innerHTML = '<i class="fas fa-image"></i>';
  }
});

// Play horn sound for the selected model
hornButton.addEventListener("click", () => {
  const model = modelData[currentModelIndex];
  const hornAudio = new Audio(model.hornSoundUrl);
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

// List of animal images
const animalImages = [
  "./models/Lion/lion.png",
  "./models/Rhino/rhino.png",
  "./models/Polar/bear.png",
  "./models/Ostrich/ostrich.png",
  "./models/Camel/camel.png",
  "./models/Dog/dog.png",
  "./models/Sheep/sheep.png",
  "./models/TexasLonghorn/texaslonghorn.png",
  "./models/Jaguar/jaguar.png",
  "./models/AfricanBuffalo/buffalo.png",
  "./models/Penguin/penguin.png",
  "./models/Skunk/skunk.png",
  "./models/CaracalCat/cat.png",
  "./models/Tiger/tiger.png",
  "./models/Flamingo/flamingo.png",
  "./models/Whale/whale.png",
  "./models/Shark/shark.png",
];

// Function to shuffle the array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

// Variables for game state
let flippedCards = [];
let matchedCards = [];
let score = 0;
let turns = 0;
let gameTime = 0; // Game time in seconds
let timerInterval;
let gameStarted = false;
// Declare the audio variables
const correctSound = new Audio("./assets/audio/correct.mp3");
const incorrectSound = new Audio("./assets/audio/incorrect.mp3");
const victorySound = new Audio("./assets/audio/victory.mp3");

// Reset score function
function resetScore() {
  score = 0;
  turns = 0;
  gameTime = 0;
  updateScore();
  updateTurns();
  updateTime();
}

// Function to update score
function updateScore() {
  document.getElementById("score").innerText = `Score: ${score}`;

  // Trigger confetti if score reaches 90
  if (score >= 75) {
    victorySound.play(); // Play victory sound
    triggerConfetti(); // Trigger confetti
  }

  // Stop the timer when score reaches or exceeds 75
  if (score >= 75 && timerInterval) {
    stopTimer(); // Stop the timer
  }
}

// Function to update turns
function updateTurns() {
  document.getElementById("turns").innerText = `Turns: ${turns}`;
}

// Function to update time (in minutes and seconds format)
function updateTime() {
  const minutes = Math.floor(gameTime / 60); // Get minutes
  const seconds = gameTime % 60; // Get remaining seconds
  document.getElementById("timer").innerText =
    `Time: ${minutes} min ${seconds} sec`;
}

let shuffledImages = [];

// Function to generate 20 shuffled cards
function generateCards() {
  const gameGrid = document.getElementById("memory-game-grid");

  // Clear the game grid if cards already exist (prevents appending)
  gameGrid.innerHTML = "";

  // Reset game state
  flippedCards = [];
  matchedCards = [];
  resetScore(); // Reset score at the start of each game

  // Duplicate the images array to make pairs, and shuffle the result
  const shuffledImages = [
    ...animalImages.slice(0, 15),
    ...animalImages.slice(0, 15),
  ];
  shuffleArray(shuffledImages); // Shuffle the images array

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
    img.style.objectFit = "contain"; // Cover the space within the card, maintaining aspect ratio
    img.style.opacity = 0; // Initially hide the image
    img.loading = "lazy";

    back.appendChild(img); // Append the image to the back of the card
    card.appendChild(front);
    card.appendChild(back);
    gameGrid.appendChild(card);
  });

  addCardEventListeners(); // Add event listeners to the generated cards
  startTimer(); // Start the timer when the game begins
}

// Handle card flip logic with GSAP animation for reveal
function addCardEventListeners() {
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
}

// Check if two flipped cards match
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.querySelector("img").src === card2.querySelector("img").src) {
    // Cards match, increase score
    score += 5;
    matchedCards.push(card1, card2);
    flippedCards = [];

    // Add green box shadow to matched cards
    gsap.to(card1, {
      boxShadow: "0 0 12px 5px green",
      duration: 0.5,
    });
    gsap.to(card2, {
      boxShadow: "0 0 12px 5px green",
      duration: 0.5,
    });

    // Play correct sound
    correctSound.play();

    updateScore(); // Update the score on the screen

    // Check if all cards are matched
    if (matchedCards.length === shuffledImages.length) {
      triggerConfetti(); // Trigger confetti when all cards match
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
}

// Trigger confetti when score reaches 90 or all cards match
function triggerConfetti() {
  confetti({
    particleCount: 190,
    spread: 140,
    origin: { y: 0.6 },
  });
}

// Start the timer
function startTimer() {
  if (!gameStarted) {
    gameStarted = true; // Mark the game as started
    timerInterval = setInterval(() => {
      gameTime++;
      updateTime();
    }, 1000);
  }
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  gameStarted = false; // Mark the game as not started
}

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
