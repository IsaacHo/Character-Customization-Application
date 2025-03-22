import * as THREE from 'three';

export default class LightManager {
  constructor(scene) {
    this.scene = scene;
    this.lights = [];
    
    this.setupLights();
  }
  
  setupLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // 主方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1, 1, 2);
    this.scene.add(directionalLight);
    this.lights.push(directionalLight);
    
    // 背光
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-1, 0, -1);
    this.scene.add(backLight);
    this.lights.push(backLight);
  }
  
  dispose() {
    this.lights.forEach(light => {
      this.scene.remove(light);
    });
    this.lights = [];
  }
} 