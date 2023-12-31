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

  get oneObjectIsSelected(): boolean {
    if (!this.canvas) {
      return false;
    }
    return this.canvas.getActiveObjects().length === 1;
  }

  isSelectingRange: boolean = false;

  private boundingBox: fabric.Object | undefined;
  private movingBox: fabric.Rect | undefined;

  private exceededScaleX: number | undefined;
  private exceededScaleY: number | undefined;
  private prevWidth: number | undefined;

  ngAfterViewInit(): void {
    if (!this.storyRef) {
      return;
    }

    this.canvas = new fabric.Canvas(this.storyRef.nativeElement, {
      selection: true,
      stateful: true,
    });

    // this.canvas.on('selection:created', (event) => {
    //   console.log('selected', event);
    // });

    this.canvas.on('object:moving', () => {
      if (
        this.movingBox === undefined ||
        this.movingBox.top === undefined ||
        this.movingBox.left === undefined ||
        this.movingBox.width === undefined ||
        this.movingBox.height === undefined ||
        this.movingBox.scaleX === undefined ||
        this.movingBox.scaleY === undefined ||
        this.boundingBox === undefined ||
        this.boundingBox.top === undefined ||
        this.boundingBox.left === undefined ||
        this.boundingBox.width === undefined ||
        this.boundingBox.height === undefined ||
        this.boundingBox.scaleX === undefined ||
        this.boundingBox.scaleY === undefined
      ) {
        return;
      }
      console.log('moving box', this.movingBox);

      const leftMaxLimit =
        this.boundingBox.left +
        this.boundingBox.width * this.boundingBox.scaleX -
        this.movingBox.width * this.movingBox.scaleX;
      const leftMinLimit = this.boundingBox.left;

      let targetLeft = this.movingBox.left;

      if (this.movingBox.left > leftMaxLimit) {
        targetLeft = leftMaxLimit;
      } else if (this.movingBox.left < leftMinLimit) {
        targetLeft = leftMinLimit;
      }

      this.movingBox.left = targetLeft;

      let targetTop = this.movingBox.top;
      const topMaxLimit =
        this.boundingBox.top +
        this.boundingBox.height * this.boundingBox.scaleY -
        this.movingBox.height * this.movingBox.scaleY;
      const topMinLimit = this.boundingBox.top;
      if (this.movingBox.top > topMaxLimit) {
        targetTop = topMaxLimit;
      } else if (this.movingBox.top < topMinLimit) {
        targetTop = topMinLimit;
      }
      this.movingBox.top = targetTop;
    });

    this.canvas.on('object:scaling', (event) => {
      if (
        this.movingBox === undefined ||
        this.movingBox.top === undefined ||
        this.movingBox.left === undefined ||
        this.movingBox.width === undefined ||
        this.movingBox.height === undefined ||
        this.boundingBox === undefined ||
        this.boundingBox.top === undefined ||
        this.boundingBox.left === undefined ||
        this.boundingBox.width === undefined ||
        this.boundingBox.height === undefined ||
        event.transform === undefined
      ) {
        return;
      }

      // console.log('bounding box', this.boundingBox);
      // console.log('scaling box', this.movingBox);
      // console.log('scaling event', event);

      if (event.transform.originX === 'left') {
        const rightRemainedWidth =
          this.boundingBox.width * (this.boundingBox.scaleX ?? 1) -
          (this.movingBox.left - this.boundingBox.left);
        const maxScaleX = rightRemainedWidth / this.movingBox.width;
        console.log('origin left max', maxScaleX);
        console.log('origin left box', this.movingBox);
        if (this.movingBox.scaleX && this.movingBox.scaleX > maxScaleX) {
          this.movingBox.scaleX = maxScaleX;
        }
      } else if (event.transform.originX === 'right') {
        console.log('event', event);

        if (this.movingBox.left === this.boundingBox.left) {
          this.exceededScaleX = this.movingBox.scaleX;
        } else if (this.boundingBox.left < this.movingBox.left) {
          this.exceededScaleX = undefined;
        }

        if (this.exceededScaleX !== undefined) {
          this.movingBox.scaleX = this.exceededScaleX;
        }
        // if (this.movingBox.left <= this.boundingBox.left) {
        //   if (this.exceededScaleX === undefined) {
        //     this.exceededScaleX = this.movingBox.scaleX;
        //   }
        //   this.movingBox.scaleX = this.exceededScaleX;
        //   this.movingBox.left = this.boundingBox.left;
        // } else {
        //   this.exceededScaleX = undefined;
        // }
      }
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

  onClickSelectRange(_event: MouseEvent) {
    this.isSelectingRange = true;

    const selectedObject = this.canvas?.getActiveObject();
    if (!selectedObject) {
      console.error('Selected object not found');
      return;
    }
    console.log(selectedObject);
    this.boundingBox = selectedObject;

    const rect = new fabric.Rect({
      top: selectedObject.top,
      left: selectedObject.left,
      fill: 'red',
      width: (selectedObject.width ?? 300) * (selectedObject.scaleX ?? 1),
      height: (selectedObject.height ?? 300) * (selectedObject.scaleY ?? 1),
      opacity: 0.5,
    });
    this.movingBox = rect;

    if (!this.canvas) {
      console.error('Canvas not found');
      return;
    }
    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
  }
}
