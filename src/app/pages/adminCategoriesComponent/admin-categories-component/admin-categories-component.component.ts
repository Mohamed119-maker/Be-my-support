import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { ICategory } from '../../../shared/interfaces/ICategory';

@Component({
  selector: 'app-admin-categories-component',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-categories-component.component.html',
  styleUrl: './admin-categories-component.component.scss'
})
export class AdminCategoriesComponentComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly wishlistService = inject(WishlistService);
  private readonly id = inject(PLATFORM_ID);
  allCategories: ICategory[] = [];
  numOfCategories: WritableSignal<number> = signal(0);
  imageCoverFile: File | null = null;
  previewUrl: string | null = null;
  selectedCategory: ICategory = {} as ICategory;
  selectedCategoryId: WritableSignal<string> = signal("");
  onUpdate: WritableSignal<boolean> = signal(false);
  showInfo: WritableSignal<boolean> = signal(false);


  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {

      this.getDashboardcategories();
    }
  }


  addCategoryForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    image: new FormControl(null, [Validators.required]),
  });



  addCategory(): void {
    if (this.addCategoryForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addCategoryForm.get('name')?.value);

      if (this.imageCoverFile) {
        formData.append('image', this.imageCoverFile);
      } else {
        console.error('لم يتم اختيار صورة غلاف!');
        return;
      }

      // ✅ استخدمنا formData هنا
      this.dashboardService.addCategory(formData).subscribe({
        next: (res) => {
          console.log('✅ تم إضافة الكاتجوري بنجاح:', res);
          this.wishlistService.success(res.message);
          this.getDashboardcategories();
          this.clearForm();
        },
        error: (err) => {
          console.error('❌ خطأ في الإضافة:', err);
        }
      });
    }
    else {
      this.addCategoryForm.markAllAsTouched();
    }


  }

  editCategory(category: ICategory): void {
    this.onUpdate.set(true);
    this.selectedCategoryId.set(category._id);
    this.addCategoryForm.patchValue({
      name: category.name,
    });
    this.previewUrl = category.image.secure_url;

    // ⚠️ نلغي شرط required للصورة
    this.addCategoryForm.get('image')?.clearValidators();
    this.addCategoryForm.get('image')?.updateValueAndValidity();
  }

  updateCategory(id: string): void {

    if (this.addCategoryForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addCategoryForm.get('name')?.value);

      if (this.imageCoverFile) {
        formData.append('image', this.imageCoverFile); // صورة جديدة
      }

      // ✅ استخدمنا formData هنا
      this.dashboardService.updateCategory(this.selectedCategoryId(), formData).subscribe({
        next: (res) => {
          console.log('✅ تم تعديل الكاتجوري بنجاح:', res);
          this.wishlistService.success(res.message);
          this.getDashboardcategories();
          this.clearForm();
        },
        error: (err) => {
          console.error('❌ خطأ في التعديل:', err);
        }
      });
    }
    else {
      this.addCategoryForm.markAllAsTouched();
    }


  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageCoverFile = file;

      // عرض المعاينة
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);

      // تحديث الفيلد يدوياً عشان Validator يشتغل
      this.addCategoryForm.patchValue({ image: file });
      this.addCategoryForm.get('image')?.updateValueAndValidity();
    }
  }


  getDashboardcategories(): void {
    this.dashboardService.getAllCategories().subscribe({
      next: (res) => {
        this.allCategories = res.data;
        this.allCategories.forEach(category => {
          if (category.createdBy === null) {
            console.log('This category does not have a creator:', category);
          }
        });
        console.log(this.allCategories);
      }
    });
  }


  viewSpeceficCategory(id: string): void {
    this.dashboardService.getSpeceficCategory(id).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedCategory = res.data;
        this.showInfo.set(true);
      }
    })
  }


  deleteCategoryByAdmin(id: string): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.dashboardService.deleteCategory(id).subscribe({
          next: (res) => {
            console.log(res);
            this.wishlistService.success(res.message);
            Swal.fire({
              title: "Deleted!",
              text: res.message,
              icon: "success",

            });
            this.getDashboardcategories();

          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Your imaginary product is safe :)",
          icon: "error"
        });
      }
    });




  }

  onSubmit(): void {
    if (this.onUpdate()) {
      this.updateCategory(this.selectedCategoryId());
    } else {
      this.addCategory();
    }
  }


  clearForm(): void {
    this.addCategoryForm.reset();

    // نظّف الحالة الداخلية لكل عنصر
    Object.values(this.addCategoryForm.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity();
    });
    this.onUpdate.set(false);
    this.previewUrl = null;
  }

  closeModal(event: MouseEvent) {
    this.showInfo.set(false); // يقفل المودال
  }

}
