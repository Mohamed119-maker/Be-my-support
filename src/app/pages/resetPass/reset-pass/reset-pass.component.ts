import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-reset-pass',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.scss'
})
export class ResetPassComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly wishlistService = inject(WishlistService);

  isLoading: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  resetPassForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    ]),
    Cpassword: new FormControl('', [Validators.required])
  }, { validators: this.confirmPassword });

  confirmPassword(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('Cpassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPass(): void {
    if (this.resetPassForm.valid) {
      this.isLoading = true;
      const formData = {
        oldPassword: this.resetPassForm.get('oldPassword')?.value,
        newPassword: this.resetPassForm.get('newPassword')?.value,
        Cpassword: this.resetPassForm.get('Cpassword')?.value
      };

      this.authService.resetPass(formData).subscribe({
        next: (res) => {
          if (res.error) {
            this.wishlistService.error(res.error);
          } else {
            this.wishlistService.success('Password changed successfully');
            // Navigate to login after successful password change
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);
          }
        },
        error: (err) => {
          console.error('Password reset error:', err);
          this.wishlistService.error(err.error?.message || 'Failed to change password');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.resetPassForm.markAllAsTouched();
      this.wishlistService.error('Please fix the form errors before submitting');
    }
  }
}
