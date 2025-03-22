import SceneManager from './core/SceneManager';
import LightManager from './core/LightManager';
import ControlsManager from './core/ControlsManager';
import ModelFactory from './models/ModelFactory';
import Deformation from './effects/Deformation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import HairModels from './models/HairModels';

export class FaceEditor {
  constructor(container, initialSettings, isMobile = false) {
    this.container = container;
    this.isMobile = isMobile;
    this.initialState = initialSettings;
    this.animationId = null;
    
    // 设置场景
    this.scene = new THREE.Scene();
    
    // 使用移动设备优化的参数
    if (this.isMobile) {
      // 降低移动设备的渲染质量以提高性能
      this.renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: 'low-power',
        alpha: true
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } else {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    
    // 创建场景管理器
    this.sceneManager = new SceneManager(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.sceneManager.getDomElement());
    
    // 创建灯光管理器
    this.lightManager = new LightManager(this.sceneManager.scene);
    
    // 创建控制器管理器
    this.controlsManager = new ControlsManager(
      this.sceneManager.camera,
      this.sceneManager.getDomElement()
    );
    
    // 创建面部模型
    this.faceModel = ModelFactory.createFaceModel(this.sceneManager.scene);
    
    // 创建变形效果
    this.deformation = new Deformation(this.faceModel);
    
    // 添加发型管理
    this.hairModels = new HairModels(this.sceneManager.scene);
    this.loadHairModels();
    
    // 相机设置 - 为移动设备调整视野
    const aspect = container.clientWidth / container.clientHeight;
    const fov = this.isMobile ? 60 : 45; // 移动设备使用更大的视角
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.camera.position.z = this.isMobile ? 4 : 5;
    
    // 为移动设备优化控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = this.isMobile ? 0.5 : 1.0; // 降低移动设备上的旋转速度
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize.bind(this));
    
    this.init();
    this.animate();
    this.applyInitialState();
  }
  
  init() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.sceneManager.scene.add(this.renderer.domElement);
  }
  
  applyInitialState() {
    Object.entries(this.initialState).forEach(([feature, value]) => {
      this.deform(feature, value);
    });
  }
  
  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    this.controlsManager.update();
    this.sceneManager.render();
  }
  
  handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    // 确保高度不为0
    if (height === 0) {
      this.renderer.setSize(width, this.isMobile ? 350 : 400);
      this.camera.aspect = width / (this.isMobile ? 350 : 400);
    } else {
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
    }
    
    this.camera.updateProjectionMatrix();
    
    // 调整移动设备上的相机位置
    if (this.isMobile && this.camera.position.z > 4) {
      this.camera.position.z = 4;
    }
  }
  
  deform(feature, value) {
    this.deformation.deform(feature, value);
  }
  
  toggleRotation(enabled) {
    this.controlsManager.toggleRotation(enabled);
  }
  
  toggleZoom(enabled) {
    this.controlsManager.toggleZoom(enabled);
  }
  
  // 加载发型模型
  async loadHairModels() {
    try {
      await this.hairModels.loadModels();
      // 默认显示短发
      this.hairModels.changeHairStyle('short');
    } catch (error) {
      console.error('加载发型失败:', error);
    }
  }
  
  // 切换发型样式
  changeHairStyle(hairType) {
    return this.hairModels.changeHairStyle(hairType);
  }
  
  // 改变发色
  changeHairColor(colorName) {
    return this.hairModels.changeHairColor(colorName);
  }
  
  // 调整发型参数
  adjustHairParameter(param, value) {
    return this.hairModels.adjustHairParameter(param, value);
  }
  
  dispose() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    // 释放各个管理器
    this.faceModel.dispose();
    this.lightManager.dispose();
    this.controlsManager.dispose();
    
    // 释放发型资源
    if (this.hairModels) {
      this.hairModels.dispose();
    }
    
    // 最后释放场景和渲染器
    this.sceneManager.dispose();
    
    // 移除DOM元素
    if (this.container.contains(this.sceneManager.getDomElement())) {
      this.container.removeChild(this.sceneManager.getDomElement());
    }
  }
}

export default FaceEditor; 