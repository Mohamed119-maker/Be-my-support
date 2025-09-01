import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductsComponentComponent } from './admin-products-component.component';

describe('AdminProductsComponentComponent', () => {
  let component: AdminProductsComponentComponent;
  let fixture: ComponentFixture<AdminProductsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
