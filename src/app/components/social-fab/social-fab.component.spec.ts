import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialFabComponent } from './social-fab.component';

describe('SocialFabComponent', () => {
  let component: SocialFabComponent;
  let fixture: ComponentFixture<SocialFabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialFabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocialFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
