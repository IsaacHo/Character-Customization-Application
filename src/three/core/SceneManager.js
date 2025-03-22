import * as THREE from 'three';

export default class SceneManager {
  constructor(width, height) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a2a35);
    
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
  
  getDomElement() {
    return this.renderer.domElement;
  }
  
  handleResize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  
  dispose() {
    this.renderer.dispose();
  }
} 