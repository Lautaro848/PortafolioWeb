console.log("Sitio cargado correctamente.");

const mascot = document.getElementById("mascot");

let targetX = 80;
let targetY = window.innerHeight - 120;
let currentX = targetX;
let currentY = targetY;
let lastMoveTime = Date.now();

function updateMascot() {
  currentX += (targetX - currentX) * 0.1;
  currentY += (targetY - currentY) * 0.1;

  mascot.style.left = currentX + "px";
  mascot.style.top = currentY + "px";

  if (Date.now() - lastMoveTime < 200) {
    mascot.classList.add("walk");
  } else {
    mascot.classList.remove("walk");
  }

  requestAnimationFrame(updateMascot);
}
updateMascot();

document.addEventListener("mousemove", (e) => {
  targetX = e.clientX - 80;
  targetY = e.clientY - 80;
  lastMoveTime = Date.now();

  mascot.style.transform = (e.clientX > currentX) ? "scaleX(1)" : "scaleX(-1)";
});
