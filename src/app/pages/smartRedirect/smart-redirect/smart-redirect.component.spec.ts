import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartRedirectComponent } from './smart-redirect.component';

describe('SmartRedirectComponent', () => {
  let component: SmartRedirectComponent;
  let fixture: ComponentFixture<SmartRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
