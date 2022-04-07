import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsGuideComponent } from './charts-guide.component';

describe('ChartsGuideComponent', () => {
  let component: ChartsGuideComponent;
  let fixture: ComponentFixture<ChartsGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsGuideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
