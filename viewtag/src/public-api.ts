export { AutoRenderService, AUTORENDER_CONFIG } from './service';
export { ARImageComponent } from './image.component';

// `ARVideoComponent` is deliberately absent — it lives at
// '@autorender/angular/viewtag/video' so that image-only apps never pull
// `video.js` into their module graph. See ../video/src/public-api.ts.
