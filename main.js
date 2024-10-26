import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const canvas = document.querySelector('.canvas');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const cursor = {
    x: 0,
    y: 0,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
camera.position.y = 3;
scene.add(camera);

   
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const light = new THREE.AmbientLight(0x404040, 10)
    scene.add(light);
const dirLight = new THREE.DirectionalLight(0xffffff, 10)
    dirLight.position.set(-2,1,1)
    dirLight.castShadow = true
    scene.add(dirLight)

//плоскость 
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10,10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5,
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);  


//GLTF Loader
const loader = new GLTFLoader();
loader.load('/models/garage_color/garage_color.gltf', (gltf) => {
        console.log('succes');
        console.log(gltf);
       gltf.scene.scale.set(0.2, 0.2, 0.2);
   scene.add(gltf.scene);
});

const tick = () => {
    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();

window.addEventListener('resize', () => {
    // Обновляем размеры
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Обновляем соотношение сторон камеры
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Обновляем renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});