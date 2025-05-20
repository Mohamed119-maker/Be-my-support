import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ProductsComponent } from './pages/products/products.component';
import { DetailsComponent } from './pages/details/details.component';
import { WishlistComponent } from './pages/wishlist/wishlist/wishlist.component';
import { AddproductComponent } from './pages/addproduct/addproduct/addproduct.component';
import { UserProfileComponent } from './pages/userProfile/user-profile/user-profile.component';
import { ResetPassComponent } from './pages/resetPass/reset-pass/reset-pass.component';
import { ForgotpassComponent } from './pages/forgotpass/forgotpass/forgotpass.component';
import { UpdateproductComponent } from './pages/updateproduct/updateproduct/updateproduct.component';
import { AdminProductsComponentComponent } from './pages/adminProductsComponent/admin-products-component/admin-products-component.component';
import { AdminCategoriesComponentComponent } from './pages/adminCategoriesComponent/admin-categories-component/admin-categories-component.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { DashboardOverviewComponent } from './pages/dashboardOverview/dashboard-overview/dashboard-overview.component';
import { BlankComponent } from './pages/blank/blank/blank.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role/role.guard';
import { adminBlockGuard } from './core/guards/admin-block/admin-block.guard';

export const routes: Routes = [
    {
        path: '',
        component: BlankComponent,
        canActivate: [roleGuard],
    },

    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: 'dashboard-overview',
                loadComponent: () =>
                    import('./pages/dashboardOverview/dashboard-overview/dashboard-overview.component').then(
                        m => m.DashboardOverviewComponent
                    ),
                title: 'Dashboard Overview',
                canActivate: [roleGuard],
            },
            {
                path: 'admin-products',
                loadComponent: () =>
                    import('./pages/adminProductsComponent/admin-products-component/admin-products-component.component').then(
                        m => m.AdminProductsComponentComponent
                    ),
                title: 'Admin Products',
                canActivate: [roleGuard],
            },
            {
                path: 'admin-categories',
                loadComponent: () =>
                    import('./pages/adminCategoriesComponent/admin-categories-component/admin-categories-component.component').then(
                        m => m.AdminCategoriesComponentComponent
                    ),
                title: 'Admin Categories',
                canActivate: [roleGuard],
            },
            {
                path: 'admin-users',
                loadComponent: () =>
                    import('./pages/admin-users/admin-users.component').then(
                        m => m.AdminUsersComponent
                    ),
                title: 'Admin Users',
                canActivate: [roleGuard],
            },
        ],
    },

    {
        path: '',
        component: BlankComponent,
        children: [
            {
                path: 'register',
                loadComponent: () =>
                    import('./pages/register/register.component').then(m => m.RegisterComponent),
                title: 'Sign Up',
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./pages/login/login.component').then(m => m.LoginComponent),
                title: 'Sign in',
            },
            {
                path: 'home',
                loadComponent: () =>
                    import('./pages/home/home.component').then(m => m.HomeComponent),
                title: 'Home',
                canActivate: [adminBlockGuard],
            },
            {
                path: 'about',
                loadComponent: () =>
                    import('./pages/about/about.component').then(m => m.AboutComponent),
                title: 'About',
                canActivate: [adminBlockGuard],
            },
            {
                path: 'addProduct',
                loadComponent: () =>
                    import('./pages/addproduct/addproduct/addproduct.component').then(m => m.AddproductComponent),
                title: 'Add Product',
                canActivate: [adminBlockGuard, authGuard],
            },
            {
                path: 'wishlist',
                loadComponent: () =>
                    import('./pages/wishlist/wishlist/wishlist.component').then(m => m.WishlistComponent),
                title: 'Wishlist',
                canActivate: [adminBlockGuard],
            },
            {
                path: 'details/:id',
                loadComponent: () =>
                    import('./pages/details/details.component').then(m => m.DetailsComponent),
                title: 'Details',
                canActivate: [adminBlockGuard],
            },
            {
                path: 'user-profile',
                loadComponent: () =>
                    import('./pages/userProfile/user-profile/user-profile.component').then(m => m.UserProfileComponent),
                title: 'Profile',
                canActivate: [adminBlockGuard, authGuard],
            },
            {
                path: 'products',
                loadComponent: () =>
                    import('./pages/products/products.component').then(m => m.ProductsComponent),
                title: 'Products',
                canActivate: [adminBlockGuard],
            },
            {
                path: 'forget-pass',
                loadComponent: () =>
                    import('./pages/forgotpass/forgotpass/forgotpass.component').then(m => m.ForgotpassComponent),
                title: 'Forgot Password',
                canActivate: [adminBlockGuard],
            },
            {
                path: 'reset-pass',
                loadComponent: () =>
                    import('./pages/resetPass/reset-pass/reset-pass.component').then(m => m.ResetPassComponent),
                title: 'Reset Password',
                canActivate: [adminBlockGuard, authGuard],
            },
            {
                path: 'updateproduct/:id',
                loadComponent: () =>
                    import('./pages/updateproduct/updateproduct/updateproduct.component').then(m => m.UpdateproductComponent),
                title: 'Update Product',
                canActivate: [adminBlockGuard, authGuard],
            },
        ],
    },

    {
        path: '**',
        loadComponent: () =>
            import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent),
        title: 'Not Found',
    },
];
