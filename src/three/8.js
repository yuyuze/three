// animations
import {
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
  AxesHelper,
  Clock,
  OrthographicCamera,
  BufferGeometry,
  BufferAttribute, Texture, TextureLoader, LoadingManager, RepeatWrapping, MirroredRepeatWrapping, NearestFilter
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { GUI } from 'dat.gui';
import { load } from 'three/addons/libs/opentype.module.js';

console.log('OrbitControls', OrbitControls);
const scene = new Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
// 透视相机
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);

// camera
// 自动拍照相机
// const aspectRatio = window.innerWidth / window.innerHeight;
// const camera = new OrthographicCamera(-aspectRatio, aspectRatio,1, -1, 0.1 , 100);

camera.position.z = 2;

// red cube
const geometry = new BoxGeometry(1, 1, 1, 10, 10, 10);
// const image = new Image();
// image.src = '/textures/door/color.jpg';
// const textures = new Texture(image);
// image.onload = function() {
//   textures.needsUpdate = true
// }
const loadingManager = new LoadingManager();
loadingManager.onStart = () => {

}
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
}
loadingManager.onLoad = () => {

}
loadingManager.onError = () => {

}
const textureLoader = new TextureLoader(loadingManager)
// load progress error function
const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
// const colorTexture = textureLoader.load('/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// // 镜像包裹
// colorTexture.wrapS = MirroredRepeatWrapping;
// // 包裹重复
// colorTexture.wrapT = RepeatWrapping;
//
// colorTexture.offset.x = 0.5;
// colorTexture.rotation = Math.PI / 4
// 使用minfilter为nearestFilter要使用generateMipmaps false
colorTexture.generateMipmaps = false;
colorTexture.minFilter = NearestFilter;
// 过滤器 小的纹理放大会模糊,可以锐化纹理
colorTexture.magFilter = NearestFilter;
// const geometry = new BufferGeometry();
// const indices = [0, 1, 2, 2, 3, 0];
// const vertices = new Float32Array([
//   -1.0,
//   -1.0,
//   1.0, // v0
//   1.0,
//   -1.0,
//   1.0, // v1
//   1.0,
//   1.0,
//   1.0, // v2

//   1.0,
//   1.0,
//   1.0, // v3
//   -1.0,
//   1.0,
//   1.0, // v4
//   -1.0,
//   -1.0,
//   1.0 // v5
// ]);
// // 位置的顺序 索引
// geometry.setIndex(indices);
// geometry.setAttribute('position', new BufferAttribute(vertices, 3));
const debugParam = {
  color: 0xffffff,
  test: '',
  test2: '',
  test3: ''
};
const material = new MeshBasicMaterial({
  // color: debugParam.color,
  // wireframe: true
  // 纹理贴图
  map: colorTexture
});

const mesh = new Mesh(geometry, material);

camera.lookAt(mesh.position);
const fn = {
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  }
};
scene.add(camera);
scene.add(mesh);
// Axes helper
const axesHelper = new AxesHelper(5);
scene.add(axesHelper);

window.onload = () => {
  const canvas = document.createElement('canvas');
  canvas.width = sizes.width;
  canvas.height = sizes.height;
  const renderer = new WebGLRenderer({
    canvas
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.querySelector('#root')?.append(renderer.domElement);

  console.log('canvas.width, canvas.height', canvas.width, canvas.height);
  // renderer.setSize(canvas.width, canvas.height);
  renderer.domElement.className = 'webgl';
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.update();
  // 对应切换屏幕的时候 做的操作防止他出现锯齿
  renderer.setSize(sizes.width, sizes.height);
  // document.getElementById('root').appendChild(renderer.domElement)
  // time 存储事件
  //  let time = Date.now();
  // 解决方法二
  const clock = new Clock();
  const cursor = {
    x: 0,
    y: 0
  };
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
    // update camera
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // // up是正的所以要负号
    // camera.position.y = cursor.y * 3;
    camera.lookAt(0, 0, 0);
    controls.update();
    // render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }
  tick();
  // h键显示隐藏
  // const gui = new GUI({ closed: true });
  const gui = new GUI();

  // gui.hide();
  const ceshiFolder = gui.addFolder('测试');
  ceshiFolder.add(mesh.position, 'x', -3, 3, 1).name('mesh的x位置');
  ceshiFolder.add(mesh, 'visible').name('mesh显隐');
  ceshiFolder.add(mesh.material, 'wireframe').name('wireframe');
  ceshiFolder.add(debugParam, 'test', ['一级', '二级']).name('下拉框');
  ceshiFolder.add(debugParam, 'test3').name('text');

  ceshiFolder
    .add(debugParam, 'test2', {
      二级: 0.01,
      三级: 0.001
    })
    .name('下拉框');

  ceshiFolder.addColor(debugParam, 'color').onChange(() => {
    material.color.set(debugParam.color);
  });
  ceshiFolder.add(fn, 'spin');
  // window.addEventListener('mousemove', event => {
  //   cursor.x = event.clientX / window.innerWidth - 0.5;
  //   cursor.y = -(event.clientY / window.innerHeight - 0.5);
  //   console.log(cursor)
  // })
  // 像素比 pixel ratio
  window.addEventListener('resize', (event) => {
    console.log(1111);
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    // 对应切换屏幕的时候 做的操作防止他出现锯齿
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
  });

  window.addEventListener(
    'dblclick',
    function (e) {
      e.stopPropagation();
      const fullScreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;
      if (fullScreenElement !== renderer.domElement) {
        if (renderer.domElement.requestFullscreen) {
          renderer.domElement.requestFullscreen();
        } else if (renderer.domElement.webkitRequestFullscreen) {
          renderer.domElement.webkitRequestFullscreen();
        }
      } else {
        if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    },
    true
  );
};
