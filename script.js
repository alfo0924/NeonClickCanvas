// ====== 動態霓虹漸層背景動畫 ======

const gradients = [
    { r: 255, g: 50,  b: 80  }, // 紅
    { r: 255, g: 140, b: 0   }, // 橘
    { r: 180, g: 50,  b: 255 }, // 紫
    { r: 30,  g: 40,  b: 160 }  // 深藍
];

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let startTime = Date.now();
const cycleDuration = 15000; // 15秒

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
    return {
        r: Math.round(lerp(c1.r, c2.r, t)),
        g: Math.round(lerp(c1.g, c2.g, t)),
        b: Math.round(lerp(c1.b, c2.b, t))
    };
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function animate() {
    const now = Date.now();
    const elapsed = (now - startTime) % cycleDuration;
    const t = elapsed / cycleDuration;

    // 計算目前在兩個顏色間的補間
    const segment = t * gradients.length;
    const index1 = Math.floor(segment) % gradients.length;
    const index2 = (index1 + 1) % gradients.length;
    const localT = segment - Math.floor(segment);

    const color = lerpColor(gradients[index1], gradients[index2], localT);

    // 填滿背景
    ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);
}

animate();
