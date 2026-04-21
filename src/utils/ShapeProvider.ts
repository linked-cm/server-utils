import { Shape } from '@_linked/core/shapes/Shape';
import { BackendProvider } from './BackendProvider.js';

export class ShapeProvider extends BackendProvider {
  public shape: typeof Shape;
}
