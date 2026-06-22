/**
 * AR Video Component for Angular
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AutoRenderService } from './service';
import { loadVideoJs } from '@autorender/js/viewtag/load-videojs';
import type { TransformOptions } from '@autorender/js/viewtag';

type VideoJsPlayer = any;
type StreamingType = 'hls' | 'dash';
type VideoStreamingOptions = {
  type: StreamingType;
  resolutions: number[];
};
type ARVideoTransformations = TransformOptions & {
  streaming?: VideoStreamingOptions;
};

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

@Component({
  selector: 'ar-video',
  standalone: true,
  template: `
    <div
      data-vjs-player
      [style.width]="width !== undefined ? width + 'px' : '100%'"
      [style.position]="'relative'"
      [style.display]="'block'"
      [style.backgroundColor]="showPlaceholder ? '#e5e7eb' : null"
      [class]="rootClass()"
    >
      <video
        #videoEl
        class="video-js vjs-default-skin"
        [style.visibility]="showPlaceholder ? 'hidden' : 'visible'"
      ></video>
    </div>
  `,
})
export class ARVideoComponent implements AfterViewInit, OnChanges, OnDestroy {
  private arService = inject(AutoRenderService);
  private player: VideoJsPlayer | null = null;
  private lastResolvedSrc: string | null = null;
  private fallbackApplied = false;

  @ViewChild('videoEl', { static: true }) videoElementRef!: ElementRef<HTMLVideoElement>;

  private _src = signal<string>('');
  private _width = signal<number | undefined>(undefined);
  private _height = signal<number | undefined>(undefined);
  private _transformations = signal<ARVideoTransformations | undefined>(undefined);

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

  @Input() set transformations(value: ARVideoTransformations | undefined) {
    this._transformations.set(value);
  }
  get transformations(): ARVideoTransformations | undefined {
    return this._transformations();
  }

  @Input() controls = true;
  @Input() autoPlay = false;
  @Input() muted = false;
  @Input() loop = false;
  @Input() preload: 'auto' | 'metadata' | 'none' = 'metadata';
  @Input() playsInline = true;
  @Input() poster?: string;
  @Input() fallback?: string;
  @Input() ngClass?: any;
  @Input() ngStyle?: any;
  showPlaceholder = false;

  rootClass(): string {
    const n = this.ngClass;
    const base = 'ar-video';
    if (n == null || n === '') return base;
    if (typeof n === 'string') return `${base} ${n}`.trim();
    if (Array.isArray(n)) return [base, ...n].join(' ');
    if (typeof n === 'object') {
      const o = n as Record<string, boolean>;
      const extra = Object.keys(o).filter((k) => o[k]);
      return [base, ...extra].join(' ');
    }
    return base;
  }

  resolvedSrc = computed(() => {
    const ar = this.arService.getInstance();
    const src = this._src();
    const width = this._width();
    const height = this._height();
    const transformations = this._transformations();
    const streamingConfig = transformations?.streaming;
    const streamingResolutions = streamingConfig?.resolutions || [];
    const streamingToken =
      streamingResolutions.length > 0
        ? `st_${streamingResolutions.map((value: number) => Math.round(value)).join('_')}`
        : undefined;
    const manifestSuffix =
      streamingConfig?.type === 'hls' ? '/ar-master.m3u8' : streamingConfig?.type === 'dash' ? '/ar-master.mpd' : '';
    const normalizedSrc =
      manifestSuffix && !src.endsWith('/ar-master.m3u8') && !src.endsWith('/ar-master.mpd')
        ? `${src.replace(/\/+$/, '')}${manifestSuffix}`
        : src;

    const fullTransform = {
      ...transformations,
      streaming: undefined,
      ...(streamingToken && { [streamingToken]: true }),
      ...(width && { w: width }),
      ...(height && { h: height }),
    };

    const hasTransform = Object.keys(fullTransform).length > 0;
    if (isAbsoluteUrl(normalizedSrc) && !hasTransform) {
      return normalizedSrc;
    }

    return ar.url(normalizedSrc, fullTransform);
  });

  private resolvedFallback(): string | undefined {
    if (!this.fallback) return undefined;
    const ar = this.arService.getInstance();
    return isAbsoluteUrl(this.fallback) ? this.fallback : ar.url(this.fallback);
  }

  private applyVjsDimensions(): void {
    if (!this.player) return;
    if (this.width !== undefined || this.height !== undefined) {
      const vjsEl = this.player.el() as HTMLElement;
      if (vjsEl) {
        vjsEl.style.width = this.width !== undefined ? `${this.width}px` : '100%';
        vjsEl.style.height = this.height !== undefined ? `${this.height}px` : 'auto';
        vjsEl.style.paddingTop = '0';
      }
    }
  }

  ngAfterViewInit(): void {
    const resolvedSrc = this.resolvedSrc();
    void loadVideoJs().then((videojs) => {
      if (this.player) return;

      this.player = videojs(this.videoElementRef.nativeElement, {
      controls: this.controls,
      autoplay: this.autoPlay,
      muted: this.muted,
      loop: this.loop,
      preload: this.preload,
      playsinline: this.playsInline,
      poster: this.poster,
      restoreEl: true,
      fluid: true,
      aspectRatio: '16:9',
      responsive: false,
      sources: [{ src: resolvedSrc }],
    });
    this.applyVjsDimensions();
    this.player.on('error', () => {
      if (!this.player) return;
      const fallbackSrc = this.resolvedFallback();
      if (fallbackSrc && !this.fallbackApplied) {
        this.fallbackApplied = true;
        this.player.src([{ src: fallbackSrc }]);
        this.lastResolvedSrc = fallbackSrc;
        return;
      }
      this.showPlaceholder = true;
    });
    this.player.on('loadeddata', () => {
      this.showPlaceholder = false;
    });
    this.player.on('canplay', () => {
      this.showPlaceholder = false;
    });
    });
  }

  ngOnChanges(_: SimpleChanges): void {
    if (!this.player) return;
    const resolvedSrc = this.resolvedSrc();
    this.player.poster(this.poster || '');
    this.player.autoplay(this.autoPlay);
    this.player.muted(this.muted);
    this.player.loop(this.loop);
    this.applyVjsDimensions();
    if (this.lastResolvedSrc !== resolvedSrc) {
      this.fallbackApplied = false;
      this.showPlaceholder = false;
      this.player.src([{ src: resolvedSrc }]);
      this.lastResolvedSrc = resolvedSrc;
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }
}
