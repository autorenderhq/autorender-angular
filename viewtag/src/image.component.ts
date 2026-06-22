/**
 * AR Image Component for Angular
 */

import { Component, Input, computed, signal, inject } from '@angular/core';
import { isGifFormatOutput } from '@autorender/js/viewtag';
import { AutoRenderService } from './service';
import type { TransformOptions } from '@autorender/js/viewtag';

@Component({
  selector: 'ar-image',
  standalone: true,
  template: `
    <!-- Use attr.* || null for srcset/sizes: plain [srcset]="undefined" can stringify to "undefined" and break src (e.g. GIF output). -->
    <img
      [src]="imageAttributes().src"
      [attr.srcset]="imageAttributes().srcSet || null"
      [attr.sizes]="imageAttributes().sizes || null"
      [attr.width]="imageAttributes().width ?? null"
      [attr.height]="height ?? null"
      [attr.alt]="alt ?? ''"
      [attr.loading]="lazy ? 'lazy' : 'eager'"
      [class]="ngClass"
      [style]="ngStyle"
    />
  `
})
export class ARImageComponent {
  private arService = inject(AutoRenderService);

  private _src = signal<string>('');
  private _width = signal<number | undefined>(undefined);
  private _height = signal<number | undefined>(undefined);
  private _transformations = signal<TransformOptions | undefined>(undefined);
  private _responsive = signal<boolean>(true);

  @Input() set src(value: string) {
    this._src.set(value);
  }
  get src(): string {
    return this._src();
  }

  @Input() set width(value: number | undefined) {
    this._width.set(value);
  }
  get width(): number | undefined {
    return this._width();
  }

  @Input() set height(value: number | undefined) {
    this._height.set(value);
  }
  get height(): number | undefined {
    return this._height();
  }

  @Input() set transformations(value: TransformOptions | undefined) {
    this._transformations.set(value);
  }
  get transformations(): TransformOptions | undefined {
    return this._transformations();
  }

  @Input() set responsive(value: boolean) {
    this._responsive.set(value);
  }
  get responsive(): boolean {
    return this._responsive();
  }

  @Input() lazy: boolean = true;
  @Input() sizes?: string;
  @Input() alt?: string;
  @Input() ngClass?: any;
  @Input() ngStyle?: any;

  imageAttributes = computed(() => {
    const ar = this.arService.getInstance();
    const src = this._src();
    const width = this._width();
    const height = this._height();
    const transform = this._transformations();
    const responsive = this._responsive();
    const sizes = this.sizes;

    const fullTransform: TransformOptions = {
      ...(transform || {}),
      ...(width && { w: width }),
      ...(height && { h: height }),
    };
    const useResponsiveLayout = responsive && !isGifFormatOutput(fullTransform);

    if (useResponsiveLayout) {
      return ar.responsiveImageAttributes({
        src,
        width,
        sizes,
        transform: fullTransform,
      });
    }
    return {
      src: ar.url(src, fullTransform),
      srcSet: undefined,
      sizes: undefined,
      width,
    };
  });
}

