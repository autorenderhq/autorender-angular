# @autorender/angular

Autorender SDK adapter for Angular - Upload and ViewTag functionality.

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

### Complete Transform Example

```typescript
import { Component } from '@angular/core';
import { ARImageComponent } from '@autorender/angular';
import type { TransformOptions } from '@autorender/js';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ARImageComponent],
  template: `
    <ar-image
      src="hero.jpg"
      [width]="1200"
      [height]="800"
      alt="Hero image"
      [transform]="transform"
      [responsive]="true"
      [lazy]="true"
      sizes="(min-width: 1200px) 1200px, 100vw"
      class="hero-image"
    />
  `
})
export class HeroComponent {
  transform: TransformOptions = {
    // Size & Crop
    w: 1200,
    h: 800,
    fit: 'cover', // 'crop' | 'fill' | 'fit' | 'scale'
    ar: '16:9', // Aspect ratio
    position: 'center', // Position: 'p_c' | 'p_tl' | 'p_tr' | 'p_bl' | 'p_br' | 'p_t' | 'p_b' | 'p_l' | 'p_r' or full names
    position_startagy: 'attention', // User passes: 'entropy' | 'attention' (SDK generates ps_*)
    
    // Transform
    r: 0, // Rotation: number (0-360) | 'portrait' | 'landscape'
    z: 1.2, // Zoom level
    flip: 'h', // 'h' | 'v' | 'hv' | 'vh'
    br: 20, // Border radius in pixels
    
    // Format & Quality
    f: 'auto', // 'auto' | 'webp' | 'jpg' | 'png' | 'avif'
    q: 'auto', // 'auto' | 'auto:best' | number (1-100)
    
    // Background
    bg: 'rgb:FF5733', // Background color
    
    // DPR
    dpr: 2, // Device pixel ratio (0.1-10)
    
    // Effects
    improve: true, // Auto-enhancement
    unsharpMask: 100, // Unsharp mask strength (1-2000)
    saturation: 20, // Saturation adjustment (-100 to 100)
    contrast: 15, // Contrast adjustment (-100 to 100)
    brightness: 10, // Brightness adjustment (-99 to 100)
    gamma: 0, // Gamma correction (-50 to 150)
    sharpen: 50, // Sharpen: boolean | number (1-2000)
    grayscale: false, // Convert to grayscale
    blackwhite: 50, // Black and white balance (0-100)
    hue: 0, // Hue rotation (-180 to 180)
    warmth: 0, // Warmth adjustment (-100 to 100)
    tint: 0, // Tint adjustment (-100 to 100)
    normalize: false, // Normalize histogram
    invert: false, // Invert colors
    fade: 0, // Fade effect (0-100)
    vignette: 0, // Vignette strength (0-100)
    highlights: 0, // Highlights adjustment (-100 to 100)
    shadows: 0, // Shadows adjustment (-100 to 100)
    exposure: 0, // Exposure adjustment (-100 to 100)
    structure: 0, // Structure/clarity (0-100)
    autoEnhance: false, // Auto enhance
    temperature: 0, // Temperature adjustment (-100 to 100)
    blur: 0, // Blur amount (0-20)
    
    // Layers
    layers: [
      {
        type: 'image',
        imagePath: 'logo.png',
        layerType: 'overlay', // 'overlay' | 'underlay'
        width: 200,
        height: 200,
        placement: 'north-east', // Human-readable placement
        x: 0,
        y: 0,
        opacity: 100,
        rotation: 0,
      },
      {
        type: 'text',
        text: 'Hello World',
        fontFamily: 'arial',
        fontSize: 24,
        fontStyle: 'bold',
        fontColor: 'FF0000',
        placement: 'south',
        x: 0,
        y: -20,
        rotation: 0,
      }
    ],
    
    // Blend mode
    blend: 'overlay', // 'screen' | 'overlay' | 'multiply' | 'mask' | 'anti_removal'
  };
}
```

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
- `transformations?: TransformOptions` - Transformation options (see TransformOptions Reference below)
- `responsive?: boolean` - Enable responsive images (default: `true`)
- `lazy?: boolean` - Enable lazy loading (default: `true`)
- `sizes?: string` - Sizes attribute for responsive images
- All standard `<img>` HTML attributes are supported (e.g., `alt`, `class`, `style`, `(click)`, etc.)

## TransformOptions Reference

All transformation parameters available in the `transformations` input. See [full documentation](https://autorender.mintlify.app) for complete reference.

### Size & Crop
- `w?: number` - Width in pixels
- `h?: number` - Height in pixels
- `fit?: 'crop' | 'fill' | 'fit' | 'scale'` - Crop mode
- `ar?: string` - Aspect ratio (e.g., `"16:9"`)
- `position?: 'p_c' | 'p_tl' | 'p_tr' | 'p_bl' | 'p_br' | 'p_t' | 'p_b' | 'p_l' | 'p_r' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right'` - Position
- `position_startagy?: 'entropy' | 'attention'` - Position strategy (SDK generates `ps_` prefix)

### Preset (named transformation)
- `preset?: string` - Optional named preset, which becomes a leading `t_<preset>` segment in the URL.

  Example:
  ```html
  <ar-image
    src="avatar.png"
    [width]="100"
    [height]="100"
    alt="Unavailable avatar"
    [transform]="{ preset: 'unavailable', w: 100, h: 100 }"
  />
  <!-- Results in: /workspace/t_unavailable,w_100,h_100/avatar.png -->
  ```

### Transform
- `r?: number | 'portrait' | 'landscape'` - Rotation
- `z?: number` - Zoom level
- `flip?: 'h' | 'v' | 'hv' | 'vh'` - Flip direction
- `br?: number` - Border radius

### Format & Quality
- `f?: string` - Format (`"auto"`, `"webp"`, `"jpg"`, etc.)
- `q?: string | number` - Quality (`"auto"` or 1-100)

### Effects
- `improve?: boolean | string | object` - Auto-enhancement
- `saturation?: number` - Saturation (-100 to 100)
- `contrast?: number` - Contrast (-100 to 100)
- `brightness?: number` - Brightness (-99 to 100)
- `sharpen?: boolean | number` - Sharpen
- `grayscale?: boolean` - Convert to grayscale
- `blur?: number` - Blur amount (0-20)
- `vignette?: number` - Vignette strength (0-100)
- `exposure?: number` - Exposure (-100 to 100)
- And many more... (see [full documentation](https://autorender.mintlify.app) for complete list)

### Layers
- `layers?: LayerOptions[]` - Array of layer options
  - Image layers: `{ type: 'image', imagePath: string, layerType?: 'overlay' | 'underlay', ... }`
  - Text layers: `{ type: 'text', text: string, fontFamily?: string, fontSize?: number, ... }`

## Documentation

See the [full documentation](https://autorender.mintlify.app) for complete API reference.
