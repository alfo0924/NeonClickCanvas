// ====== 霓虹漸層背景動畫 ======

// 定義漸層顏色組
const gradients = [
    // 紅 → 橘 → 紫 → 深藍
    [
        { r: 255, g: 50,  b: 80  }, // 紅
        { r: 255, g: 140, b: 0   }, // 橘
        { r: 180, g: 50,  b: 255 }, // 紫
        { r: 30,  g: 40,  b: 160 }  // 深藍
    ],
    [
        { r: 255, g: 140, b: 0   }, // 橘
        { r: 180, g: 50,  b: 255 }, // 紫
        { r: 30,  g: 40,  b: 160 }, // 深藍
        { r: 255, g: 50,  b: 80  }  // 紅
    ],
    [
        { r: 180, g: 50,  b: 255 }, // 紫
        { r: 30,  g: 40,  b: 160 }, // 深藍
        { r: 255, g: 50,  b: 80  }, // 紅
        { r: 255, g: 140, b: 0   }  // 橘
    ],
    [
        { r: 30,  g: 40,  b: 160 }, // 深藍
        { r: 255, g: 50,  b: 80  }, // 紅
        { r: 255, g: 140, b: 0   }, // 橘
        { r: 180, g: 50,  b: 255 }  // 紫
    ]
];
let currentGradient = 0;
let nextGradient = 1;
let gradientStep = 0;
const gradientDuration = 15000; // 15秒
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// ====== 幾何圖形資料結構 ======
let shapes = [];
let clickCount = 0;
let lastClickTime = 0;
let resetTimer = null;

// ====== 輔助函數 ======

// 補間顏色
function lerpColor(a, b, t) {
    return {
        r: Math.round(a.r + (b.r - a.r) * t),
        g: Math.round(a.g + (b.g - a.g) * t),
        b: Math.round(a.b + (b.b - a.b) * t)
    };
}

// 產生CSS漸層字串
function getGradientString(colors) {
    return `linear-gradient(120deg, rgb(${colors[0].r},${colors[0].g},${colors[0].b}) 0%, rgb(${colors[1].r},${colors[1].g},${colors[1].b}) 35%, rgb(${colors[2].r},${colors[2].g},${colors[2].b}) 70%, rgb(${colors[3].r},${colors[3].g},${colors[3].b}) 100%)`;
}

// ====== 畫布自動調整 ======
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ====== 主動畫循環 ======
function animate() {
    // 計算漸層進度
    const now = Date.now();
    gradientStep = ((now % gradientDuration) / gradientDuration);

    // 取得當前與下一組漸層
    let cgs = gradients[currentGradient];
    let ngs = gradients[nextGradient];

    // 補間顏色
    let blended = [];
    for (let i = 0; i < 4; i++) {
        blended.push(lerpColor(cgs[i], ngs[i], gradientStep));
    }

    // 畫漸層背景
    let grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, `rgb(${blended[0].r},${blended[0].g},${blended[0].b})`);
    grad.addColorStop(0.35, `rgb(${blended[1].r},${blended[1].g},${blended[1].b})`);
    grad.addColorStop(0.7, `rgb(${blended[2].r},${blended[2].g},${blended[2].b})`);
    grad.addColorStop(1, `rgb(${blended[3].r},${blended[3].g},${blended[3].b})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 畫所有幾何圖形
    shapes.forEach(shape => {
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.fillStyle = shape.color;
        switch (shape.type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rect':
                ctx.fillRect(-shape.size/2, -shape.size/2, shape.size, shape.size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -shape.size);
                ctx.lineTo(shape.size, shape.size);
                ctx.lineTo(-shape.size, shape.size);
                ctx.closePath();
                ctx.fill();
                break;
            case 'pentagon':
                ctx.beginPath();
                for(let i=0;i<5;i++) {
                    let angle = (Math.PI*2/5)*i - Math.PI/2;
                    let x = Math.cos(angle)*shape.size;
                    let y = Math.sin(angle)*shape.size;
                    if(i===0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.restore();
    });

    // 換漸層組
    if (gradientStep >= 0.99) {
        currentGradient = (currentGradient + 1) % gradients.length;
        nextGradient = (currentGradient + 1) % gradients.length;
    }

    requestAnimationFrame(animate);
}
animate();

// ====== 點擊產生幾何圖形 ======
function randomColor() {
    // 亮色系霓虹
    const colors = [
        '#ff3e7c', '#ffb347', '#b46aff', '#3f51b5', '#39e6ff', '#ffec40', '#ff6f61', '#e040fb'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
function randomShapeType() {
    const types = ['circle', 'rect', 'triangle', 'pentagon'];
    return types[Math.floor(Math.random() * types.length)];
}
function randomRotation() {
    return Math.random() * Math.PI * 2;
}
function randomSize() {
    return 24 + Math.random() * 36;
}

canvas.addEventListener('pointerdown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 幾何數量根據連續點擊次數增加
    clickCount++;
    for(let i=0; i<clickCount; i++) {
        shapes.push({
            x: x + (Math.random()-0.5)*20,
            y: y + (Math.random()-0.5)*20,
            size: randomSize(),
            color: randomColor(),
            type: randomShapeType(),
            rotation: randomRotation()
        });
    }

    // 重設歸零計時
    lastClickTime = Date.now();
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(resetClickCount, 5000);
});

// ====== 5秒沒點擊自動歸零 ======
function resetClickCount() {
    clickCount = 0;
}

// ====== 可選：自動縮放畫布 ======
window.addEventListener('resize', resizeCanvas);
