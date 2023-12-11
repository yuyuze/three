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
  DoubleSide,
  PlaneGeometry,
  TextureLoader,
  EquirectangularReflectionMapping,
  SphereGeometry,
  Box3Helper, Vector3, Box3, EdgesGeometry, LineBasicMaterial, LineSegments
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

console.log('OrbitControls', OrbitControls);
const scene = new Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
const uvTexture = new TextureLoader().load('/textures/uv_grid_opengl.jpg')
// 透视相机
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);

// camera
// 自动拍照相机
// const aspectRatio = window.innerWidth / window.innerHeight;
// const camera = new OrthographicCamera(-aspectRatio, aspectRatio,1, -1, 0.1 , 100);

camera.position.z = 2;

// red cube
// const geometry = new BoxGeometry(1, 1, 1, 10, 10 , 10 );

// const geometry = new BufferGeometry();
// const indices = [0, 1, 2, 2, 3, 0];
// const vertices = new Float32Array([
//  -1, -1, 0,
//   1, -1, 0,
//   1, 1, 0,
//   -1, 1, 0
// ]);
// // 位置的顺序 索引
// geometry.setIndex(indices);
// geometry.setAttribute('position', new BufferAttribute(vertices, 3));
// const uv = new Float32Array([
//   0, 0,
//   0.5, 0,
//   0.5, 1,
//   0, 1
// ])
// // uv对应position的点 一一对应
// geometry.setAttribute('uv', new BufferAttribute(uv, 2));
// const material = new MeshBasicMaterial({
//   map: uvTexture
// });
// material.side = DoubleSide
// // 计算法向量
// geometry.computeVertexNormals()
// const mesh = new Mesh(geometry, material);
// mesh.position.set(-2, 0, 0)
// camera.lookAt(mesh.position);
//
scene.add(camera);
// scene.add(mesh);
// const planeGeometry = new PlaneGeometry(2,2)
// const material1 = new MeshBasicMaterial({
//   map: uvTexture
// });
// const mesh1 = new Mesh(planeGeometry, material);
// scene.add(mesh1);
// // mesh1.position.set(2, 0, 0)
// // Axes helper
// mesh1.translateX(4)
// // mesh1.rotateY(Math.PI / 2)
// mesh1.rotation.set(0,-Math.PI / 2, 0)
const axesHelper = new AxesHelper(5);
scene.add(axesHelper);
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
  // 球形贴图
  envMap.mapping = EquirectangularReflectionMapping;
  scene.background = envMap;
  scene.environment = envMap;
  // material.envMap = envMap;
})
// // 顶点向量辅助器
// const vertexHelp = new VertexNormalsHelper(mesh1, 1, 0xff0000)
// scene.add(vertexHelp)
//
//
// const sphere = new SphereGeometry(2);
// const sphereMesh = new Mesh(sphere, material);
// sphere.computeBoundingBox();
// // 更新世界矩阵
// sphereMesh.updateMatrix(true, true)
// // 更新包围盒
// sphere.boundingBox.applyMatrix4(sphereMesh.matrixWorld)
// // 获取包围盒中心点
// // let center = sphere.boundingBox.getCenter(new Vector3());
// // console.log(sphere.boundingBox,center);
// // 获取包围球的中心
// sphere.computeBoundingSphere();
// const boundSphere = sphere.boundingSphere;
// console.log('boundSphere',boundSphere);
// boundSphere.applyMatrix4(sphereMesh.matrixWorld);
// const spereboundMesh = new Mesh(new SphereGeometry(boundSphere.radius, 16, 16), new MeshBasicMaterial({wireframe: true , color: 0xff0000}))
// scene.add(spereboundMesh)
// spereboundMesh.position.copy(boundSphere.center)
// // const box3Help = new Box3Helper(sphere.boundingBox, 0xff0000)
// scene.add(sphereMesh)
// const box = new Box3()
// const mashArr = [sphereMesh, mesh1]
// // scene.add(box3Help)
// for (let i = 0;i < mashArr.length; i++) {
//   // const geometry = mashArr[i].geometry;
//   // geometry.computeBoundingBox()
//   // const boundingBox = geometry.boundingBox;
//   // mashArr[i].updateWorldMatrix(true, true)
//   // boundingBox.applyMatrix4(mashArr[i].matrixWorld)
//   // 第二种方法
//   // 计算包围盒 不需要更新世界矩阵
//   const meshBoundingBox = new Box3().setFromObject(mashArr[i])
//   // 合并包围盒 包围盒继承box3
//   box.union(meshBoundingBox)
// }
// const box3Help = new Box3Helper(box, 0xff0000)
// scene.add(box3Help)
const gltfLoader = new GLTFLoader();
const loader = new DRACOLoader()
loader.setDecoderPath( '/draco/' );
gltfLoader.setDRACOLoader(loader)
loader.preload();
gltfLoader.load('/city.glb', (gltf) => {
  // object3D会递归所有的object3D
  gltf.scene.traverse((child) => {
    // 去判断是不是一个mesh
    if (child.isMesh) {
      const buildMesh = child;
      const edges = new EdgesGeometry(buildMesh.geometry);
      buildMesh.updateWorldMatrix(true, true);
      // 线条mesh
      const line = new LineSegments(edges, new LineBasicMaterial( { color: 0xffffff } ) );
      // line.applyMatrix4(buildMesh.matrixWorld)
      line.matrix.copy(buildMesh.matrixWorld);
      // 解构矩阵并将他放到位置 旋转 缩放上面去
      line.matrix.decompose(line.position, line.quaternion, line.scale)
      scene.add( line );
    }

  })
  // scene.add(gltf.scene)
  // const buildMesh = gltf.scene.getObjectByName("Plane045")
  // console.log('gltf.scene',buildMesh );
  // const edges = new EdgesGeometry(buildMesh.geometry);
  // buildMesh.updateWorldMatrix(true, true);
  // // 线条mesh
  // const line = new LineSegments(edges, new LineBasicMaterial( { color: 0xffffff } ) );
  // // line.applyMatrix4(buildMesh.matrixWorld)
  // line.matrix.copy(buildMesh.matrixWorld);
  // // 解构矩阵并将他放到位置 旋转 缩放上面去
  // line.matrix.decompose(line.position, line.quaternion, line.scale)
  // scene.add( line );

})
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
  renderer.setSize(sizes.width, sizes.height);
  renderer.domElement.className = 'webgl';
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.update();
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
    // camera.lookAt(mesh.position);
    controls.update();
    // render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }
  tick();

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

  window.addEventListener('dblclick', function () {
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
  });
};
