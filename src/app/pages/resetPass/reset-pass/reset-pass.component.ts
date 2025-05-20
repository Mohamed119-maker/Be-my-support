import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-reset-pass',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.scss'
})
export class ResetPassComponent {
  private readonly authService = inject(AuthService)
  isLoading: boolean = false;

  resetPassForm: FormGroup = new FormGroup({

    oldPassword: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)]),
    newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)]),
    Cpassword: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)]),

  }, { validators: this.confirmPassword })



  confirmPassword(group: AbstractControl) {
    const oldPassword = group.get('oldPassword')?.value;
    const newPassword = group.get('newPassword')?.value;


    return oldPassword === newPassword ? null : { mismatch: true }
  }

  resetPass(): void {
    if (this.resetPassForm.valid) {

      this.authService.resetPass(this.resetPassForm.value).subscribe({
        next: (res) => {
          console.log(res);

        }
      })
    }
    else {
      this.resetPassForm.markAllAsTouched();
    }
  }
}
