import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { Iproducts } from '../../../shared/interfaces/iproducts';
import { ICategory } from '../../../shared/interfaces/ICategory';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../core/services/products/products.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-admin-products-component',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-products-component.component.html',
  styleUrl: './admin-products-component.component.scss'
})
export class AdminProductsComponentComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly productsService = inject(ProductsService);
  private readonly wishlistService = inject(WishlistService);
  id = inject(PLATFORM_ID);
  allProducts: Iproducts[] = [];
  previewUrl: string | null = null;
  previewSubUrls: (string | null)[] = Array(4).fill(null);
  categories: ICategory[] = [];
  imageCoverFile: File | null = null;
  subImagesFiles: File[] = [];
  showInfo: WritableSignal<boolean> = signal(false);
  selectedProduct: Iproducts = {} as Iproducts;
  onUpdate: WritableSignal<boolean> = signal(false);
  selectedProductId: WritableSignal<string> = signal("");
  originalSubImageUrls: string[] = [];



  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {

      this.getDashboardProducts();
      this.getCategories();
    }
  }

  getDashboardProducts(): void {
    this.dashboardService.getAllProducts().subscribe({
      next: (res) => {
        this.allProducts = res.Products;
        console.log(this.allProducts);
      }
    })
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


  addProductForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    description: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    price: new FormControl(null, [Validators.required, Validators.min(0.01)]),
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
          this.getDashboardProducts();
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


  editProduct(product: Iproducts): void {
    this.onUpdate.set(true);
    this.selectedProductId.set(product._id);

    this.addProductForm.patchValue({
      title: product.title,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      category: product.category.name,
    });

    this.previewUrl = product.imageCover.secure_url;

    this.addProductForm.get('imageCover')?.clearValidators();
    this.addProductForm.get('imageCover')?.updateValueAndValidity();
    this.addProductForm.get('subImages')?.clearValidators();
    this.addProductForm.get('subImages')?.updateValueAndValidity();

    this.previewSubUrls = Array(4).fill(null);
    this.originalSubImageUrls = []; // إعادة التعيين

    if (product.subImages?.length) {
      product.subImages.forEach((img, index) => {
        if (index < 4) {
          const url = img.secure_url;
          this.previewSubUrls[index] = url;
          this.originalSubImageUrls[index] = url;
        }
      });
    }
  }

  updateProduct(id: string): void {
    const productId = this.selectedProductId(); // 👈 اقرأ القيمة من الإشارة

    if (this.addProductForm.valid && productId) {
      const formData = new FormData();
      const { title, description, price, discount, stock, category } = this.addProductForm.getRawValue();
      const selectedCategory = this.categories.find(cat => cat.name === category);
      const categoryId = selectedCategory?.id;

      if (!categoryId) {
        this.wishlistService.error('❌ لم يتم العثور على الكاتيجوري!');
        return;
      }

      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('discount', discount);
      formData.append('stock', stock);
      formData.append('category', categoryId);

      if (this.imageCoverFile) {
        formData.append('imageCover', this.imageCoverFile);
      }

      if (this.subImagesFiles.length > 0) {
        this.subImagesFiles.forEach((file: File) => {
          formData.append('subImages', file);
        });
        formData.append('replaceSubImages', 'true');
      }

      const deletedSubImages = this.originalSubImageUrls.filter((url, index) => {
        return this.previewSubUrls[index] === null;
      });

      if (deletedSubImages.length > 0) {
        formData.append('deletedSubImages', JSON.stringify(deletedSubImages));
      }

      this.productsService.updateProduct(productId, formData).subscribe({
        next: (res) => {
          this.wishlistService.success(res.message);
          this.clearForm();
          this.onUpdate.set(false);
          this.getDashboardProducts();
          for (let [key, value] of formData.entries()) {
            console.log(`🧾 ${key}:`, value);
          }
        }
      });
    } else {
      this.addProductForm.markAllAsTouched();
      this.wishlistService.error('البيانات غير مكتملة أو المنتج غير محدد!');
    }
  }


  removeSubImage(index: number): void {
    this.previewSubUrls[index] = null;
  }
  onSubmit(): void {
    if (this.onUpdate()) {
      this.updateProduct(this.selectedProductId());
    } else {
      this.addproduct();
    }
  }


  viewSpeceficProduct(id: string): void {
    this.dashboardService.getSpeceficProduct(id).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedProduct = res.data;
        this.showInfo.set(true);
      }
    })
  }


  deleteProductByAdmin(id: string): void {

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
        this.dashboardService.deleteProduct(id).subscribe({
          next: (res) => {
            console.log(res);
            Swal.fire({
              title: "Deleted!",
              text: res.message,
              icon: "success",

            });
            this.getDashboardProducts();
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

  closeModal(event: MouseEvent) {
    this.showInfo.set(false); // يقفل المودال
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
