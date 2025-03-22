import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class HairModels {
  constructor(scene) {
    this.scene = scene;
    this.currentHair = null;
    this.hairModels = {};
    this.loader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
    
    // 发型颜色和材质属性
    this.hairColors = {
      black: new THREE.Color(0x0a0a0a),
      brown: new THREE.Color(0x3b2417),
      blonde: new THREE.Color(0xc6a664),
      red: new THREE.Color(0x8c3c2d),
      blue: new THREE.Color(0x2a4b7c),
      purple: new THREE.Color(0x6a3675)
    };
    
    this.hairMaterial = new THREE.MeshStandardMaterial({
      color: this.hairColors.black,
      roughness: 0.7,
      metalness: 0.1
    });
  }
  
  // 加载所有发型模型
  async loadModels() {
    try {
      await Promise.all([
        this.loadHairModel('short', '/models/hair/short_hair.glb'),
        this.loadHairModel('long', '/models/hair/long_hair.glb'),
        this.loadHairModel('curly', '/models/hair/curly_hair.glb')
      ]);
      return true;
    } catch (error) {
      console.error('加载发型模型失败:', error);
      // 创建简单的几何体作为备用发型
      this.createFallbackHairModels();
      return false;
    }
  }
  
  // 加载单个发型模型
  loadHairModel(type, url) {
    return new Promise((resolve, reject) => {
      this.loader.load(url, 
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            if (child.isMesh) {
              child.material = this.hairMaterial.clone();
            }
          });
          model.visible = false;
          this.scene.add(model);
          this.hairModels[type] = model;
          resolve(model);
        },
        undefined,
        (error) => {
          console.error(`加载发型 ${type} 失败:`, error);
          reject(error);
        }
      );
    });
  }
  
  // 创建备用几何体发型模型（在无法加载真实模型时使用）
  createFallbackHairModels() {
    // 短发 - 简单的半球
    const shortHairGeo = new THREE.SphereGeometry(0.65, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const shortHair = new THREE.Mesh(shortHairGeo, this.hairMaterial.clone());
    shortHair.position.y = 0;
    shortHair.scale.y = 0.8;
    shortHair.visible = false;
    this.scene.add(shortHair);
    this.hairModels.short = shortHair;
    
    // 长发 - 延长的半球
    const longHairGeo = new THREE.CylinderGeometry(0.65, 0.5, 1.5, 32);
    const longHairTop = new THREE.SphereGeometry(0.65, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const longHairMesh = new THREE.Mesh(longHairGeo, this.hairMaterial.clone());
    const longHairTopMesh = new THREE.Mesh(longHairTop, this.hairMaterial.clone());
    longHairTopMesh.position.y = 0.75;
    
    const longHairGroup = new THREE.Group();
    longHairGroup.add(longHairMesh);
    longHairGroup.add(longHairTopMesh);
    longHairGroup.position.y = -0.75;
    longHairGroup.visible = false;
    this.scene.add(longHairGroup);
    this.hairModels.long = longHairGroup;
    
    // 卷发 - 带噪声的半球
    const curlyHairGeo = new THREE.SphereGeometry(0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const curlyHair = new THREE.Mesh(curlyHairGeo, this.hairMaterial.clone());
    // 添加不规则性
    const curlyPositions = curlyHairGeo.attributes.position;
    const vertex = new THREE.Vector3();
    for (let i = 0; i < curlyPositions.count; i++) {
      vertex.fromBufferAttribute(curlyPositions, i);
      if (vertex.y < 0.4) {
        vertex.x += (Math.random() - 0.5) * 0.1;
        vertex.z += (Math.random() - 0.5) * 0.1;
      }
      curlyPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    curlyPositions.needsUpdate = true;
    
    curlyHair.position.y = 0;
    curlyHair.visible = false;
    this.scene.add(curlyHair);
    this.hairModels.curly = curlyHair;
  }
  
  // 切换发型
  changeHairStyle(type) {
    // 隐藏当前发型
    if (this.currentHair) {
      this.currentHair.visible = false;
    }
    
    // 显示新发型
    if (this.hairModels[type]) {
      this.hairModels[type].visible = true;
      this.currentHair = this.hairModels[type];
      return true;
    }
    
    return false;
  }
  
  // 改变发色
  changeHairColor(colorName) {
    if (this.hairColors[colorName] && this.currentHair) {
      this.currentHair.traverse((child) => {
        if (child.isMesh) {
          child.material.color.copy(this.hairColors[colorName]);
        }
      });
      return true;
    }
    return false;
  }
  
  // 调整发型参数
  adjustHairParameter(param, value) {
    if (!this.currentHair) return false;
    
    switch(param) {
      case 'volume':
        // 调整发型体积
        this.currentHair.scale.set(
          1 + value * 0.005, 
          1 + value * 0.005, 
          1 + value * 0.005
        );
        break;
      case 'length':
        // 只对长发和卷发有效
        if (this.currentHair === this.hairModels.long || 
            this.currentHair === this.hairModels.curly) {
          this.currentHair.scale.y = 1 + value * 0.01;
        }
        break;
      case 'curl':
        // 主要影响卷发
        if (this.currentHair === this.hairModels.curly) {
          // 这里可以添加更复杂的卷曲度调整
          const curlFactor = value * 0.01;
          this.currentHair.traverse((child) => {
            if (child.isMesh && child.geometry.attributes.position) {
              // 真实应用中可能需要更复杂的变形
            }
          });
        }
        break;
    }
    
    return true;
  }
  
  // 资源清理
  dispose() {
    Object.values(this.hairModels).forEach(model => {
      model.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      this.scene.remove(model);
    });
    this.hairModels = {};
    this.currentHair = null;
  }
}

export default HairModels; 