const overlay = document.querySelector('.liquid-overlay');
const buttons = document.querySelectorAll('.projects-btn');
const canvas = document.getElementById('bgfx');

canvas.style.display = 'block';

const ctx = canvas.getContext('2d');
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

let length = 0;
let direction = 1;
let phase = 0;
let time = 0;

const maxLength = 140;
const levels = 6;

const glow_colors = [
  '#b892ff',
];

const inside_colors = [
  '#ff0066',
  '#b892ff',
];

const colors = [
  '#ffe3ee',
  '#2b174a',
];

let colorIndex = 0;

function animate() {

  time += 0.016;

  requestAnimationFrame(animate);
  if (canvas.style.display === 'none')
    return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const speed =
    6 +
    Math.sin(time * 3) * 2;

  length += speed * direction;

  if (length >= maxLength)
    direction = -0.85;

  if (length <= 0) {
    length = 0;
    direction = 0.7;
    phase = (phase + 1) % levels;
    colorIndex =
      (colorIndex + 1) %
      colors.length;
  }

  const wobble =
    Math.sin(time * 2 + phase) * 0.12;

  const angle =
    phase * Math.PI * 2 / levels + wobble;
  const step = Math.PI * 2 / levels;
  const angle2 = angle + step;
  const radius = length;
  const x1 = Math.sin(angle) * radius;
  const y1 = Math.cos(angle) * radius;
  const x2 = Math.sin(angle2) * radius;
  const y2 = Math.cos(angle2) * radius;
  const ox1 = -x1;
  const oy1 = -y1;

  const ox2 = -x2;
  const oy2 = -y2;

  const cx =
    canvas.width / 2 +
    Math.sin(time * 0.7) * 40;

  const cy =
    canvas.height / 2 +
    Math.cos(time * 0.9) * 25;

  ctx.strokeStyle =
    colorIndex === 0
      ? 'rgba(255, 0, 102, 0.18)'
      : 'rgba(184, 146, 255, 0.18)';
  ctx.lineWidth = 15;
  ctx.shadowBlur =
    24 + Math.sin(time * 3) * 10;
  ctx.shadowColor =
    glow_colors[colorIndex];
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + ox1, cy + oy1);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + ox2, cy + oy2);
  ctx.lineTo(cx + ox1, cy + oy1);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + x1, cy + y1);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + x2, cy + y2);
  ctx.lineTo(cx + x1, cy + y1);
  ctx.stroke();

  ctx.strokeStyle = colors[colorIndex];
  ctx.lineWidth =
    10 + Math.sin(time * 4) * 2;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + ox1, cy + oy1);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + ox2, cy + oy2);
  ctx.lineTo(cx + ox1, cy + oy1);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + x1, cy + y1);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + x2, cy + y2);
  ctx.lineTo(cx + x1, cy + y1);
  ctx.stroke();

  ctx.strokeStyle = inside_colors[colorIndex];
  ctx.lineWidth =
    5 + Math.cos(time * 5) * 1.2;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + ox1, cy + oy1);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + ox2, cy + oy2);
  ctx.lineTo(cx + ox1, cy + oy1);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + x1, cy + y1);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + x2, cy + y2);
  ctx.lineTo(cx + x1, cy + y1);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

animate();

window.addEventListener('pageshow', () => {
  if (!overlay) return;
  overlay.style.display = 'block';
  overlay.classList.remove('fill');
  overlay.classList.add('drain');
  
  overlay.addEventListener('animationend', () => {
    overlay.style.display = 'none';
    canvas.style.display = 'none';
  }, { once: true});
});

function handleTransition(e,targetUrl) {
  e.preventDefault();
  if (!overlay) {
    window.location.href = targetUrl;
    return;
  }
  overlay.style.display = 'block';
  overlay.classList.remove('drain');
  overlay.classList.add('fill');
  
  overlay.addEventListener('animationend', () => {
    canvas.style.display = 'block';
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 500);
  }, { once: true })
}

document.querySelectorAll('.project').forEach(p => {
  p.addEventListener('click', () => {
    p.classList.toggle('active');
  });
});

buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleTransition(e, btn.href);
  });
});
