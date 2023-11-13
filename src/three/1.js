// base examply demo
import {
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Color,
  WebGLRenderer,
} from 'three';

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);

camera.position.z = 3;
// camera.position.x = 2;

// red cube
const geometry = new BoxGeometry(1, 1, 1);

const material = new MeshBasicMaterial({
  color: 0xff0000,
});

const mesh = new Mesh(geometry, material);

scene.add(mesh);
scene.add(camera);

// scene.background = new Color('#000');

window.onload = () => {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const renderer = new WebGLRenderer({
    canvas,
  });
  document.querySelector('#root')?.appendChild(canvas);
  console.log('canvas.width, canvas.height', canvas.width, canvas.height);
  renderer.setSize(canvas.width, canvas.height);

  renderer.render(scene, camera);
};
