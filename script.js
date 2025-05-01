// ===== 動態漸層霓虹燈背景 =====

// 四組霓虹漸層顏色（紅、橘、紫、深藍）
const gradientColors = [
    [
        { r: 255, g: 40,  b: 80  }, // Red
        { r: 255, g: 140, b: 0   }, // Orange
        { r: 180, g: 50,  b: 255 }, // Purple
        { r: 30,  g: 40,  b: 160 }  // Deep Blue
    ],
    [
        { r: 255, g: 140, b: 0   }, // Orange
        { r: 180, g: 50,  b: 255 }, // Purple
        { r: 30,  g: 40,  b: 160 }, // Deep Blue
        { r: 255, g: 40,  b: 80  }  // Red
    ],
    [
        { r: 180, g: 50,  b: 255 }, // Purple
        { r: 30,  g: 40,  b: 160 }, // Deep Blue
        { r: 255, g: 40,  b: 80  }, // Red
        { r: 255, g: 140, b: 0   }  // Orange
    ],
    [
        { r: 30,  g: 40,  b: 160 }, // Deep Blue
        { r: 255, g: 40,  b: 80  }, // Red
        { r: 255, g: 140, b: 0   }, // Orange
        { r: 180, g: 50,  b: 255 }  // Purple
    ]
];

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;

// 畫布自動調整
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 顏色補間
function lerpColor(a, b, t) {
    return {
        r: Math.round(a.r + (b.r - a.r) * t),
        g: Math.round(a.g + (b.g - a.g) * t),
        b: Math.round(a.b + (b.b - a.b) * t)
    };
}

// 取得補間後的漸層顏色陣列
function getInterpolatedColors(colorsA, colorsB, t) {
    return colorsA.map((color, i) => lerpColor(color, colorsB[i], t));
}

// 產生canvas漸層
function createGradient(colors) {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0,    `rgb(${colors[0].r},${colors[0].g},${colors[0].b})`);
    grad.addColorStop(0.35, `rgb(${colors[1].r},${colors[1].g},${colors[1].b})`);
    grad.addColorStop(0.7,  `rgb(${colors[2].r},${colors[2].g},${colors[2].b})`);
    grad.addColorStop(1,    `rgb(${colors[3].r},${colors[3].g},${colors[3].b})`);
    return grad;
}

// 動畫主循環
const DURATION = 15000; // 15秒
let lastIndex = 0;

function animateGradient() {
    const now = Date.now();
    const total = gradientColors.length;
    const cycle = Math.floor(now / DURATION);
    const t = (now % DURATION) / DURATION;

    // 決定目前與下一組漸層
    const idxA = cycle % total;
    const idxB = (cycle + 1) % total;
    const colorsA = gradientColors[idxA];
    const colorsB = gradientColors[idxB];

    // 插值取得目前漸層
    const blended = getInterpolatedColors(colorsA, colorsB, t);

    // 畫背景
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = createGradient(blended);
    ctx.fillRect(0, 0, width, height);

    requestAnimationFrame(animateGradient);
}

animateGradient();
