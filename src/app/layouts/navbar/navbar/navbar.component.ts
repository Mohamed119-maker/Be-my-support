import { Component, computed, effect, ElementRef, HostListener, inject, OnInit, PLATFORM_ID, signal, Signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IUserinfo } from '../../../shared/interfaces/iuserinfo';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);


  isScrolling: boolean = false;
  userInformation: IUserinfo = {} as IUserinfo;
  userName: Signal<string> = computed(() => this.authService.userName());
  loginDropDown: Signal<boolean> = computed(() => this.authService.isLogin());
  showInfoToAddProd: WritableSignal<boolean> = signal(false);
  showMenu = false;
  wishCount: Signal<number> = computed(() => this.wishlistService.wishlistNumber());
  platformId = inject(PLATFORM_ID);

  constructor(
    private elementRef: ElementRef,
    private router: Router
  ) {
    // يقفل المينيو عند تغيير الراوت
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();
      });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('token')) {
        this.authService.isLogin.set(true);
        this.getAllProductWish();
        this.authService.getUserInfo();
        this.userInformation = this.authService.userInfo();
        this.authService.userName.set(this.userInformation.userName);
      }
    }
  }

  goToAddProduct(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/addProduct']);
    }
    else {
      this.showInfoToAddProd.set(true);
    }
  }


  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }


  getAllProductWish() {
    this.wishlistService.getAllProductWishlist().subscribe({
      next: (res) => {
        console.log(res.data.wishlist);
        this.wishlistService.wishlistNumber.set(res.data.wishlist.length)

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolling = window.scrollY > 50;
  }

  closeModal(event: MouseEvent) {
    this.showInfoToAddProd.set(false); // يقفل المودال
  }


  logout(): void {
    this.authService.userName.set('');
    this.authService.isLogin.set(false);
    this.authService.logOut();
  }
}
