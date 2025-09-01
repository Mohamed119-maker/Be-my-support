import { Component, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputOtp } from 'primeng/inputotp';
import { RouterLink, Router } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-forgotpass',
  imports: [StepperModule, ButtonModule, ReactiveFormsModule, InputOtp],
  templateUrl: './forgotpass.component.html',
  styleUrl: './forgotpass.component.scss'
})
export class ForgotpassComponent {
  currentStep: number = 1;

  forgotPassForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  changePassForm: FormGroup = new FormGroup({
    otp: new FormControl(null, [Validators.required, Validators.pattern(/^\d{6}$/)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPass: new FormControl(null, [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private readonly authService: AuthService,
    private readonly wishlistService: WishlistService,
    private readonly router: Router
  ) { }

  forgotPassword(): void {
    if (this.forgotPassForm.valid) {
      const emailValue = this.forgotPassForm.get('email')?.value;
      this.changePassForm.get('email')?.patchValue(emailValue);
      this.authService.forgotPass(this.forgotPassForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.currentStep = 2;
          this.wishlistService.success('Reset code has been sent to your email');
        },
        error: (err) => {
          console.error('Error sending reset email:', err);
          this.wishlistService.error(err.error?.message || 'Failed to send reset code');
        }
      });
    }
  }

  changePassword(): void {
    if (this.changePassForm.valid) {
      this.authService.changePass(this.changePassForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.wishlistService.success('Password has been reset successfully');

          // Clear both forms
          this.forgotPassForm.reset();
          this.changePassForm.reset();

          // Check if there's a token in the response
          if (res.token) {
            // Store the token and update auth state
            localStorage.setItem('token', res.token);
            this.authService.getUserInfo();
            this.router.navigate(['/home']);
          } else {
            // No token, navigate to login
            this.router.navigate(['/login']);
          }

          this.hideForgotPass();
        },
        error: (err) => {
          console.error('Error changing password:', err);
          this.wishlistService.error(err.error?.error || 'Failed to reset password');
        }
      });
    }
  }

  hideForgotPass(): void {
    this.authService.goForgetPass.set(false);
  }
}
