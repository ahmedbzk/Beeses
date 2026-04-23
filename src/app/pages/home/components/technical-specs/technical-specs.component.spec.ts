import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSpecsComponent } from './technical-specs.component';

describe('TechnicalSpecsComponent', () => {
  let component: TechnicalSpecsComponent;
  let fixture: ComponentFixture<TechnicalSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSpecsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicalSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
