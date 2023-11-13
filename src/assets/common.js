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

export class CityThree {
  constructor() {
    this.scene = this.initThree();
  }

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
      window.addEventListener('resize', onWindowResize);
    }
    function animate() {
      requestAnimationFrame(animate);
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
  }
}
