import FaceModel from './FaceModel';

export default class ModelFactory {
  static createFaceModel(scene) {
    return new FaceModel(scene);
  }
} 