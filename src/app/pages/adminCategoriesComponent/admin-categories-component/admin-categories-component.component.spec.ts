import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoriesComponentComponent } from './admin-categories-component.component';

describe('AdminCategoriesComponentComponent', () => {
  let component: AdminCategoriesComponentComponent;
  let fixture: ComponentFixture<AdminCategoriesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategoriesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCategoriesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
