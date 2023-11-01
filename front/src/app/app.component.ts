import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Frame } from 'scenejs';
import type { OnPinch, OnDrag, OnScale, OnRotate, OnResize, OnWarp } from 'moveable';
import { NgxMoveableComponent } from 'ngx-moveable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'front';

  @ViewChild('target', { static: false }) target!: ElementRef<HTMLDivElement>;
  @ViewChild('label', { static: false }) label!: ElementRef<HTMLDivElement>;
  @ViewChild('moveable', { static: false }) moveable!: NgxMoveableComponent;

  frame = new Frame({
    width: '250px',
    height: '200px',
    left: '0px',
    top: '0px',
    transform: {
      rotate: '0deg',
      scaleX: 1,
      scaleY: 1,
      matrix3d: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ],
    },
  });

  ngOnInit(): void {
    window.addEventListener('resize', this.onWindowReisze);
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowReisze);
  }

  onWindowReisze = () => {
    console.log(this.moveable.ngDragStart);
    this.moveable.updateRect();
  }

  onDrag({ target, clientX, clientY, top, left, isPinch }: OnDrag) {
    this.frame.set('left', `${left}px`);
    this.frame.set('top', `${top}px`);
    this.setTransform(target);
    if (!isPinch) {
      this.setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`);
    }
  }

  onResize({ target, clientX, clientY, width, height, isPinch }: OnResize) {
    this.frame.set('width', `${width}px`);
    this.frame.set('height', `${height}px`);
    this.setTransform(target);
    if (!isPinch) {
      this.setLabel(clientX, clientY, `W: ${width}px<br/>H: ${height}px`);
    }
  }

  setLabel(clientX: number, clientY: number, text: string) {
    this.label.nativeElement.style.cssText = `
display: block; transform: translate(${clientX}px, ${clientY - 10}px) translate(-100%, -100%) translateZ(-100px);`;
    this.label.nativeElement.innerHTML = text;
  }

  setTransform(target: HTMLElement | SVGElement) {
    target.style.cssText = this.frame.toCSS();
  }

  onEnd() {
    this.label.nativeElement.style.display = 'none';
  }
}
