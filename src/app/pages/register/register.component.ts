
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { InputOtp } from 'primeng/inputotp';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../core/services/auth/auth.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-register',
  imports: [CarouselModule, ReactiveFormsModule, RouterLink, InputOtp],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  isLoading: boolean = false;
  step: WritableSignal<any> = signal(1);
  msgError: string = '';
  value: any;
  imgs: string[] = [
    "/image/pngtree-schoolgirl-with-a-disability-enjoying-a-book-in-the-library-photo-image_29756742.jpg",
    "/image/61LIqlycR+L._AC_SX679_.jpg",
    "/image/photo_2025-04-08_17-28-01.jpg"
  ]

  authSlider: OwlOptions = {
    rtl: true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    autoplaySpeed: 3000,
    autoplayHoverPause: true,
    items: 1,
    autoWidth: true,
    nav: false
  }


  registerForm: FormGroup = new FormGroup({
    userName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)]),
    Cpassword: new FormControl(null),
    mobileNumber: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    address: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,.'-]{3,}$/)]),
  }, { validators: this.confirmPassword });

  otpForm: FormGroup = new FormGroup({

    email: new FormControl(null, [Validators.required, Validators.email]),
    otpCode: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)]),

  });
  submitForm(): void {
    this.isLoading = true;
    this.authService.sendRegisterForm(this.registerForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistService.success(res.message);
        this.clearForm();
        setTimeout(() => {

        }, 500);
        this.step.set(2);
        //account created
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    })

  }

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;


    return password === rePassword ? null : { mismatch: true }
  }

  verifyAcc(): void {

    this.authService.sendOptForm(this.otpForm.value).subscribe({


      next: (res) => {
        console.log(res);
        localStorage.setItem('token', res.token)

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 500);
      },
      error: (err) => {
        console.log(err);

      }
    })
    console.log(this.otpForm.value);

  }


  clearForm(): void {
    this.registerForm.reset();

    // نظّف الحالة الداخلية لكل عنصر
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity();
    });
  }
}
