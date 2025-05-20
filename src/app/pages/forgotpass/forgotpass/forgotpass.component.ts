import { Component, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputOtp } from 'primeng/inputotp';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-forgotpass',
  imports: [StepperModule, ButtonModule, ReactiveFormsModule, InputOtp],
  templateUrl: './forgotpass.component.html',
  styleUrl: './forgotpass.component.scss'
})
export class ForgotpassComponent {
  private readonly authService = inject(AuthService)

  forgotPassForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  })

  changePassForm: FormGroup = new FormGroup({
    otp: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPass: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)])
  })

  forgotPassword(): void {
    if (this.forgotPassForm.valid) {
      const emailValue = this.forgotPassForm.get('email')?.value;
      this.changePassForm.get('email')?.patchValue(emailValue);
      this.authService.forgotPass(this.forgotPassForm.value).subscribe({
        next: (res => {
          console.log(res);

        })
      })
    }

  }

  changePassword(): void {
    if (this.changePassForm.valid) {
      this.authService.changePass(this.changePassForm.value).subscribe({
        next: (res => {
          console.log(res);

        })
      })
    }

  }

  hideForgotPass(): void {
    this.authService.goForgetPass.set(false);
  }

}
