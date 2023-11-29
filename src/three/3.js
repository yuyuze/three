// animations
import {
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
  AxesHelper,
  Clock
} from 'three';
import gsap from 'gsap'

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
  color: 0xff0000
});

const mesh = new Mesh(geometry, material);

camera.lookAt(mesh.position);

scene.add(camera);
scene.add(mesh)
// Axes helper
const axesHelper = new AxesHelper(5);
scene.add(axesHelper);

window.onload = () => {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const renderer = new WebGLRenderer({
    canvas
  });
  document.querySelector('#root')?.appendChild(canvas);
  console.log('canvas.width, canvas.height', canvas.width, canvas.height);
  renderer.setSize(canvas.width, canvas.height);
 // time 存储事件
 //  let time = Date.now();
  gsap.to(mesh.position, { duration: 1, delay: 1, x: 2  })
  // 解决方法二
  const clock = new Clock()
  function tick() {
    // // 如何固定帧率 解决方法一
    // const currentTime = Date.now();
    // // 时间差
    // const deltaTime = currentTime - time;
    //
    // time = currentTime;
    //
    // console.log('tick')
    // // 无论帧速率如何，都已相同速度旋转
    // mesh.position.x += 0.00001 * deltaTime

    // clock 记录当前开始的时间到现在为止的时间
    // const elapsedTime = clock.getElapsedTime()
    // mesh.rotation.y = elapsedTime *  (Math.PI / 2);
    // render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }
  tick()
};
