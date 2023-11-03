import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-fabric',
  templateUrl: './fabric.component.html',
  styleUrls: ['./fabric.component.scss'],
})
export class FabricComponent implements AfterViewInit, OnDestroy {
  @ViewChild('story', { static: true })
  storyRef: ElementRef<HTMLCanvasElement> | undefined;
  canvas: fabric.Canvas | undefined;

  private imageUrls: Set<string> = new Set();

  ngAfterViewInit(): void {
    if (!this.storyRef) {
      return;
    }

    this.canvas = new fabric.Canvas(this.storyRef.nativeElement, {
      selection: true,
      stateful: true,
    });
  }

  ngOnDestroy(): void {
    this.imageUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  }

  /**
   * ファイル選択時
   * @param event
   */
  onFileSelected(event: Event) {
    if (event.target === null) {
      console.error('File upload target not found');
      return;
    }

    const element = event.target as HTMLInputElement;
    if (element.files === null || element.files.length === 0) {
      console.error('File not found');
      return;
    }

    const file: File = element.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.imageUrls.add(imageUrl);

      fabric.Image.fromURL(imageUrl, (img) => {
        if (!this.canvas) {
          return;
        }

        img.scaleToWidth(200); // 画像の幅を調整
        img.scaleToHeight(200); // 画像の高さを調整
        this.canvas.add(img);
      });
    }
  }
}
