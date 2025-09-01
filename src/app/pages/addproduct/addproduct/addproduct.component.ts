import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductsService } from "../../../core/services/products/products.service";
import { ICategory } from "../../../shared/interfaces/ICategory";
import { WishlistService } from "../../../core/services/wishlist/wishlist.service";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: 'app-addproduct',
  imports: [ReactiveFormsModule],
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.scss'
})
export class AddproductComponent implements OnInit {

  private readonly productsService = inject(ProductsService);
  private readonly wishlistService = inject(WishlistService);
  private readonly id = inject(PLATFORM_ID);
  previewUrl: string | null = null;
  previewSubUrls: (string | null)[] = Array(4).fill(null);
  categories: ICategory[] = [];
  imageCoverFile: File | null = null;
  subImagesFiles: File[] = [];
  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {

      this.getCategories();
    }
  }

  addProductForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    description: new FormControl(null, [Validators.required, Validators.minLength(20)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    discount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
    stock: new FormControl(null, [Validators.required, Validators.min(1)]),
    category: new FormControl(null, [Validators.required]),
    imageCover: new FormControl(null, [Validators.required]),
    subImages: new FormControl(null, [Validators.required]),
  });


  addproduct() {
    if (this.addProductForm.valid) {

      const formData = new FormData();

      // ✳️ جلب اسم الكاتيجوري من الفورم
      const categoryName = this.addProductForm.get('category')?.value;

      // ✳️ البحث عن الكاتيجوري في اللي جت من الـ API
      const selectedCategory = this.categories.find(cat => cat.name === categoryName);

      // ✳️ استخراج الـ ID منها
      const categoryId = selectedCategory?.id;

      if (!categoryId) {
        console.error('❌ لم يتم العثور على الكاتيجوري!');
        return;
      }

      // ✳️ تعبئة البيانات في الـ FormData
      formData.append('title', this.addProductForm.get('title')?.value);
      formData.append('description', this.addProductForm.get('description')?.value);
      formData.append('price', this.addProductForm.get('price')?.value);
      formData.append('discount', this.addProductForm.get('discount')?.value);
      formData.append('stock', this.addProductForm.get('stock')?.value);
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

      // ✳️ إرسال الطلب
      this.productsService.addproduct(formData).subscribe({
        next: (res) => {
          console.log('✅ تم إضافة المنتج بنجاح:', res);
          this.clearForm();
          this.wishlistService.success('product created Sucessfully');
        },
        error: (err) => {
          console.error('❌ حدث خطأ أثناء إضافة المنتج:', err);
        }
      });
    }
    else {
      this.addProductForm.markAllAsTouched();
      console.log('النموذج غير مكتمل أو يحتوي على أخطاء', this.addProductForm.value);
      return;
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
      this.addProductForm.patchValue({ imageCover: file });
      this.addProductForm.get('imageCover')?.updateValueAndValidity();
    }
  }

  onSubFileSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.subImagesFiles[index] = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewSubUrls[index] = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.addProductForm.patchValue({ subImages: this.subImagesFiles });
      this.addProductForm.get('subImages')?.updateValueAndValidity();
    }
  }

  removeImage(index: number): void {
    this.previewSubUrls[index] = null;
    this.subImagesFiles[index] = null as any;
  }

  onImageCoverChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageCoverFile = file;
      this.addProductForm.get('imageCover')?.setValue(file);
      console.log('📸 تم تحميل صورة الغلاف:', file);
    } else {
      console.log('⚠️ لم يتم تحميل صورة الغلاف');
    }
  }

  onSubImagesChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.subImagesFiles = Array.from(files);
      this.addProductForm.get('subImages')?.setValue(this.subImagesFiles);
      console.log('📷 تم تحميل الصور الفرعية:', this.subImagesFiles);
    } else {
      console.log('⚠️ لم يتم تحميل أي صور فرعية');
    }
  }


  getCategories() {
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


  clearForm(): void {
    this.addProductForm.reset();

    // نظّف الحالة الداخلية لكل عنصر
    Object.values(this.addProductForm.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity();
    });
    this.previewUrl = null;


    // امسح الصور والمعاينات
    this.previewSubUrls = Array(4).fill(null);
    this.subImagesFiles = [];
  }


}