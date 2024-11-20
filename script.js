// Initialization
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Skybox
let loader = new THREE.CubeTextureLoader();
let texture = loader.load([
    './skybox/posx.png', './skybox/negx.png',
    './skybox/posy.png', './skybox/negy.png',
    './skybox/posz.png', './skybox/negz.png'
]);
scene.background = texture;

// Camera controls
let controls = {
    isDragging: false,
    previousX: 0,
    previousY: 0
};

let pitch = 0;
let yaw = 0; 

window.addEventListener('mousedown', function (event) {
    controls.isDragging = true;
    controls.previousX = event.clientX;
    controls.previousY = event.clientY;
});

window.addEventListener('mousemove', function (event) {
    if (!controls.isDragging) return;

    let deltaX = event.clientX - controls.previousX;
    let deltaY = event.clientY - controls.previousY;

    yaw -= deltaX * 0.0025;
    pitch -= deltaY * 0.0025;

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