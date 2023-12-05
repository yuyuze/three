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
  BufferAttribute,
  Texture,
  TextureLoader,
  LoadingManager,
  RepeatWrapping,
  MirroredRepeatWrapping,
  NearestFilter,
  AmbientLight,
  SpotLight,
  DoubleSide,
  SRGBColorSpace,
  MeshNormalMaterial,
  MeshMatcapMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  SphereGeometry,
  Color,
  MeshToonMaterial,
  MeshStandardMaterial,
  EquirectangularReflectionMapping
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { GUI } from 'dat.gui';
import { load } from 'three/addons/libs/opentype.module.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

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
const geometry = new BoxGeometry(1, 1, 1, 128, 128, 128);
// red cube
// const geometry = new SphereGeometry(1);
// const image = new Image();
// image.src = '/textures/door/color.jpg';
// const textures = new Texture(image);
// image.onload = function() {
//   textures.needsUpdate = true
// }
const loadingManager = new LoadingManager();
const rgbeLoader = new RGBELoader();

loadingManager.onStart = () => {};
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(
    'Loading file: ' +
      url +
      '.\nLoaded ' +
      itemsLoaded +
      ' of ' +
      itemsTotal +
      ' files.'
  );
};
loadingManager.onLoad = () => {};
loadingManager.onError = () => {};
const textureLoader = new TextureLoader(loadingManager);
// load progress error function
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
const colorTexture = textureLoader.load('/textures/door/color.jpg');
colorTexture.colorSpace = SRGBColorSpace;
// 透明贴图 黑色地方不可见
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
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

// const material = new MeshBasicMaterial({
//   // color: 0xffffff
//   // wireframe: true
//   // 纹理贴图
//   map: colorTexture
// });
// const material = new MeshNormalMaterial({});
// normal
// material.flatShading = true;
// material.opacity = 0.5;
// 编码了材质颜色与明暗
// const material = new MeshMatcapMaterial({});
// 深度基于相机远近平面。白色最近，黑色最远。
// const material = new MeshDepthMaterial();
// 基于非物理的Lambertian模型来计算反射率
// const material = new MeshLambertMaterial();
// 该材质可以模拟具有镜面高光的光泽表面（例如涂漆木材
// const material = new MeshPhongMaterial();
// // 高亮的程度，越高的值越闪亮
// material.shininess = 100;
// material.specular = new Color('red');
// 一种实现卡通着色的材质。
// const material = new MeshToonMaterial();
//
// material.transparent = true;
// material.alphaMap = alphaTexture;
// 一种基于物理的标准材质
const material = new MeshStandardMaterial({ color: 0xffffff });
material.map = colorTexture;
// 灰度纹理，用于控制整个表面的不透明度
material.alphaMap = alphaTexture;
material.transparent = true;
material.roughness = 0;
const dat = new GUI();
dat.add(material, 'metalness').min(0).max(1).step(0.0001);
dat.add(material, 'roughness').min(0).max(1).step(0.0001);
material.side = DoubleSide;
const mesh = new Mesh(geometry, material);
mesh.geometry.setAttribute(
  'uv2',
  new BufferAttribute(mesh.geometry.attributes.uv.array, 2)
);
material.aoMap = ambientOcclusionTexture;
material.aoMapIntensity = 1.9306;
// 需要顶点设多一点
material.displacementMap = heightTexture;
material.displacementScale = 0.05;
// 金属贴图
material.metalnessMap = metalnessTexture;
// 粗糙贴图
material.roughnessMap = roughnessTexture;
// 法线贴图 光照反射
material.normalMap = normalTexture;
// 法线贴图对材质的影响程度
material.normalScale.set(1, 1);
dat.add(material, 'displacementScale').min(0).max(10).step(0.0001);
dat.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
const spotLight = new SpotLight(0xffffff, 0.5);
const ambientLight = new AmbientLight(0xffffff, 1);
ambientLight.position.set(0, 0, 0);
spotLight.position.x = 5;
spotLight.position.y = 5;
spotLight.position.z = 5;
// ambientLight.lookAt(mesh);
scene.add(ambientLight);
scene.add(spotLight);
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
rgbeLoader
  .loadAsync('/textures/kloofendal_48d_partly_cloudy_puresky_4k.hdr')
  .then((texture) => {
    material.envMap = texture;

    texture.mapping = EquirectangularReflectionMapping; // 设置映射类型
    scene.background = texture; // 设置背景
    scene.environment = texture; // 设置环境贴图
  });
window.onload = () => {
  const canvas = document.createElement('canvas');
  canvas.width = sizes.width;
  canvas.height = sizes.height;
  const renderer = new WebGLRenderer({
    canvas
    // alpha: true
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
