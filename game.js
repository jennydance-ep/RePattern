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
const correctPositions = {}; // Stores each piece’s correct spot
const floatingIntervals = {}; // Store interval IDs for floating animation

document.getElementById('start-button').onclick = () => {
  document.getElementById('splash-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  setupPuzzle();
};

function setupPuzzle() {
  pieces.forEach((piece, i) => {
    const pieceId = piece.id;

    // Store correct position before randomizing
    correctPositions[pieceId] = {
      left: piece.offsetLeft,
      top: piece.offsetTop
    };

    // Random starting position
    const randLeft = Math.random() * 60;
    const randTop = Math.random() * 60;
    piece.style.left = randLeft + '%';
    piece.style.top = randTop + '%';

    // Start floating animation
    floatPiece(piece);

    // Drag support
    dragElement(piece);
  });
}

function floatPiece(piece) {
  const interval = setInterval(() => {
    if (locked.has(piece.id)) return;
    const deltaX = (Math.random() - 0.5) * 10;
    const deltaY = (Math.random() - 0.5) * 10;

    const currentLeft = parseFloat(piece.style.left);
    const currentTop = parseFloat(piece.style.top);

    piece.style.left = `${Math.min(80, Math.max(0, currentLeft + deltaX))}%`;
    piece.style.top = `${Math.min(80, Math.max(0, currentTop + deltaY))}%`;
  }, 800);
  floatingIntervals[piece.id] = interval;
}

function dragElement(el) {
  let offsetX, offsetY;

  el.addEventListener('pointerdown', startDrag);

  function startDrag(e) {
    if (locked.has(el.id)) return;

    e.preventDefault();
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;

    document.addEventListener('pointermove', drag);
    document.addEventListener('pointerup', endDrag);
  }

  function drag(e) {
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;
  }

  function endDrag(e) {
    document.removeEventListener('pointermove', drag);
    document.removeEventListener('pointerup', endDrag);
    checkSnap(el);
  }
}

function checkSnap(piece) {
  const correct = correctPositions[piece.id];
  const currentX = piece.offsetLeft;
  const currentY = piece.offsetTop;

  const dx = Math.abs(currentX - correct.left);
  const dy = Math.abs(currentY - correct.top);
  const snapThreshold = 40; // px

  if (dx < snapThreshold && dy < snapThreshold) {
    // Snap to correct spot
    piece.style.left = `${correct.left}px`;
    piece.style.top = `${correct.top}px`;

    piece.style.border = "2px solid green";
    locked.add(piece.id);

    // Stop floating
    clearInterval(floatingIntervals[piece.id]);

    if (locked.size === 6) {
      setTimeout(() => {
        showPopup("Now you see the whole elephant. Transition needs everyone's perspective.");
      }, 400);
    }
  }
}

function showPopup(msg) {
  popupText.innerText = msg;
  popup.classList.remove('hidden');
}

function closePopup() {
  popup.classList.add('hidden');
}