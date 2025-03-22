export default class Deformation {
  constructor(faceModel) {
    this.faceModel = faceModel;
  }
  
  deform(feature, value) {
    switch(feature) {
      case 'nose':
        this.deformNose(value);
        break;
      case 'eyes':
        this.deformEyes(value);
        break;
      case 'mouth':
        this.deformMouth(value);
        break;
    }
  }
  
  deformNose(value) {
    const nose = this.faceModel.getPart('nose');
    if (!nose) return;
    
    const scale = 0.5 + (value / 100) * 1.5;
    nose.scale.set(scale, scale, scale);
  }
  
  deformEyes(value) {
    const leftEye = this.faceModel.getPart('leftEye');
    const rightEye = this.faceModel.getPart('rightEye');
    if (!leftEye || !rightEye) return;
    
    const scale = 0.5 + (value / 100) * 1.5;
    leftEye.scale.set(scale, scale, scale);
    rightEye.scale.set(scale, scale, scale);
  }
  
  deformMouth(value) {
    const mouth = this.faceModel.getPart('mouth');
    if (!mouth) return;
    
    const mouthWidth = 0.5 + (value / 100) * 1.5;
    const mouthHeight = 0.5 + (value / 40);
    mouth.scale.set(mouthWidth, mouthHeight, 1);
  }
} 