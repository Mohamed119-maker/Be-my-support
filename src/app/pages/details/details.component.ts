import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal, ViewEncapsulation } from '@angular/core';
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
import { AuthService } from '../../core/services/auth/auth.service';
import { LoginPromptModalComponent } from '../../shared/components/login-prompt-modal/login-prompt-modal.component';
import { environment } from '../../core/environments/environment';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [GalleriaModule, FormsModule, LoginPromptModalComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly whatsappService = inject(WhatsappService);
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);
  private readonly id = inject(PLATFORM_ID);
  showNumber: boolean = false;
  animate = false;
  showLoginPrompt: WritableSignal<boolean> = signal(false);
  productId: string = '';
  imageList: string[] = [];
  activeImageIndex: number = 0;
  prodDetails: Iproducts = {} as Iproducts;

  // Galleria configuration
  galleriaOptions = {
    numVisible: 5,
    showThumbnails: true,
    showIndicators: true,
    showItemNavigators: true,
    showThumbnailNavigators: true,
    circular: true,
    autoPlay: false,
    transitionInterval: 3000,
    responsiveOptions: [
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
    ]
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {
      this.activatedRoute.paramMap.subscribe({
        next: (params) => {
          this.productId = params.get('id') || '';
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
        this.prodDetails = res.data;

        // Handle image URLs
        if (this.prodDetails.imageCover) {
          const imageCoverUrl = this.prodDetails.imageCover.secure_url;
          const subImagesUrls = Array.isArray(this.prodDetails.subImages)
            ? this.prodDetails.subImages.map(img => img.secure_url)
            : [];

          this.imageList = [imageCoverUrl, ...subImagesUrls].filter(Boolean);
        }
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
        this.wishlistService.error('Error loading product images');
      }
    });
  }

  position: 'bottom' | 'top' | 'left' | 'right' = 'left';

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
    if (!this.authService.isLoggedIn()) {
      this.showLoginPrompt.set(true);
      return;
    }

    this.whatsappService.chatWhatsApp(this.productId).subscribe({
      next: (res) => {
        open(res.chatDetails.whatsappUrl, '_blank');
      },
      error: (err) => {
        console.error('Error opening WhatsApp chat:', err);
        this.wishlistService.error('Error opening WhatsApp chat');
      }
    });
  }

  closeLoginPrompt(): void {
    this.showLoginPrompt.set(false);
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-product.png';
  }
}
