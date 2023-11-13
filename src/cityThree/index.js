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
  Group,
  Shape,
  ExtrudeGeometry,
  DoubleSide,
  LineBasicMaterial,
  BufferGeometry,
  Line,
  Vector3,
  BufferAttribute,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { geoMercator } from 'd3-geo';

export class CityThree {
  constructor(set) {
    this.mapData = set.mapData;
    this.cityData = set.cityData;
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
      // addBox();
    }
    init();
    return scene;
  }
  drawMap() {
    if (!this.mapData) {
      console.error('this.mapData 数据不能是null');
      return;
    }
    this.mapData.features.forEach((i) => {
      i.vector3 = [];
      i.geometry.coordinates.forEach((a, b) => {
        i.vector3[b] = [];
        a.forEach((point, index) => {
          // i.vector3[b][index] = [];
          // console.log('point', point);
          if (point[0] instanceof Array) {
            i.vector3[b][index] = [];
            point.forEach((cinner) => {
              let cp = this.lnglatToMectorCity(cinner, [108.904496, 32.668849]);
              i.vector3[b][index].push(cp);
            });
          } else {
            let cp = this.lnglatToMectorCity(point, [108.904496, 32.668849]);
            i.vector3[b].push(cp);
          }
        });
      });
    });
    console.log('newmap', this.mapData);
    // 绘制地图模型
    const group = new Group();
    const lineGroup = new Group();
    this.mapData.features.forEach((item) => {
      // 省份
      const g = new Group();
      g.data = item;
      item.vector3.forEach((points) => {
        if (points[0][0] instanceof Array) {
          // 多面 三维坐标
          points.forEach((i) => {
            const mesh = this.drawModel(i);
            const lineMesh = this.drawLine(i);
            g.add(mesh);
            lineGroup.add(lineMesh);
          });
        } else {
          // 单面 三维坐标
          const mesh = this.drawModel(points);
          const lineMesh = this.drawLine(points);
          g.add(mesh);
          lineGroup.add(lineMesh);
        }
      });
      group.add(g);
    });
    console.log(this.scene);
    const lineGroupBottom = lineGroup.clone();
    lineGroupBottom.position.z = -0.1;
    const groupAll = new Group();
    groupAll.add(lineGroup);
    groupAll.add(lineGroupBottom);
    groupAll.add(group);
    this.scene.add(groupAll);
    groupAll.rotateX(Math.PI / 2);
    groupAll.rotateZ(Math.PI / 2);

    groupAll.scale.set(10, 10, 10);
  }
  drawCity() {
    console.log('cityData', this.cityData);
    if (!this.cityData) {
      console.error('this.cityData 数据不能是null');
      return;
    }
    this.cityData.features.forEach((i) => {
      i.vector3 = [];
      i.geometry.coordinates.forEach((a, b) => {
        i.vector3[b] = [];
        a.forEach((point, index) => {
          // i.vector3[b][index] = [];
          // console.log('point', point);
          if (point[0] instanceof Array) {
            i.vector3[b][index] = [];
            point.forEach((cinner) => {
              let cp = this.lnglatToMectorCity(cinner, [108.904496, 32.668849]);
              i.vector3[b][index].push(cp);
            });
          } else {
            let cp = this.lnglatToMectorCity(point, [108.904496, 32.668849]);
            i.vector3[b].push(cp);
          }
        });
      });
    });
    console.log('newcityData', this.cityData);
  }
  //初始化
  createMap() {
    console.log('创建地图板块');
    this.drawMap();
    this.drawCity();
  }
  /**
   * @desc 经纬度转换成墨卡托投影
   * @param {array} 传入经纬度
   * @return array [x,y,z]
   */
  lnglatToMector(lnglat, center) {
    // console.log("看看lan",lnglat);
    if (!this.projection) {
      this.projection = geoMercator()
        .center(center)
        .scale(80)
        .rotate(Math.PI / 4)
        .translate([0, 0]);
    }
    const [y, x] = this.projection([...lnglat]);
    let z = 0;
    return [x, y, z];
  }

  /**
   * @desc 经纬度转换成墨卡托投影
   * @param {array} 传入经纬度
   * @return array [x,y,z]
   */
  lnglatToMectorCity(lnglat, center) {
    // console.log("看看lan",lnglat);
    if (!this.projection) {
      this.projection = geoMercator()
        .center(center)
        .scale(80)
        .rotate(Math.PI / 4)
        .translate([0, 0]);
    }
    const [y, x] = this.projection([...lnglat]);
    let z = 0;
    return [x, y, z];
  }
  /**
   * @desc 绘制地图模型 points 是一个二维数组 [[x,y], [x,y], [x,y]]
   */
  drawModel(points, height) {
    // 用shape绘制
    const shape = new Shape();
    points.forEach((point, i) => {
      const [x, y] = point;
      if (i === 0) {
        shape.moveTo(x, y);
      } else if (i === points.length - 1) {
        shape.quadraticCurveTo(x, y, x, y);
      } else {
        shape.lineTo(x, y);
      }
    });

    const geometry = new ExtrudeGeometry(shape, {
      amount: height || -2,
      bevelEnabled: false,
    });
    const material = new MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.6,
      side: DoubleSide,
    });
    return new Mesh(geometry, material);
  }
  /**
   * @desc 绘制线条
   * @param {} points
   */
  drawLine(points) {
    const material = new LineBasicMaterial({
      color: '#ccc',
      transparent: true,
      opacity: 0.7,
    });
    const vector3s = [];
    const geometry = new BufferGeometry();
    points.forEach((d) => {
      // geometry.vertices.push(new Vector3(x, y, z + 0.1));
      vector3s.push(...d);
    });
    const vertices = new Float32Array(vector3s);
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));

    const line = new Line(geometry, material);
    return line;
  }
}
