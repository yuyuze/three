import {
  PerspectiveCamera,
  Scene,
  AxesHelper,
  GridHelper,
  AmbientLight,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class RoomThree {
  constructor() {
    this.color = '#006de0';
    this.scene = this.initThree();
  }
  // https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
  // 地图geojson数据
  //
  initThree() {
    let camera,
      scene,
      light,
      renderer,
      controls = null;
    function initCamera() {
      camera = new PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      console.log('camera', camera.aspect);
      camera.position.set(400, 400, 400);
      camera.lookAt(0, 0, 0);
    }
    function initScene() {
      scene = new Scene();
      let axisHelp = new AxesHelper(1000);
      let grid = new GridHelper(1000, 50);
      scene.add(axisHelp);
      scene.add(grid);
    }
    function initLight() {
      light = new AmbientLight(0xffffff);
      scene.add(light);
    }
    function initRender() {
      renderer = new WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000, 1);
      document.body.appendChild(renderer.domElement);
      // 添加鼠标控制器
      controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', function () {});
      // controls.autoRotate = true;
      // controls.enabled = false;
      // controls.enableDamping = true;
      // controls.dampingFactor = 0.01;
      // controls.enableRotate = false;
      // controls.enablePan = false;
      // 上下旋转范围
      // controls.minPolarAngle = (Math.PI / 180) * 45;
      // controls.maxPolarAngle = (Math.PI / 180) * 45;

      // 左右旋转范围
      // controls.minAzimuthAngle = -Math.PI * (180 / 180);
      // controls.maxAzimuthAngle = Math.PI * (180 / 180);
      window.addEventListener('resize', onWindowResize);
    }
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function addBox() {
      let box = new BoxGeometry(20, 20, 20);
      const material = new MeshBasicMaterial({ color: 0x00ff00 });
      const mesh = new Mesh(box, material);
      mesh.position.set(10, 10, 10);
      scene.add(mesh);
    }
    function init() {
      initCamera();
      initScene();
      initLight();
      initRender();
      animate();
      addBox();
    }
    init();
    return scene;
  }
}
