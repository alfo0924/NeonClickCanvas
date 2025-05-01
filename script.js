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

// ====== 互動效果變數 ======
let shapes = [];
let clickCount = 0;
let lastClickTime = 0;
let resetTimer = null;

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

// ====== 隨機幾何圖形生成函數 ======
function randomColor() {
    // 亮色系霓虹
    const colors = [
        '#ff3e7c', '#ffb347', '#b46aff', '#3f51b5', '#39e6ff', '#ffec40', '#ff6f61', '#e040fb'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function randomShapeType() {
    const types = ['circle', 'rect', 'triangle', 'pentagon', 'hexagon', 'star'];
    return types[Math.floor(Math.random() * types.length)];
}

function randomRotation() {
    return Math.random() * Math.PI * 2;
}

function randomSize() {
    // 基礎大小 + 累加因子
    return 20 + Math.random() * 30 + (clickCount * 2);
}

// ====== 點擊事件處理 ======
canvas.addEventListener('pointerdown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 增加點擊計數
    clickCount++;

    // 根據點擊次數增加圖形數量
    for (let i = 0; i < Math.min(clickCount, 5); i++) {
        shapes.push({
            x: x + (Math.random() - 0.5) * 50,
            y: y + (Math.random() - 0.5) * 50,
            size: randomSize(),
            color: randomColor(),
            type: randomShapeType(),
            rotation: randomRotation(),
            opacity: 1,
            scale: 1,
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                rotation: (Math.random() - 0.5) * 0.05
            }
        });
    }

    // 重設計時器
    lastClickTime = Date.now();
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(resetShapes, 5000);
});

// ====== 重設函數 ======
function resetShapes() {
    shapes = [];
    clickCount = 0;
}

// ====== 繪製幾何圖形 ======
function drawShapes() {
    shapes.forEach((shape, index) => {
        ctx.save();
        ctx.globalAlpha = shape.opacity;
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.scale(shape.scale, shape.scale);
        ctx.fillStyle = shape.color;

        switch (shape.type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'rect':
                ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                break;

            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -shape.size / 2);
                ctx.lineTo(shape.size / 2, shape.size / 2);
                ctx.lineTo(-shape.size / 2, shape.size / 2);
                ctx.closePath();
                ctx.fill();
                break;

            case 'pentagon':
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                    const px = Math.cos(angle) * shape.size / 2;
                    const py = Math.sin(angle) * shape.size / 2;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                break;

            case 'hexagon':
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI * 2 / 6) * i;
                    const px = Math.cos(angle) * shape.size / 2;
                    const py = Math.sin(angle) * shape.size / 2;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                break;

            case 'star':
                ctx.beginPath();
                for (let i = 0; i < 10; i++) {
                    const angle = (Math.PI * 2 / 10) * i - Math.PI / 2;
                    const radius = i % 2 === 0 ? shape.size / 2 : shape.size / 4;
                    const px = Math.cos(angle) * radius;
                    const py = Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                break;
        }

        ctx.restore();

        // 更新圖形位置和旋轉
        shape.x += shape.velocity.x;
        shape.y += shape.velocity.y;
        shape.rotation += shape.velocity.rotation;

        // 邊界檢查
        if (shape.x < -shape.size || shape.x > canvas.width + shape.size ||
            shape.y < -shape.size || shape.y > canvas.height + shape.size) {
            // 超出邊界的圖形重新放回畫面中央
            shape.x = canvas.width / 2 + (Math.random() - 0.5) * 100;
            shape.y = canvas.height / 2 + (Math.random() - 0.5) * 100;
        }
    });
}

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

    // 繪製所有幾何圖形
    drawShapes();

    requestAnimationFrame(animate);
}

animate();
