import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverInfoPanelComponent } from './hover-info-panel.component';

describe('HoverInfoPanelComponent', () => {
  let component: HoverInfoPanelComponent;
  let fixture: ComponentFixture<HoverInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoverInfoPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
