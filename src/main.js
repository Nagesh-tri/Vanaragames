import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// Renderer setup
const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Ground plane
const groundGeometry = new THREE.PlaneGeometry(20, 20, 100, 100); // More segments for better detail
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3d8c40, // Green color like grass
    roughness: 0.9,   // More rough for grass-like texture
    metalness: 0.1,   // Low metalness for organic look
    flatShading: true // Gives subtle surface variations
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Cube
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-3, 1, 0);
cube.castShadow = true;
scene.add(cube);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff00ff,
    metalness: 0.3,
    roughness: 0.4
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 1, 0);
sphere.castShadow = true;

// Raycaster setup for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Click event listener
canvas.addEventListener('click', (event) => {
    console.log('Click detected');
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('Mouse position:', mouse);

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    console.log('Intersections:', intersects);

    // Check if sphere was clicked
    for (const intersect of intersects) {
        if (intersect.object === sphere) {
            console.log('Sphere clicked!');
            // Generate random color
            const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
            console.log('New color:', randomColor);
            sphere.material.color.set(randomColor);
            sphere.material.needsUpdate = true; // Force material update
            break;
        }
    }
});

scene.add(sphere);





// Cone
const coneGeometry = new THREE.ConeGeometry(1, 2, 32);
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(3, 1, 0);
cone.castShadow = true;
scene.add(cone);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate objects
    cube.rotation.y += 0.01;
    sphere.rotation.y += 0.01;
    cone.rotation.y += 0.01;
  
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
