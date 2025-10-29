const App = {
    scene: null,
    camera: null,
    renderer: null,
    container: document.getElementById('app'),
    orbit: {
        theta: 0,
        phi: Math.PI / 2,
    },
    pointer: {
        isDown: false,
        lastX: 0,
        lastY: 0,
        rotSpeed: 0.001,
        zoomSpeed: 2
    }
};

(function init() {
    const { container } = App;

    // Renderer
    App.renderer = new THREE.WebGLRenderer({ antialias: true });
    App.renderer.setPixelRatio(window.devicePixelRatio || 1);
    App.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(App.renderer.domElement);

    // Scene
    App.scene = new THREE.Scene();

    // Camera
    App.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    App.camera.position.set(0, 0, 0);

    // ubeTexture
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '../skyboxes/Timberland/panorama_1.png', // +X
        '../skyboxes/Timberland/panorama_3.png', // -X
        '../skyboxes/Timberland/panorama_4.png', // +Y
        '../skyboxes/Timberland/panorama_5.png', // -Y
        '../skyboxes/Timberland/panorama_0.png', // +Z
        '../skyboxes/Timberland/panorama_2.png'  // -Z
    ]);
    texture.encoding = THREE.sRGBEncoding;
    App.scene.background = texture;

    // Input
    const canvas = App.renderer.domElement;
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    animate();
})();

// -----------------------
// Input handlers
// -----------------------
function onPointerDown(e) {
    App.pointer.isDown = true;
    App.pointer.lastX = e.clientX;
    App.pointer.lastY = e.clientY;
}

function onPointerMove(e) {
    if (!App.pointer.isDown) return;
    const dx = e.clientX - App.pointer.lastX;
    const dy = e.clientY - App.pointer.lastY;
    App.pointer.lastX = e.clientX;
    App.pointer.lastY = e.clientY;

    App.orbit.theta += dx * App.pointer.rotSpeed;
    App.orbit.phi -= dy * App.pointer.rotSpeed;

    // Clamp vertical angle to avoid flipping
    const minPhi = THREE.MathUtils.degToRad(5);
    const maxPhi = THREE.MathUtils.degToRad(175);
    App.orbit.phi = Math.max(minPhi, Math.min(maxPhi, App.orbit.phi));
}

function onPointerUp() {
    App.pointer.isDown = false;
}

function onWheel(e) {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    App.camera.fov += delta * App.pointer.zoomSpeed;
    App.camera.fov = Math.max(30, Math.min(100, App.camera.fov));
    App.camera.updateProjectionMatrix();
}

function onResize() {
    const { container, renderer, camera } = App;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// -----------------------
// Animate
// -----------------------
function animate() {
    requestAnimationFrame(animate);

    const r = 1;
    const x = r * Math.sin(App.orbit.phi) * Math.sin(App.orbit.theta);
    const y = r * Math.cos(App.orbit.phi);
    const z = r * Math.sin(App.orbit.phi) * Math.cos(App.orbit.theta);
    App.camera.lookAt(x, y, z);

    App.renderer.outputEncoding = THREE.sRGBEncoding;
    App.renderer.render(App.scene, App.camera);
}
