import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductsService } from "../../../core/services/products/products.service";
import { ICategory } from "../../../shared/interfaces/ICategory";
import { ActivatedRoute, Router } from "@angular/router";
import { Iproducts } from "../../../shared/interfaces/iproducts";
import { isPlatformBrowser } from "@angular/common";
import { WishlistService } from "../../../core/services/wishlist/wishlist.service";

@Component({
  selector: 'app-updateproduct',
  imports: [ReactiveFormsModule],
  templateUrl: './updateproduct.component.html',
  styleUrl: './updateproduct.component.scss'
})
export class UpdateproductComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  productsService = inject(ProductsService);
  productId: any
  categories: ICategory[] = [];
  productData!: Iproducts
  imageCoverFile: File | null = null;
  subImagesFiles: File[] = [];
  platformId = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.productData = history.state['prod'];
    }

    console.log(this.productData);
    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.productId = res.get('id');
        if (this.productId) {


        }
      },
      error: (err) => {
        console.error('Error getting product ID from route:', err);
      }
    });
    this.setDataToform()
    this.getCategories()
  }

  updateProductForm: FormGroup = new FormGroup({
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    description: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    price: new FormControl<number | null>(null, [
      Validators.required
    ]),
    discount: new FormControl<number | null>(null, [
      Validators.min(0),
      Validators.max(100),
    ]),
    stock: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    category: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    imageCover: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    subImages: new FormControl<string[] | null>(null, [
      Validators.required,
      Validators.minLength(1), // لازم صورة واحدة على الأقل
    ]),
  });

  updateProduct() {
    if (this.updateProductForm.invalid) {
      console.log('النموذج غير مكتمل أو يحتوي على أخطاء', this.updateProductForm.value);
      return;
    }
    console.log(this.updateProductForm.value);

    const formData = new FormData();

    // ✳️ جلب اسم الكاتيجوري من الفورم
    const categoryName = this.updateProductForm.get('category')?.value;

    // ✳️ البحث عن الكاتيجوري في اللي جت من الـ API
    const selectedCategory = this.categories.find(cat => cat.name === categoryName);

    // ✳️ استخراج الـ ID منها
    const categoryId = selectedCategory?.id;

    if (!categoryId) {
      console.error('❌ لم يتم العثور على الكاتيجوري!');
      return;
    }

    // ✳️ تعبئة البيانات في الـ FormData
    formData.append('title', this.updateProductForm.get('title')?.value);
    formData.append('description', this.updateProductForm.get('description')?.value);
    formData.append('price', this.updateProductForm.get('price')?.value);
    formData.append('discount', this.updateProductForm.get('discount')?.value);
    formData.append('stock', this.updateProductForm.get('stock')?.value);
    formData.append('category', categoryId); // ✅ هنا أرسلنا الـ ID مش الاسم

    // ✅ صورة الغلاف
    if (this.imageCoverFile) {
      formData.append('imageCover', this.imageCoverFile);
    } else {
      console.error('لم يتم اختيار صورة غلاف!');
      return;
    }


    // ✅ الصور الفرعية
    if (this.subImagesFiles.length > 0) {
      this.subImagesFiles.forEach((file: File) => {
        formData.append('subImages', file);
      });
    } else {
      console.error('لم يتم اختيار صور فرعية!');
      return;
    }


    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // ✳️ إرسال الطلب
    if (this.productId) {
      this.productsService.updateProduct(this.productId, formData).subscribe({
        next: (res) => {
          console.log('✅ تم تعديل المنتج بنجاح:', res);
          this.wishlistService.success(res.message);
          setTimeout(() => {
            this.router.navigate(['/user-profile'])
          }, 2000);
          // ممكن تضيف Toast هنا
        },
        error: (err) => {
          console.error('❌ حدث خطأ أثناء تعديل المنتج:', err);
          // ممكن تضيف Toast هنا
        }
      });
    } else {
      console.error('❌ لا يوجد productId!');
      // ممكن تظهر Toast خطأ للمستخدم هنا
    }
    this.clearForm();
  }


  onImageCoverChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageCoverFile = file;
      this.updateProductForm.get('imageCover')?.setValue(file);
      console.log('📸 تم تحميل صورة الغلاف:', file);
    } else {
      console.log('⚠️ لم يتم تحميل صورة الغلاف');
    }
  } getCategories() {
    this.productsService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categories = res.data
      },
      error: (err) => {
        console.log(err);

      }
    })
  }
  setDataToform() {
    if (this.productData) {
      this.updateProductForm.patchValue({
        title: this.productData.title,
        description: this.productData.description,
        price: this.productData.price,
        discount: this.productData.discount,
        stock: this.productData.stock,
        category: this.productData.category,

      });
    }
  }


  onSubImagesChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.subImagesFiles = Array.from(files);
      this.updateProductForm.get('subImages')?.setValue(this.subImagesFiles);
      console.log('📷 تم تحميل الصور الفرعية:', this.subImagesFiles);
    } else {
      console.log('⚠️ لم يتم تحميل أي صور فرعية');
    }
  }


  clearForm(): void {
    this.updateProductForm.get('title')?.setValue(null);
    this.updateProductForm.get('description')?.setValue(null);
    this.updateProductForm.get('price')?.setValue(null);
    this.updateProductForm.get('discount')?.setValue(null);
    this.updateProductForm.get('stock')?.setValue(null);
    this.updateProductForm.get('category')?.setValue(null);
    this.updateProductForm.get('imageCover')?.setValue(null);
    this.updateProductForm.get('subImages')?.setValue(null);
  }

}