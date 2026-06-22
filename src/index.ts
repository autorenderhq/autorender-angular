import type { CreateUploaderOptions, UploaderInstance } from '@autorender/js';
import { createUploader } from '@autorender/js';

export type AutorenderAngularOptions = Omit<CreateUploaderOptions, 'target'>;

// Re-export types for convenience
export type { UploaderInstance, CreateUploaderOptions } from '@autorender/js';

export function bootstrapAutorenderUploader(
  element: HTMLElement,
  options: AutorenderAngularOptions
): UploaderInstance {
  return createUploader({
    ...options,
    target: element,
  });
}


