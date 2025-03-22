import * as THREE from 'three';

export default class FaceModel {
  constructor(scene) {
    this.scene = scene;
    this.parts = {};
    
    this.createFaceModel();
  }
  
  createFaceModel() {
    // 创建头部
    const headGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf2cda8, 
      shininess: 30 
    });
    this.parts.head = new THREE.Mesh(headGeometry, headMaterial);
    this.scene.add(this.parts.head);
    
    // 创建眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    this.parts.leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    this.parts.leftEye.position.set(-0.5, 0.3, 1.3);
    this.scene.add(this.parts.leftEye);
    
    this.parts.rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    this.parts.rightEye.position.set(0.5, 0.3, 1.3);
    this.scene.add(this.parts.rightEye);
    
    // 创建鼻子
    const noseGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
    const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xedbc9a });
    this.parts.nose = new THREE.Mesh(noseGeometry, noseMaterial);
    this.parts.nose.rotation.x = Math.PI / 2;
    this.parts.nose.position.set(0, 0, 1.4);
    this.scene.add(this.parts.nose);
    
    // 创建嘴
    const mouthGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.1);
    const mouthMaterial = new THREE.MeshPhongMaterial({ color: 0xcc6666 });
    this.parts.mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    this.parts.mouth.position.set(0, -0.5, 1.4);
    this.scene.add(this.parts.mouth);
    
    // 创建脖子
    const neckGeometry = new THREE.CylinderGeometry(0.7, 0.9, 1, 32);
    const neckMaterial = new THREE.MeshPhongMaterial({ color: 0xf2cda8 });
    this.parts.neck = new THREE.Mesh(neckGeometry, neckMaterial);
    this.parts.neck.position.set(0, -1.5, 0);
    this.scene.add(this.parts.neck);
  }
  
  getPart(partName) {
    return this.parts[partName];
  }
  
  dispose() {
    Object.values(this.parts).forEach(part => {
      if (part.geometry) part.geometry.dispose();
      if (part.material) {
        if (Array.isArray(part.material)) {
          part.material.forEach(mat => mat.dispose());
        } else {
          part.material.dispose();
        }
      }
      this.scene.remove(part);
    });
    this.parts = {};
  }
} 