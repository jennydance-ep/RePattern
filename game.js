// === RP Elephant Puzzle Game Logic ===
const pieces = document.querySelectorAll('.piece');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popup-text');
const messages = [
  "Subsidy: Where market support is needed.",
  "Exit: Sometimes leaving is the right call.",
  "Transition: Moving toward sustainability.",
  "Scale: Growing what works.",
  "Uncertainty: Explore, prototype, learn.",
  "Win-Win: Impact meets profitability."
];
const locked = new Set();

// Start game
document.getElementById('start-button').onclick = () => {
  document.getElementById('splash-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  randomizePieces();
};

function randomizePieces() {
  pieces.forEach((piece, i) => {
    piece.style.left = Math.random() * 60 + '%';
    piece.style.top = Math.random() * 60 + '%';

    piece.addEventListener('click', () => {
      if (locked.has(piece.id)) return;
      locked.add(piece.id);
      piece.style.border = "2px solid green";
      showPopup(messages[i]);
    });
  });
}

function showPopup(msg) {
  popupText.innerText = msg;
  popup.classList.remove('hidden');
}

function closePopup() {
  popup.classList.add('hidden');
  if (locked.size === 6) {
    setTimeout(() => {
      showPopup("Now you see the whole elephant. Transition needs everyone's perspective.");
    }, 500);
  }
}
