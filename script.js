const myPhotos = [
    "1.jpg", "2.jpg", "3.jpg", "4.jpg", 
    "5.jpg", "6.jpg", "7.jpg", "8.jpg",
    "9.jpg", "10.jpg", "11.jpg", "12.jpg",
    "13.jpg", "14.jpg", "15.jpg", "16.jpg",
    "17.jpg", "18.jpg"
];

const myCaptions = [
    "Грустний Викуля❤️", "Факуля", "Наш момент", "Штык :)", 
    "Красотка", "Моё счастье", "Охрана ✨", "Солнце устало)",
    "Милашкааа", "Крутышка", "Адвокат", "РОООООК",
    "Сердце моё", "Прекрасна", "Любимая ❤️", "Пушистик)", 
    "Сияешь", "Глазки"
];

const flowerCanvas = document.getElementById('flowerCanvas');
const fCtx = flowerCanvas.getContext('2d');
const heartCanvas = document.getElementById('heartCanvas');
const hCtx = heartCanvas.getContext('2d');

function resizeCanvases() {
    flowerCanvas.width = heartCanvas.width = window.innerWidth;
    flowerCanvas.height = heartCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvases);
resizeCanvases();

// --- СИСТЕМА САКУРЫ ---
let flowers = [];
class Flower {
    constructor() { this.reset(true); }
    reset(init = false) {
        this.x = Math.random() * flowerCanvas.width;
        this.y = init ? Math.random() * flowerCanvas.height : -20;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 0.8 + 0.5;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    draw() {
        fCtx.save(); fCtx.translate(this.x, this.y); fCtx.rotate(this.angle * Math.PI / 180);
        fCtx.globalAlpha = this.opacity; fCtx.fillStyle = '#ffb7c5'; 
        for (let i = 0; i < 5; i++) {
            fCtx.rotate(72 * Math.PI / 180); fCtx.beginPath();
            fCtx.ellipse(0, this.size/2, this.size/3, this.size/2, 0, 0, 2 * Math.PI); fCtx.fill();
        }
        fCtx.fillStyle = '#ff8fa3'; fCtx.beginPath(); fCtx.arc(0, 0, this.size/5, 0, Math.PI * 2); fCtx.fill();
        fCtx.restore();
    }
    update() {
        this.y += this.speedY; this.x += this.speedX; this.angle += this.spin;
        if (this.y > flowerCanvas.height + 20) this.reset(false);
    }
}

// --- СИСТЕМА СЕРДЕЧЕК ---
let hearts = [];
class Heart {
    constructor(x, y) {
        this.x = x; this.y = y; this.size = Math.random() * 8 + 4;
        this.speedX = (Math.random() - 0.5) * 12; this.speedY = (Math.random() - 0.5) * 12 - 3;
        this.gravity = 0.15; this.opacity = 1;
        this.color = `hsl(${Math.random() * 30 + 340}, 100%, 65%)`;
    }
    draw() {
        hCtx.save(); hCtx.globalAlpha = this.opacity; hCtx.fillStyle = this.color; hCtx.beginPath();
        const d = this.size; hCtx.moveTo(this.x, this.y + d/4);
        hCtx.bezierCurveTo(this.x, this.y, this.x - d, this.y, this.x - d, this.y + d/2);
        hCtx.bezierCurveTo(this.x - d, this.y + d, this.x, this.y + d*1.3, this.x, this.y + d*1.6);
        hCtx.bezierCurveTo(this.x, this.y + d*1.3, this.x + d, this.y + d, this.x + d, this.y + d/2);
        hCtx.bezierCurveTo(this.x + d, this.y, this.x, this.y, this.x, this.y + d/4);
        hCtx.fill(); hCtx.restore();
    }
    update() { this.speedY += this.gravity; this.x += this.speedX; this.y += this.speedY; this.opacity -= 0.02; }
}

function initFlowers() { flowers = []; for (let i = 0; i < 35; i++) flowers.push(new Flower()); }
function animate() {
    fCtx.clearRect(0, 0, flowerCanvas.width, flowerCanvas.height);
    hCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
    flowers.forEach(f => { f.update(); f.draw(); });
    for (let i = 0; i < hearts.length; i++) {
        hearts[i].update(); hearts[i].draw();
        if (hearts[i].opacity <= 0) { hearts.splice(i, 1); i--; }
    }
    requestAnimationFrame(animate);
}

// --- МАГИЯ 3D КАРУСЕЛИ ---
let currentRotation = 0;

function rotateCarousel(direction) {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    
    const total = myPhotos.length;
    const angleStep = 360 / total;
    
    currentRotation -= direction * angleStep;
    carousel.style.transform = `rotateY(${currentRotation}deg)`;
}

function startMagic(e) {
    const gallery = document.getElementById('photoGallery');
    const card = document.getElementById('mainCard');
    const btn = e.target;

    if (gallery.style.display === 'none' || gallery.innerHTML === '') {
        card.classList.add('expanded');
        
        document.getElementById('title').innerHTML = "Ты — моё вдохновение! ❤️";
        document.getElementById('description').innerHTML = "Викуля, пусть эта весна будет такой же яркой, как твоя улыбка. Крути наше колесо!";
        
        gallery.style.display = 'flex';
        gallery.innerHTML = '<div id="carousel" class="carousel-view"></div>';
        const carousel = document.getElementById('carousel');

        const total = myPhotos.length;
        // УВЕЛИЧИЛИ РАДИУС ДЛЯ БОЛЬШЕГО РАССТОЯНИЯ
const radius = window.innerWidth > 480 ? 530 : 400;
        
        myPhotos.forEach((src, i) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            const angle = i * (360 / total);
            item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

            const img = document.createElement('img');
            img.src = src;
            img.onclick = (event) => {
                event.stopPropagation();
                openModal(src);
            };

            const cap = document.createElement('div');
            cap.className = 'photo-caption';
            cap.innerText = myCaptions[i] || "Люблю ❤️";

            item.appendChild(img);
            item.appendChild(cap);
            carousel.appendChild(item);
        });

        const controls = document.getElementById('controls');
        if(controls) controls.style.display = 'flex';
        
        const finalLetter = document.getElementById('finalLetter');
        if(finalLetter) finalLetter.style.display = 'block';

        let isDragging = false, lastX;
        const handleStart = (x) => { isDragging = true; lastX = x; };
        const handleMove = (x) => {
            if (!isDragging) return;
            let diff = (x - lastX) * 0.4;
            currentRotation += diff;
            carousel.style.transform = `rotateY(${currentRotation}deg)`;
            lastX = x;
        };

        gallery.onmousedown = (ev) => handleStart(ev.pageX);
        window.onmousemove = (ev) => handleMove(ev.pageX);
        window.onmouseup = () => isDragging = false;
        
        gallery.ontouchstart = (ev) => handleStart(ev.touches[0].pageX);
        gallery.ontouchmove = (ev) => {
            ev.preventDefault();
            handleMove(ev.touches[0].pageX);
        };
        gallery.ontouchend = () => isDragging = false;
    }

    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 40; i++) hearts.push(new Heart(rect.left + rect.width / 2, rect.top + rect.height / 2));
}

function openModal(src) {
    const modal = document.getElementById('photoModal');
    document.getElementById('fullImage').src = src;
    modal.style.display = "flex";
}
function closeModal() { document.getElementById('photoModal').style.display = "none"; }

initFlowers();
animate();


