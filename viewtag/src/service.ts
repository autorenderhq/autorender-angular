/**
 * AutoRender Service for Angular
 * Injectable service that provides AR instance
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { createAR, type CreateARConfig, type ARInstance } from '@autorender/js/viewtag';

export const AUTORENDER_CONFIG = new InjectionToken<CreateARConfig>('AUTORENDER_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class AutoRenderService {
  private config = inject(AUTORENDER_CONFIG, { optional: true });
  private _ar: ARInstance | null = null;

  /**
   * Initialize AR instance with config
   * Call this in your app's root component or module
   */
  initialize(config: CreateARConfig): ARInstance {
    if (!this._ar) {
      this._ar = createAR(config);
    }
    return this._ar;
  }

  /**
   * Get AR instance (must be initialized first)
   */
  getInstance(): ARInstance {
    if (!this._ar) {
      if (this.config) {
        this._ar = createAR(this.config);
      } else {
        throw new Error('AutoRenderService not initialized. Call initialize() or provide AUTORENDER_CONFIG');
      }
    }
    return this._ar;
  }
}

