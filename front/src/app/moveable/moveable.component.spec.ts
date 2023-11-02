import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveableComponent } from './moveable.component';

describe('MoveableComponent', () => {
  let component: MoveableComponent;
  let fixture: ComponentFixture<MoveableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoveableComponent]
    });
    fixture = TestBed.createComponent(MoveableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
