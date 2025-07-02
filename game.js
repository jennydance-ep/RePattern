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

// Start game
document.getElementById('start-button').onclick = () => {
  document.getElementById('splash-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  startGame();
};

function startGame() {
  pieces.forEach((piece, i) => {
    // Random position
    piece.style.left = Math.random() * 70 + '%';
    piece.style.top = Math.random() * 60 + '%';

    let offsetX, offsetY;

    piece.addEventListener('pointerdown', startDrag);
    function startDrag(e) {
      if (locked.has(piece.id)) return;

      offsetX = e.clientX - piece.getBoundingClientRect().left;
      offsetY = e.clientY - piece.getBoundingClientRect().top;

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

      const pieceBox = piece.getBoundingClientRect();
      const targetBox = targets[i].getBoundingClientRect();
      const distance = Math.hypot(
        pieceBox.left - targetBox.left,
        pieceBox.top - targetBox.top
      );

      if (distance < 50) {
        // Snap into place
        piece.style.left = targets[i].style.left;
        piece.style.top = targets[i].style.top;
        locked.add(piece.id);
        showPopup(messages[i]);
      }
    }
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
