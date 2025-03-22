import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

export class AccessoriesEditor {
  constructor(container, initialSettings, isMobile = false) {
    this.container = container;
    this.isMobile = isMobile;
    this.animationId = null;
    this.initialSettings = initialSettings || {
      earrings: 'none',
      hairAccessory: 'none',
      necklace: 'none',
      material: 'silver'
    };
    
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
    this.camera.position.set(0, 0, 5);
    
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
    
    // 添加头部参考模型
    this.addHeadReference();
    
    // 加载配饰模型
    this.accessories = {
      earrings: { model: null, type: 'none' },
      hairAccessory: { model: null, type: 'none' },
      necklace: { model: null, type: 'none' }
    };
    
    this.accessoryModels = {};
    this.loadAccessoryModels();
    
    // 初始化材质
    this.materials = {
      silver: new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        metalness: 0.9,
        roughness: 0.2
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.1
      }),
      rose_gold: new THREE.MeshStandardMaterial({
        color: 0xb76e79,
        metalness: 0.9,
        roughness: 0.2
      }),
      platinum: new THREE.MeshStandardMaterial({
        color: 0xe5e4e2,
        metalness: 0.85,
        roughness: 0.1
      })
    };
    
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
  
  // 添加头部参考模型
  addHeadReference() {
    // 头部
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
    
    // 颈部
    const neckGeo = new THREE.CylinderGeometry(0.3, 0.4, 1, 32);
    const neckMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      opacity: 0.2,
      transparent: true,
      wireframe: true
    });
    const neckMesh = new THREE.Mesh(neckGeo, neckMat);
    neckMesh.position.y = -1;
    this.scene.add(neckMesh);
    
    // 耳朵位置标记
    this.createEarMark(0.8, 0, 0.1);  // 右耳
    this.createEarMark(-0.8, 0, 0.1); // 左耳
  }
  
  // 创建耳朵位置标记
  createEarMark(x, y, z) {
    const earGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const earMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      opacity: 0.5,
      transparent: true
    });
    const earMesh = new THREE.Mesh(earGeo, earMat);
    earMesh.position.set(x, y, z);
    this.scene.add(earMesh);
  }
  
  // 加载配饰模型
  async loadAccessoryModels() {
    // 创建备用配饰
    this.createFallbackAccessories();
    
    // 应用初始设置
    if (this.initialSettings.earrings !== 'none') {
      this.changeAccessory('earrings', this.initialSettings.earrings);
    }
    if (this.initialSettings.hairAccessory !== 'none') {
      this.changeAccessory('hairAccessory', this.initialSettings.hairAccessory);
    }
    if (this.initialSettings.necklace !== 'none') {
      this.changeAccessory('necklace', this.initialSettings.necklace);
    }
    
    // 设置材质
    this.changeMaterial(this.initialSettings.material || 'silver');
    
    // 尝试加载真实模型
    try {
      const loader = new GLTFLoader();
      
      // 这里可以添加实际模型加载逻辑
      // 等待真实模型完成时，可以替换备用模型
      
    } catch (error) {
      console.error('加载配饰模型失败:', error);
      // 如果加载失败，继续使用备用模型
    }
  }
  
  // 创建备用配饰几何体
  createFallbackAccessories() {
    // 创建耳环备用模型
    this.createEarringModels();
    
    // 创建发饰备用模型
    this.createHairAccessoryModels();
    
    // 创建项链备用模型
    this.createNecklaceModels();
  }
  
  // 创建耳环备用模型
  createEarringModels() {
    // 存储模型组
    this.accessoryModels.earrings = {};
    
    // 圆珠耳钉
    const studGroup = new THREE.Group();
    const studGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const studMat = this.materials.silver.clone();
    
    const rightStud = new THREE.Mesh(studGeo, studMat);
    rightStud.position.set(0.8, 0, 0.1);
    
    const leftStud = new THREE.Mesh(studGeo, studMat);
    leftStud.position.set(-0.8, 0, 0.1);
    
    studGroup.add(rightStud, leftStud);
    studGroup.visible = false;
    this.scene.add(studGroup);
    this.accessoryModels.earrings.stud = studGroup;
    
    // 圆环耳环
    const hoopGroup = new THREE.Group();
    const hoopGeo = new THREE.TorusGeometry(0.15, 0.02, 16, 32);
    const hoopMat = this.materials.silver.clone();
    
    const rightHoop = new THREE.Mesh(hoopGeo, hoopMat);
    rightHoop.position.set(0.8, 0, 0.1);
    rightHoop.rotation.y = Math.PI / 2;
    
    const leftHoop = new THREE.Mesh(hoopGeo, hoopMat);
    leftHoop.position.set(-0.8, 0, 0.1);
    leftHoop.rotation.y = Math.PI / 2;
    
    hoopGroup.add(rightHoop, leftHoop);
    hoopGroup.visible = false;
    this.scene.add(hoopGroup);
    this.accessoryModels.earrings.hoop = hoopGroup;
    
    // 垂坠耳环
    const dangleGroup = new THREE.Group();
    
    // 右垂坠耳环
    const rightDangle = new THREE.Group();
    const rightHookGeo = new THREE.TorusGeometry(0.05, 0.01, 8, 16, Math.PI);
    const rightHook = new THREE.Mesh(rightHookGeo, hoopMat);
    rightHook.position.set(0.8, 0, 0.1);
    rightHook.rotation.set(0, Math.PI / 2, Math.PI);
    
    const rightChainGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.2, 8);
    const rightChain = new THREE.Mesh(rightChainGeo, hoopMat);
    rightChain.position.set(0.8, -0.13, 0.1);
    
    const rightPendantGeo = new THREE.ConeGeometry(0.05, 0.1, 16);
    const rightPendant = new THREE.Mesh(rightPendantGeo, hoopMat);
    rightPendant.position.set(0.8, -0.25, 0.1);
    
    rightDangle.add(rightHook, rightChain, rightPendant);
    
    // 左垂坠耳环
    const leftDangle = new THREE.Group();
    const leftHookGeo = new THREE.TorusGeometry(0.05, 0.01, 8, 16, Math.PI);
    const leftHook = new THREE.Mesh(leftHookGeo, hoopMat);
    leftHook.position.set(-0.8, 0, 0.1);
    leftHook.rotation.set(0, Math.PI / 2, Math.PI);
    
    const leftChainGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.2, 8);
    const leftChain = new THREE.Mesh(leftChainGeo, hoopMat);
    leftChain.position.set(-0.8, -0.13, 0.1);
    
    const leftPendantGeo = new THREE.ConeGeometry(0.05, 0.1, 16);
    const leftPendant = new THREE.Mesh(leftPendantGeo, hoopMat);
    leftPendant.position.set(-0.8, -0.25, 0.1);
    
    leftDangle.add(leftHook, leftChain, leftPendant);
    
    dangleGroup.add(rightDangle, leftDangle);
    dangleGroup.visible = false;
    this.scene.add(dangleGroup);
    this.accessoryModels.earrings.dangle = dangleGroup;
  }
  
  // 创建发饰备用模型
  createHairAccessoryModels() {
    this.accessoryModels.hairAccessory = {};
    
    // 发夹
    const hairpinGroup = new THREE.Group();
    
    const pinBaseGeo = new THREE.BoxGeometry(0.6, 0.08, 0.05);
    const pinMat = this.materials.silver.clone();
    const pinBase = new THREE.Mesh(pinBaseGeo, pinMat);
    pinBase.position.set(0, 0.7, 0.3);
    
    const decorGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const decorMesh = new THREE.Mesh(decorGeo, pinMat);
    decorMesh.position.set(0.2, 0.7, 0.33);
    
    hairpinGroup.add(pinBase, decorMesh);
    hairpinGroup.visible = false;
    this.scene.add(hairpinGroup);
    this.accessoryModels.hairAccessory.hairpin = hairpinGroup;
    
    // 发带
    const hairbandGroup = new THREE.Group();
    const bandGeo = new THREE.TorusGeometry(0.8, 0.04, 16, 32, Math.PI);
    const bandMat = this.materials.silver.clone();
    const bandMesh = new THREE.Mesh(bandGeo, bandMat);
    bandMesh.rotation.x = Math.PI / 2;
    bandMesh.position.set(0, 0.5, 0);
    
    hairbandGroup.add(bandMesh);
    hairbandGroup.visible = false;
    this.scene.add(hairbandGroup);
    this.accessoryModels.hairAccessory.hairband = hairbandGroup;
    
    // 王冠
    const tiaraGroup = new THREE.Group();
    
    // 王冠基座
    const tiaraBaseGeo = new THREE.TorusGeometry(0.75, 0.04, 16, 32, Math.PI);
    const tiaraMat = this.materials.gold.clone();
    const tiaraBase = new THREE.Mesh(tiaraBaseGeo, tiaraMat);
    tiaraBase.rotation.x = Math.PI / 2;
    tiaraBase.position.set(0, 0.8, 0);
    
    // 王冠尖刺
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI / 4) * i - Math.PI / 2;
      const spikeGeo = new THREE.ConeGeometry(0.04, 0.2, 8);
      const spike = new THREE.Mesh(spikeGeo, tiaraMat);
      spike.position.set(
        Math.cos(angle) * 0.75,
        0.9,
        Math.sin(angle) * 0.75
      );
      spike.rotation.x = -Math.PI / 2;
      tiaraGroup.add(spike);
    }
    
    tiaraGroup.add(tiaraBase);
    tiaraGroup.visible = false;
    this.scene.add(tiaraGroup);
    this.accessoryModels.hairAccessory.tiara = tiaraGroup;
  }
  
  // 创建项链备用模型
  createNecklaceModels() {
    this.accessoryModels.necklace = {};
    
    // 吊坠项链
    const pendantGroup = new THREE.Group();
    
    // 链条
    const chainGeo = new THREE.TorusGeometry(0.5, 0.01, 16, 48);
    const chainMat = this.materials.silver.clone();
    const chainMesh = new THREE.Mesh(chainGeo, chainMat);
    chainMesh.rotation.x = Math.PI / 2;
    chainMesh.position.set(0, -0.6, 0);
    
    // 吊坠
    const pendantGeo = new THREE.ConeGeometry(0.08, 0.15, 16);
    const pendantMesh = new THREE.Mesh(pendantGeo, chainMat);
    pendantMesh.rotation.x = Math.PI;
    pendantMesh.position.set(0, -1.1, 0);
    
    pendantGroup.add(chainMesh, pendantMesh);
    pendantGroup.visible = false;
    this.scene.add(pendantGroup);
    this.accessoryModels.necklace.pendant = pendantGroup;
    
    // 颈链
    const chokerGroup = new THREE.Group();
    
    const chokerGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 48);
    const chokerMat = this.materials.silver.clone();
    const chokerMesh = new THREE.Mesh(chokerGeo, chokerMat);
    chokerMesh.rotation.x = Math.PI / 2;
    chokerMesh.position.set(0, -0.5, 0);
    
    chokerGroup.add(chokerMesh);
    chokerGroup.visible = false;
    this.scene.add(chokerGroup);
    this.accessoryModels.necklace.choker = chokerGroup;
    
    // 链条
    const chainNecklaceGroup = new THREE.Group();
    
    // 主链条
    const mainChainGeo = new THREE.TorusGeometry(0.45, 0.015, 8, 36);
    const mainChainMat = this.materials.silver.clone();
    const mainChainMesh = new THREE.Mesh(mainChainGeo, mainChainMat);
    mainChainMesh.rotation.x = Math.PI / 2;
    mainChainMesh.position.set(0, -0.55, 0);
    
    // 子链条样式
    const subChainGeo = new THREE.BoxGeometry(0.02, 0.02, 0.3);
    const subChainMat = this.materials.silver.clone();
    
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i;
      const subChainMesh = new THREE.Mesh(subChainGeo, subChainMat);
      subChainMesh.position.set(
        Math.cos(angle) * 0.45,
        -0.7,
        Math.sin(angle) * 0.45
      );
      subChainMesh.rotation.set(
        0,
        -angle,
        -Math.PI / 4
      );
      chainNecklaceGroup.add(subChainMesh);
    }
    
    chainNecklaceGroup.add(mainChainMesh);
    chainNecklaceGroup.visible = false;
    this.scene.add(chainNecklaceGroup);
    this.accessoryModels.necklace.chain = chainNecklaceGroup;
  }
  
  // 渲染循环
  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  
  // 切换配饰
  changeAccessory(category, type) {
    // 隐藏当前配饰
    if (this.accessories[category].model) {
      this.accessories[category].model.visible = false;
    }
    
    // 如果选择了"无"，直接返回
    if (type === 'none') {
      this.accessories[category].type = 'none';
      this.accessories[category].model = null;
      return true;
    }
    
    // 显示新配饰
    if (this.accessoryModels[category] && this.accessoryModels[category][type]) {
      this.accessoryModels[category][type].visible = true;
      this.accessories[category].model = this.accessoryModels[category][type];
      this.accessories[category].type = type;
      return true;
    }
    
    return false;
  }
  
  // 更改材质
  changeMaterial(materialType) {
    if (!this.materials[materialType]) {
      return false;
    }
    
    const newMaterial = this.materials[materialType].clone();
    
    // 更新所有配饰的材质
    Object.values(this.accessories).forEach(accessory => {
      if (accessory.model) {
        accessory.model.traverse(child => {
          if (child.isMesh) {
            // 保留当前材质的一些特性，例如纹理
            const currentMat = child.material;
            child.material = newMaterial.clone();
            
            if (currentMat.map) {
              child.material.map = currentMat.map;
            }
          }
        });
      }
    });
    
    return true;
  }
  
  // 调整配饰大小
  adjustScale(accessoryType, scaleValue) {
    const accessory = this.accessories[accessoryType];
    if (!accessory || !accessory.model) {
      return false;
    }
    
    // 将0-100的值映射到0.5-1.5的范围
    const scale = 0.5 + (scaleValue / 100) * 1.0;
    
    accessory.model.scale.set(scale, scale, scale);
    return true;
  }
  
  // 调整配饰位置
  adjustPosition(accessoryType, axis, positionValue) {
    const accessory = this.accessories[accessoryType];
    if (!accessory || !accessory.model) {
      return false;
    }
    
    // 不同配饰类型有不同的位置范围
    let min = -0.5;
    let max = 0.5;
    
    // 特殊情况处理
    if (accessoryType === 'necklace') {
      if (axis === 'y') {
        min = -1.5;
        max = -0.3;
      }
    } else if (accessoryType === 'hairAccessory') {
      if (axis === 'z') {
        min = -0.5;
        max = 0.8;
      }
    }
    
    // 映射0-100的值到适当范围
    const position = min + (positionValue / 100) * (max - min);
    
    // 保留其他轴的位置
    const currentPosition = accessory.model.position.clone();
    currentPosition[axis] = position;
    
    // 使用GSAP进行平滑过渡
    gsap.to(accessory.model.position, {
      [axis]: position,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    return true;
  }
  
  // 屏幕尺寸变化处理
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
      z: 5,
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
  
  // 资源清理
  dispose() {
    cancelAnimationFrame(this.animationId);
    
    // 清理控制器
    this.controls.dispose();
    
    // 清理场景中的所有对象
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      if (object.material) {
        if (Array.isArray(object.material)) {
          for (let i = 0; i < object.material.length; i++) {
            object.material[i].dispose();
          }
        } else {
          object.material.dispose();
        }
      }
    });
    
    // 清理材质
    Object.values(this.materials).forEach(material => {
      material.dispose();
    });
    
    // 清理渲染器
    this.renderer.dispose();
    
    // 移除canvas
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export default AccessoriesEditor; 