import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import HairModels from './models/HairModels';

export class HairEditor {
  constructor(container, initialHairStyle, initialHairColor, initialParameters, isMobile = false) {
    this.container = container;
    this.isMobile = isMobile;
    this.animationId = null;
    
    // 初始化场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a2a35);
    
    // 初始化渲染器
    if (this.isMobile) {
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
    
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    
    // 初始化相机
    const aspect = container.clientWidth / container.clientHeight;
    const fov = this.isMobile ? 60 : 45;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 4);
    
    // 初始化控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = this.isMobile ? 0.5 : 1.0;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.autoRotate = false;
    
    // 添加灯光
    this.setupLights();
    
    // 添加头发模型
    this.hairModels = new HairModels(this.scene);
    this.loadHairModels(initialHairStyle, initialHairColor, initialParameters);
    
    // 添加头部参考模型（可选）
    this.addHeadReference();
    
    // 开始动画循环
    this.animate();
  }
  
  // 设置灯光
  setupLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // 主灯光
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    this.scene.add(mainLight);
    
    // 补光
    const fillLight = new THREE.DirectionalLight(0x3b95d9, 0.4);
    fillLight.position.set(-5, 0, -5);
    this.scene.add(fillLight);
    
    // 背光
    const backLight = new THREE.DirectionalLight(0xe8c76a, 0.2);
    backLight.position.set(0, -5, -5);
    this.scene.add(backLight);
  }
  
  // 添加头部参考模型（简化版）
  addHeadReference() {
    const headGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      opacity: 0.2,
      transparent: true,
      wireframe: true
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 0;
    this.scene.add(headMesh);
  }
  
  // 加载头发模型
  async loadHairModels(initialHairStyle, initialHairColor, initialParameters) {
    try {
      await this.hairModels.loadModels();
      
      // 应用初始设置
      this.changeHairStyle(initialHairStyle || 'short');
      this.changeHairColor(initialHairColor || 'black');
      
      if (initialParameters) {
        this.adjustHairParameter('volume', initialParameters.volume || 50);
        if (initialHairStyle !== 'short') {
          this.adjustHairParameter('length', initialParameters.length || 50);
        }
        if (initialHairStyle === 'curly') {
          this.adjustHairParameter('curl', initialParameters.curl || 50);
        }
      }
    } catch (error) {
      console.error('加载头发模型失败:', error);
    }
  }
  
  // 渲染循环
  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  
  // 调整大小
  handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    if (height === 0) {
      this.renderer.setSize(width, this.isMobile ? 350 : 400);
      this.camera.aspect = width / (this.isMobile ? 350 : 400);
    } else {
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
    }
    
    this.camera.updateProjectionMatrix();
    
    if (this.isMobile && this.camera.position.z > 4) {
      this.camera.position.z = 4;
    }
  }
  
  // 切换旋转
  toggleRotation(enabled) {
    this.controls.autoRotate = enabled;
    if (enabled) {
      this.controls.autoRotateSpeed = 2.0;
    }
  }
  
  // 重置视图
  resetView() {
    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 4,
      duration: 1,
      ease: 'power2.out'
    });
    
    gsap.to(this.controls.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: 'power2.out'
    });
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
  
  // 资源清理
  dispose() {
    cancelAnimationFrame(this.animationId);
    
    // 清理控制器
    this.controls.dispose();
    
    // 清理头发模型
    if (this.hairModels) {
      this.hairModels.dispose();
    }
    
    // 清理场景中的所有对象
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      if (object.material) {
        if (object.material.length) {
          for (let i = 0; i < object.material.length; i++) {
            object.material[i].dispose();
          }
        } else {
          object.material.dispose();
        }
      }
    });
    
    // 清理渲染器
    this.renderer.dispose();
    
    // 移除canvas
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export default HairEditor; 