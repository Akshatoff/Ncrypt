import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const upload = document.getElementById("upload");
const view = document.getElementById("view");
const uploads = document.getElementById("uploadsection");
const views = document.getElementById("viewsection")
const dd = document.getElementById("dd");
const image = document.getElementById("image");
const model = document.getElementById("model")
const poster = document.getElementById("poster");
const da = document.getElementById("da");

image.style.display = "none";
model.style.display = "none";
poster.style.display = "none";
da.style.display = "none";


dd.addEventListener("change", function () {
    if (dd.value == 1) {
        image.style.display = "block";
        model.style.display = "none";
        poster.style.display = "none";
        da.style.display = "none";
    }
    if (dd.value == 2) {
        model.style.display = "block";
        image.style.display = "none";
        poster.style.display = "none";
        da.style.display = "none";
    }
    if (dd.value == 3) {
        poster.style.display = "block";
        image.style.display = "none";
        model.style.display = "none";
        da.style.display = "none";
    }
    if (dd.value == 4) {
        da.style.display = "block";
        image.style.display = "none";
        model.style.display = "none";
        poster.style.display = "none";
    }
})






upload.classList.add("active");

upload.addEventListener("click", function () {
    upload.classList.add("active");
    view.classList.remove("active");
    views.style.display = "none";
    uploads.style.display = "flex";
})

view.addEventListener("click", function () {
    upload.classList.remove("active");
    view.classList.add("active")
    uploads.style.display = "none";
    views.style.display = "block";
})

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const containerf = document.getElementById('containerform');
const transbtn = document.getElementById("tran");


signUpButton.addEventListener('click', () => {
    containerf.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    containerf.classList.remove("right-panel-active");
});

transbtn.addEventListener("click", function () {
    containerf.classList.add("right-panel-active");


})



const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let object;
let stars = [];

let objToRender = "robo"

const loader = new GLTFLoader();

loader.load(
    `../assets/${objToRender}/scene.gltf`,
    function (gltf) {
        object = gltf.scene;
        scene.add(object);
        console.log(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error(error);
    }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container").appendChild(renderer.domElement);

camera.position.z = 5;

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500)
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xE5771C });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    star.originalPosition = { x, y, z };
    scene.add(star);

    return star;
}

Array(400).fill().forEach(() => {
    stars.push(addStar());
});

function animateStars() {
    const time = Date.now() * 0.001;
    stars.forEach((star, index) => {
        // Calculate offset based on mouse position
        const offsetX = (mouseX - window.innerWidth / 2) * 0.0001;
        const offsetY = (mouseY - window.innerHeight / 2) * 0.0001;

        // Add a unique phase for each star based on its index
        const phase = index * 0.1;

        // Calculate new position
        star.position.x = star.originalPosition.x + Math.sin(time + phase) * 2 + offsetX * 50;
        star.position.y = star.originalPosition.y + Math.cos(time + phase) * 2 - offsetY * 50;
        star.position.z = star.originalPosition.z + Math.sin(time + phase) * 2;
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (object && objToRender === "robo") {
        object.rotation.y = 6.1 + mouseX / window.innerWidth * 0.3;
        object.rotation.x = 0 + mouseY * 0.3 / window.innerHeight;
    }
    animateStars();
    renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

animate();