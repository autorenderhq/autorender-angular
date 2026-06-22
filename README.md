# Autorender Angular SDK

[![npm version](https://img.shields.io/npm/v/@autorender/angular)](https://www.npmjs.com/package/@autorender/angular)
[![CI](https://github.com/autorenderhq/autorender-angular/workflows/CI/badge.svg)](https://github.com/autorenderhq/autorender-angular/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Follow on X](https://img.shields.io/twitter/follow/AutoRenderHQ?label=Follow&style=social)](https://x.com/AutoRenderHQ)

## Introduction

Autorender Angular SDK provides a simple way to integrate Autorender with your Angular applications. It allows you to:

- Upload files with a fully-featured, customizable upload widget (`bootstrapAutorenderUploader`)
- Serve optimized images with automatic format selection, responsive sizes, and real-time transformations (`<ar-image>`, `AutoRenderService`)
- Stream video with HLS and DASH support via an optional Video.js integration (`<ar-video>`)

## TypeScript support

The SDK is written in TypeScript with full type definitions included. No additional `@types` packages needed.

## Installation

```bash
npm install @autorender/angular
```

## Upload SDK Usage

```typescript
import { Component, ElementRef, OnInit } from '@angular/core';
import { bootstrapAutorenderUploader } from '@autorender/angular';
import '@autorender/angular/styles';

@Component({
  selector: 'app-upload',
  template: '<div class="uploader"></div>',
  standalone: true,
})
export class UploadComponent implements OnInit {
  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const target = this.host.nativeElement.querySelector('.uploader');
    if (!target) return;

    bootstrapAutorenderUploader(target, {
      apiKey: environment.autorenderKey,
      type: 'inline',
      allowMultiple: true,
      theme: 'system',
      sources: ['local', 'camera'],
      onSuccess: ({ files }) => console.log('Uploaded', files),
    });
  }
}
```

## ViewTag SDK Usage

### Setup Service

```typescript
import { Component } from '@angular/core';
import { AutoRenderService, AUTORENDER_CONFIG } from '@autorender/angular';
import type { CreateARConfig } from '@autorender/js';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [
    AutoRenderService,
    {
      provide: AUTORENDER_CONFIG,
      useValue: {
        baseUrl: 'https://assets.autorender.io',
        workspace: 'ws_123',
        defaults: {}
      } as CreateARConfig
    }
  ]
})
export class AppComponent {}
```

### Use ARImage Component

```typescript
import { Component } from '@angular/core';
import { ARImageComponent } from '@autorender/angular';
import type { TransformOptions } from '@autorender/js';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ARImageComponent],
  template: `
    <ar-image
      src="products/shoe.jpg"
      [width]="400"
      [height]="400"
      alt="Shoe"
      [transform]="transform"
      [responsive]="true"
      [lazy]="true"
    />
  `
})
export class ProductComponent {
  transform: TransformOptions = {
    fit: 'cover'
  };
}
```

### Use ARVideo Component (Video.js)

Install `video.js` when you use `<ar-video>` (optional peer dependency):

```bash
npm install video.js
```

```typescript
import { Component } from '@angular/core';
import { ARVideoComponent } from '@autorender/angular';

@Component({
  selector: 'app-product-video',
  standalone: true,
  imports: [ARVideoComponent],
  template: `
    <ar-video
      src="docs/skateboarding.mp4"
      [width]="960"
      [height]="540"
      [controls]="true"
      preload="metadata"
      [transform]="{ w: 960, h: 540 }"
    />
  `
})
export class ProductVideoComponent {}
```

Supports MP4, HLS (`.m3u8`), and DASH (`.mpd`) sources.

### Use Service Directly

```typescript
import { Component, inject, computed, signal } from '@angular/core';
import { AutoRenderService } from '@autorender/angular';
import type { TransformOptions } from '@autorender/js';

@Component({
  selector: 'app-image',
  template: `
    <img 
      [src]="imageUrl()" 
      [srcset]="attrs().srcSet" 
      [sizes]="attrs().sizes" 
      [width]="attrs().width" 
      alt="Image" 
    />
  `
})
export class ImageComponent {
  private arService = inject(AutoRenderService);
  private ar = this.arService.getInstance();
  
  imageUrl = computed(() => this.ar.url('image.jpg', { w: 300, h: 300, fit: 'cover' }));
  transformString = computed(() => this.ar.transformString({ w: 300, h: 300 }));
  dpr = computed(() => this.ar.getDPR());
  
  attrs = computed(() => this.ar.responsiveImageAttributes({
    src: 'hero.jpg',
    width: 1200,
    sizes: '(min-width: 800px) 50vw, 100vw',
    transform: { fit: 'cover' }
  }));
}
```

## API Reference

### Upload SDK

#### `bootstrapAutorenderUploader(element, options)`

Initializes the uploader on an Angular element.

**Parameters:**
- `element: HTMLElement` - Target element
- `options: AutorenderAngularOptions` - Uploader options

**Returns:** `UploaderInstance`

### ViewTag SDK

#### `AutoRenderService`

Injectable service that provides AR instance.

**Methods:**
- `initialize(config: CreateARConfig): ARInstance` - Initialize AR instance
- `getInstance(): ARInstance` - Get AR instance (must be initialized)

#### `AUTORENDER_CONFIG`

Injection token for AR configuration.

**Type:** `CreateARConfig`
- `baseUrl?: string` - Base URL (default: `'https://assets.autorender.io'`)
- `workspace: string` - Your workspace ID
- `defaults?: { f?: string, q?: string | number }` - Default transformations
- `deviceBreakpoints?: number[]` - Device breakpoints
- `imageBreakpoints?: number[]` - Image breakpoints
- `enableDPR?: boolean` - Enable device pixel ratio (default: `true`)
- `enableResponsive?: boolean` - Enable responsive images (default: `true`)

#### `<ar-image />` (ARImageComponent)

Angular component that wraps `<img>` with AutoRender transformations.

**Inputs:**
- `src: string` - Image source path (required)
  - Supports workspace paths (e.g., `products/shoe.jpg`) and absolute remote URLs (e.g., `https://example.com/image.jpg`).
- `width?: number` - Image width in pixels
- `height?: number` - Image height in pixels
- `transformations?: TransformOptions` - Transformation options
- `responsive?: boolean` - Enable responsive images (default: `true`)
- `lazy?: boolean` - Enable lazy loading (default: `true`)
- `sizes?: string` - Sizes attribute for responsive images
- All standard `<img>` HTML attributes are supported (e.g., `alt`, `class`, `style`, `(click)`, etc.)

## Documentation

See the [full documentation](https://autorender.mintlify.app) for complete API reference.
