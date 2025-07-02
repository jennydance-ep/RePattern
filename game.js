// === RP Elephant Puzzle Game Logic ===

const pieces = document.querySelectorAll('.piece');
const targets = document.querySelectorAll('.target');
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

// Splash screen transition
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => {
  document.getElementById('splash-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  randomizePieces();
  makeDraggable();
});

// Randomly place pieces on screen
function randomizePieces() {
  pieces.forEach(piece => {
    piece.style.left = Math.random() * 60 + '%';
    piece.style.top = Math.random() * 60 + '%';
  });
}

// Enable dragging
function makeDraggable() {
  pieces.forEach((piece, i) => {
    let offsetX, offsetY, isDragging = false;

    piece.addEventListener('mousedown', startDrag);
    piece.addEventListener('touchstart', startDrag);

    function startDrag(e) {
      if (locked.has(piece.id)) return;
      isDragging = true;
      const rect = piece.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;

      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const board = document.getElementById('puzzle-board');
      const boardRect = board.getBoundingClientRect();
      const x = clientX - boardRect.left - offsetX;
      const y = clientY - boardRect.top - offsetY;

      piece.style.left = `${x}px`;
      piece.style.top = `${y}px`;
    }

    function endDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);
      checkSnap(piece, i);
    }
  });
}

// Snap if near the correct target
function checkSnap(piece, i) {
  const target = document.getElementById(`target${i + 1}`);
  const pieceRect = piece.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const distance = Math.hypot(
    pieceRect.left - targetRect.left,
    pieceRect.top - targetRect.top
  );

  if (distance < 40) { // Snap threshold
    piece.style.left = `${target.offsetLeft}px`;
    piece.style.top = `${target.offsetTop}px`;
    piece.style.pointerEvents = 'none';
    locked.add(piece.id);
    showPopup(messages[i]);
  }
}

// Show feedback popup
function showPopup(msg) {
  popupText.innerText = msg;
  popup.classList.remove('hidden');
}

// Close popup and check completion
function closePopup() {
  popup.classList.add('hidden');
  if (locked.size === 6) {
    setTimeout(() => {
      showPopup("Now you see the whole elephant. Transition needs everyone's perspective.");
    }, 500);
  }
}

window.closePopup = closePopup;
