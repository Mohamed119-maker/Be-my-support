import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { Iproducts } from '../../shared/interfaces/iproducts';
import { ContactService } from '../../core/services/contact/contact.service';
import { WhatsappService } from '../../core/services/whatsapp/whatsapp.service';
import { isPlatformBrowser } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [GalleriaModule, FormsModule,],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly whatsappService = inject(WhatsappService);
  private readonly wishlistService = inject(WishlistService);
  private readonly id = inject(PLATFORM_ID);
  showNumber: boolean = false;
  animate = false;

  productId: any;
  imageList: any[] = [];
  activeImageIndex: number = 0;
  prodDetails: Iproducts = {} as Iproducts;
  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {
      this.activatedRoute.paramMap.subscribe({
        next: (res) => {
          console.log(res);

          this.productId = res.get('id');
          if (this.productId) {
            this.getSpeceficProduct();
          }
        },
        error: (err) => {
          console.error('Error getting product ID from route:', err);
        }
      });
    }
  }

  getSpeceficProduct(): void {
    this.productsService.getSpecProduct(this.productId).subscribe({
      next: (res) => {
        console.log(res);

        this.prodDetails = res.data;

        // تأكيد إن subImages عبارة عن array قبل محاولة دمجها
        const subImages = Array.isArray(this.prodDetails.subImages) ? this.prodDetails.subImages : [];

        this.imageList = [this.prodDetails.imageCover, ...subImages];
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      }
    });
  }

  position: 'bottom' | 'top' | 'left' | 'right' = 'left';

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];


  togglePhoneNum() {
    this.showNumber = !this.showNumber;

    // Trigger animation manually
    this.animate = false;
    setTimeout(() => {
      this.animate = true;
    }, 10); // small delay to re-trigger animation
  }


  copyPhoneNumber(event: MouseEvent) {
    event.stopPropagation(); // لمنع تفعيل togglePhoneNum بالخطأ

    const number = this.prodDetails.createdBy.mobileNumber;
    navigator.clipboard.writeText(number).then(() => {
      this.wishlistService.success('The number has been copied.')
    });
  }

  chatWhatsApp(): void {
    this.whatsappService.chatWhatsApp(this.productId).subscribe({
      next: (res) => {
        open(res.chatDetails.whatsappUrl, '_blank');
      },
      error: (err) => {
        console.error('Error opening WhatsApp chat:', err);
      }
    });
  }
}
