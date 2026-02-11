// ===============================
// TYPEWRITER (textul principal)
// ===============================
const textElement = document.querySelector(".text");
const fullText = textElement.textContent;
textElement.textContent = "";
let i = 0;

function typeWriter() {
  if (i < fullText.length) {
    textElement.textContent += fullText.charAt(i);
    i++;
    setTimeout(typeWriter, 30);
  }
}
typeWriter();

// ===============================
// BUTONUL "NU" CARE FUGE
// ===============================
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
let detached = false;
let placeholder = null;
let cooldown = false;

let beatSpeed = 1.2; // start
const minSpeed = 0.4; // limită minimă

noBtn.addEventListener("pointerdown", () => {
  beatSpeed = Math.max(minSpeed, beatSpeed - 0.2);

  yesBtn.style.animation =
    `fadeDown 0.8s ease-out forwards, heartbeat ${beatSpeed}s 0.6s infinite`;
});

function detachToBody() {
  if (detached) return;

  // 1) măsurăm butonul în layout
  const rect = noBtn.getBoundingClientRect();

  // 2) facem un placeholder care ocupă exact locul lui
  placeholder = document.createElement("span");
  placeholder.style.display = "inline-block";
  placeholder.style.width = `${rect.width}px`;
  placeholder.style.height = `${rect.height}px`;

  // (opțional) dacă vrei să păstrezi și distanțele dintre butoane:
  placeholder.style.margin = getComputedStyle(noBtn).margin;

  // 3) îl inserăm înaintea butonului "Nu" (în același container)
  noBtn.parentNode.insertBefore(placeholder, noBtn);

  // 4) mutăm butonul în body
  document.body.appendChild(noBtn);

  // 5) păstrăm poziția inițială vizuală
  noBtn.style.position = "fixed";
  noBtn.style.left = `${rect.left}px`;
  noBtn.style.top = `${rect.top}px`;
  noBtn.style.transform = "none";
  noBtn.style.zIndex = "9999";

  detached = true;
}

// Mută butonul într-o poziție sigură din ecran
function moveButton() {
  detachToBody();

  const margin = 20;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const rect = noBtn.getBoundingClientRect();

  const maxX = vw - rect.width - margin;
  const maxY = vh - rect.height - margin;

  const x = Math.max(margin, Math.random() * maxX);
  const y = Math.max(margin, Math.random() * maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

// ===============================
// PC – fuge când mouse-ul se apropie
// ===============================
setTimeout(() => {
  document.addEventListener("mousemove", (e) => {
    if (cooldown) return;

    const rect = noBtn.getBoundingClientRect();
    const bx = rect.left + rect.width / 2;
    const by = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - bx, e.clientY - by);

    if (dist < 150) {
      cooldown = true;
      moveButton();
      setTimeout(() => (cooldown = false), 300);
    }
  });
}, 900);

// ===============================
// MOBIL – fuge la tap
// ===============================
noBtn.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "mouse") return;
  e.preventDefault();
  moveButton();
});