// Config
const skyboxes_location = "./skyboxes/";
const game_location = "Timberland";

// Initialization
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Skybox
let loader = new THREE.CubeTextureLoader();
let texture = loader.load([
    `${skyboxes_location}${game_location}/panorama_1.png`,/* X+ */ `${skyboxes_location}${game_location}/panorama_3.png`, /* X- */
    `${skyboxes_location}${game_location}/panorama_4.png`,/* Y+ */ `${skyboxes_location}${game_location}/panorama_5.png`, /* Y- */
    `${skyboxes_location}${game_location}/panorama_0.png`,/* Z+ */ `${skyboxes_location}${game_location}/panorama_2.png`  /* Z- */
]);
scene.background = texture;

// Camera controls
let controls = {
    isDragging: false,
    previousX: 0,
    previousY: 0,
    touchStartX: 0,
    touchStartY: 0
};

let pitch = 0;
let yaw = 0; 

// Mouse events for desktop
window.addEventListener('mousedown', function (event) {
    controls.isDragging = true;
    controls.previousX = event.clientX;
    controls.previousY = event.clientY;
});

let deltaX = controls.previousX;
let deltaY = controls.previousY;

yaw -= deltaX * 0.0025;
pitch -= deltaY * 0.0025;

pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch));

const direction = new THREE.Vector3();
direction.x = Math.cos(pitch) * Math.sin(yaw);
direction.y = Math.sin(pitch);
direction.z = Math.cos(pitch) * Math.cos(yaw);

camera.lookAt(camera.position.clone().add(direction));

window.addEventListener('mousemove', function (event) {
    if (!controls.isDragging) return;

    let deltaX = event.clientX - controls.previousX;
    let deltaY = event.clientY - controls.previousY;

    yaw += deltaX * 0.0025;
    pitch += deltaY * 0.0025;

    pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch));

    const direction = new THREE.Vector3();
    direction.x = Math.cos(pitch) * Math.sin(yaw);
    direction.y = Math.sin(pitch);
    direction.z = Math.cos(pitch) * Math.cos(yaw);

    camera.lookAt(camera.position.clone().add(direction));

    controls.previousX = event.clientX;
    controls.previousY = event.clientY;
});

window.addEventListener('mouseup', function () {
    controls.isDragging = false;
});

// Touch events for mobile
window.addEventListener('touchstart', function (event) {
    if (event.touches.length === 1) {
        controls.isDragging = true;
        controls.touchStartX = event.touches[0].clientX;
        controls.touchStartY = event.touches[0].clientY;
    }
});

window.addEventListener('touchmove', function (event) {
    if (!controls.isDragging || event.touches.length !== 1) return;

    let deltaX = event.touches[0].clientX - controls.touchStartX;
    let deltaY = event.touches[0].clientY - controls.touchStartY;

    yaw += deltaX * 0.0025;
    pitch += deltaY * 0.0025;

    pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch));

    const direction = new THREE.Vector3();
    direction.x = Math.cos(pitch) * Math.sin(yaw);
    direction.y = Math.sin(pitch);
    direction.z = Math.cos(pitch) * Math.cos(yaw);

    camera.lookAt(camera.position.clone().add(direction));

    controls.touchStartX = event.touches[0].clientX;
    controls.touchStartY = event.touches[0].clientY;
});

window.addEventListener('touchend', function () {
    controls.isDragging = false;
});

camera.position.set(0, 0, 0.1);

window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();