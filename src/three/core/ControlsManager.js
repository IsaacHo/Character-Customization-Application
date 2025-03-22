import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class ControlsManager {
  constructor(camera, domElement) {
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }
  
  update() {
    this.controls.update();
  }
  
  dispose() {
    this.controls.dispose();
  }
  
  toggleRotation(enabled) {
    this.controls.autoRotate = enabled;
    this.controls.autoRotateSpeed = 3.0;
  }
  
  toggleZoom(enabled) {
    if (enabled) {
      this.controls.minDistance = 3;
      this.controls.maxDistance = 4;
    } else {
      this.controls.minDistance = 3;
      this.controls.maxDistance = 10;
    }
  }
} 