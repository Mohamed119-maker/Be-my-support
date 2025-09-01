import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../core/services/auth/auth.service';
import { ForgotpassComponent } from "../forgotpass/forgotpass/forgotpass.component";
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-login',
  imports: [CarouselModule, ReactiveFormsModule, RouterLink, ForgotpassComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly wishlistService = inject(WishlistService)
  private readonly router = inject(Router);
  isLoading: boolean = false;
  showPassword: boolean = false;
  goForgetPassword = computed(() => this.authService.goForgetPass());
  role: Signal<string> = computed(() => this.authService.role());
  msgError: string = '';
  imgs: string[] = [
    "/image/pngtree-schoolgirl-with-a-disability-enjoying-a-book-in-the-library-photo-image_29756742.jpg",
    "/image/61LIqlycR+L._AC_SX679_.jpg",
    "/image/photo_2025-04-08_17-28-01.jpg"
  ]

  loginSlider: OwlOptions = {
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

  ngOnInit(): void {
    this.authService.goForgetPass.set(false);
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)])
  })

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submitLoginForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.sendLoginForm(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.accessToken);
          this.wishlistService.success(res.message);
          this.clearForm();
          this.authService.getUserInfo();
          this.authService.isLogin.set(true);
          this.authService.userName.set(this.authService.userInfo().userName);

          const role = this.authService.userInfo()?.role;
          setTimeout(() => {
            if (role === 'admin') {
              this.router.navigate(['/dashboard-overview']);
            } else {
              this.router.navigate(['/home']);
            }
          }, 500);
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  showForgotPass(): void {
    this.authService.goForgetPass.set(true);
  }

  clearForm(): void {
    this.loginForm.reset();
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity();
    });
  }
}
