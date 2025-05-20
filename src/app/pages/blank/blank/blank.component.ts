import { Component } from '@angular/core';
import { NavbarComponent } from "../../../layouts/navbar/navbar/navbar.component";
import { FooterComponent } from "../../../layouts/navbar/footer/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-blank',
  imports: [NavbarComponent, FooterComponent, RouterOutlet, NgxSpinnerComponent],
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.scss'
})
export class BlankComponent {

}
