console.log("Sitio cargado correctamente.");

// Selecciona el <model-viewer>
const mascot = document.getElementById("mascot");

let targetX = 80;
let targetY = window.innerHeight - 120;
let currentX = targetX;
let currentY = targetY;
let lastMoveTime = Date.now();

// Movimiento suave de la mascota
function updateMascot() {
  currentX += (targetX - currentX) * 0.1;
  currentY += (targetY - currentY) * 0.1;

  mascot.style.left = currentX + "px";
  mascot.style.top = currentY + "px";

  // Controla animación walk/idle
  if (Date.now() - lastMoveTime < 200) {
    mascot.classList.add("walk");
  } else {
    mascot.classList.remove("walk");
  }

  requestAnimationFrame(updateMascot);
}
updateMascot();

// Movimiento del cursor
document.addEventListener("mousemove", (e) => {
  targetX = e.clientX - 80;
  targetY = e.clientY - 80;
  lastMoveTime = Date.now();

  // Rotación del modelo hacia la dirección del cursor
  const rotation = e.clientX > currentX ? "rotateY(0deg)" : "rotateY(180deg)";
  mascot.style.transform = rotation;
});
