// transform object
import {
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
  AxesHelper,
} from 'three';

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);

camera.position.z = 3;
camera.position.y = 1;
// camera.position.x = 2;

// red cube
const geometry = new BoxGeometry(1, 1, 1);

const material = new MeshBasicMaterial({
  color: 0xff0000,
});

const mesh = new Mesh(geometry, material);

// 移动到
mesh.position.distanceTo(camera.position);
// 当向量距离大于1的时候会让物体到达网格距离为1的位置
mesh.position.normalize();
console.log('mesh.position.length()', mesh.position.length());
mesh.scale.x = 2;
mesh.position.set(0, 0, 0);

camera.lookAt(mesh.position);

scene.add(mesh);
scene.add(camera);
// Axes helper
const axesHelper = new AxesHelper(5);
scene.add(axesHelper);
// scene.background = new Color('#000');
// 重新排变化的顺序
mesh.rotation.reorder('ZXY');
// rotation
mesh.rotation.z = Math.PI / 4;
mesh.rotation.x = Math.PI / 2;

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
