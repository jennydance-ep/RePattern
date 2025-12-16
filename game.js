// Query elements
const pieces = document.querySelectorAll('.piece');
const targets = document.querySelectorAll('.target');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popup-text');
const popupOk = document.getElementById('popup-ok');

const messages = [
  "Subsidy: Where market support is needed.",
  "Exit: Sometimes leaving is the right call.",
  "Transition: Moving toward sustainability.",
  "Scale: Growing what works.",
  "Uncertainty: Explore, prototype, learn.",
  "Win-Win: Impact meets profitability."
];

const locked = new Set();
let celebrated = false; // prevent multiple celebrations

// Audio helpers
function playSound(id) {
  const sound = document.getElementById(id);
  if (!sound) return;
  try {
    sound.currentTime = 0;
    sound.play();
  } catch (e) {
    // Ignore autoplay restrictions or playback errors
  }
}

// Confetti setup (uses canvas-confetti library)
const confettiCanvas = document.getElementById('confetti');
let confettiFire = null;
if (window.confetti && confettiCanvas) {
  confettiFire = confetti.create(confettiCanvas, { resize: true, useWorker: true });
}

// Start game
document.getElementById('start-button').onclick = () => {
  document.getElementById('splash-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';

  // Start background music on user gesture
  playSound('bg-music');

  startGame();
};

// Core game logic
function startGame() {
  pieces.forEach((piece, i) => {
    // Random initial position within board (percentage)
    piece.style.left = Math.random() * 70 + '%';
    piece.style.top = Math.random() * 60 + '%';

    let offsetX, offsetY;

    piece.addEventListener('pointerdown', startDrag);

    function startDrag(e) {
      if (locked.has(piece.id)) return;

      const rect = piece.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      piece.setPointerCapture(e.pointerId);
      piece.addEventListener('pointermove', onDrag);
      piece.addEventListener('pointerup', endDrag);
    }

    function onDrag(e) {
      const board = document.getElementById('puzzle-board').getBoundingClientRect();
      piece.style.left = `${e.clientX - board.left - offsetX}px`;
      piece.style.top = `${e.clientY - board.top - offsetY}px`;
    }

    function endDrag(e) {
      piece.removeEventListener('pointermove', onDrag);
      piece.removeEventListener('pointerup', endDrag);

      const board = document.getElementById('puzzle-board').getBoundingClientRect();
      const pieceBox = piece.getBoundingClientRect();
      const targetBox = targets[i].getBoundingClientRect();

      const distance = Math.hypot(
        pieceBox.left - targetBox.left,
        pieceBox.top - targetBox.top
      );

      if (distance < 50) {
        // Snap into place at target coordinates (relative to puzzle board)
        piece.style.left = `${targetBox.left - board.left}px`;
        piece.style.top = `${targetBox.top - board.top}px`;

        locked.add(piece.id);

        // Audio + popup
        playSound('snap-sound');
        showPopup(messages[i]);
      }
    }
  });
}

// Popup controls
function showPopup(msg) {
  popupText.innerText = msg;
  popup.classList.remove('hidden');
  playSound('popup-sound');
}

function closePopup() {
  popup.classList.add('hidden');

  // If all pieces are locked, show final message after a short pause
  if (locked.size === 6 && !celebrated) {
    setTimeout(() => {
      popup.classList.add('final');
      showPopup("Now you see the whole elephant. Transition needs everyone's perspective.");

      // Confetti celebration
      if (confettiFire) {
        confettiFire({
          particleCount: 160,
          spread: 90,
          startVelocity: 45,
          scalar: 1.1,
          origin: { y: 0.6 }
        });
        // A second burst for depth
        setTimeout(() => {
          confettiFire({
            particleCount: 120,
            spread: 80,
            startVelocity: 35,
            scalar: 0.9,
            origin: { y: 0.7 }
          });
        }, 500);
      }

      celebrated = true;
    }, 500);
  }
}

// Wire popup OK button
popupOk.addEventListener('click', closePopup);
