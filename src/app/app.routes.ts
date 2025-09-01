import { Routes } from '@angular/router';
import { BlankComponent } from './pages/blank/blank/blank.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { adminBlockGuard } from './core/guards/admin-block/admin-block.guard';
import { roleGuard } from './core/guards/role/role.guard';
import { LoadingComponent } from './shared/components/loading/loading.component';

export const routes: Routes = [
    // Initial route - checks role and redirects
    {
        path: '',
        pathMatch: 'full',
        component: LoadingComponent,
        canActivate: [roleGuard]
    },

    // Public routes
    {
        path: '',
        component: BlankComponent,
        children: [
            {
                path: 'home',
                loadComponent: () =>
                    import('./pages/home/home.component').then(m => m.HomeComponent),
                title: 'Home',
                canActivate: [adminBlockGuard]
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./pages/login/login.component').then(m => m.LoginComponent),
                title: 'Sign in',
                canActivate: [adminBlockGuard]
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./pages/register/register.component').then(m => m.RegisterComponent),
                title: 'Sign Up',
                canActivate: [adminBlockGuard]
            },
            {
                path: 'forget-pass',
                loadComponent: () =>
                    import('./pages/forgotpass/forgotpass/forgotpass.component').then(m => m.ForgotpassComponent),
                title: 'Forgot Password'
            },
            {
                path: 'reset-pass',
                loadComponent: () =>
                    import('./pages/resetPass/reset-pass/reset-pass.component').then(m => m.ResetPassComponent),
                title: 'Reset Password'
            },
            {
                path: 'about',
                loadComponent: () =>
                    import('./pages/about/about.component').then(m => m.AboutComponent),
                title: 'About',
                canActivate: [adminBlockGuard]
            },
            {
                path: 'products',
                loadComponent: () =>
                    import('./pages/products/products.component').then(m => m.ProductsComponent),
                title: 'Products',
                canActivate: [adminBlockGuard]
            },
            {
                path: 'details/:id',
                loadComponent: () =>
                    import('./pages/details/details.component').then(m => m.DetailsComponent),
                title: 'Details',
                canActivate: [adminBlockGuard]
            }
        ]
    },

    // Protected user routes
    {
        path: '',
        component: BlankComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'wishlist',
                loadComponent: () =>
                    import('./pages/wishlist/wishlist/wishlist.component').then(m => m.WishlistComponent),
                title: 'Wishlist',
                canActivate: [adminBlockGuard]
            },
            {
                path: 'addProduct',
                loadComponent: () =>
                    import('./pages/addproduct/addproduct/addproduct.component').then(m => m.AddproductComponent),
                title: 'Add Product',
                canActivate: [adminBlockGuard]
            },
            {
                path: 'updateproduct/:id',
                loadComponent: () =>
                    import('./pages/updateproduct/updateproduct/updateproduct.component').then(
                        m => m.UpdateproductComponent
                    ),
                title: 'Update Product',
                canActivate: [adminBlockGuard]
            },
            {
                path: 'user-profile',
                loadComponent: () =>
                    import('./pages/userProfile/user-profile/user-profile.component').then(m => m.UserProfileComponent),
                title: 'Profile',
                canActivate: [adminBlockGuard]
            }
        ]
    },

    // Admin dashboard routes
    {
        path: '',
        component: DashboardComponent,
        canActivate: [authGuard, roleGuard],
        children: [
            {
                path: 'dashboard-overview',
                loadComponent: () =>
                    import('./pages/dashboardOverview/dashboard-overview/dashboard-overview.component').then(
                        m => m.DashboardOverviewComponent
                    ),
                title: 'Dashboard Overview'
            },
            {
                path: 'admin-products',
                loadComponent: () =>
                    import('./pages/adminProductsComponent/admin-products-component/admin-products-component.component').then(
                        m => m.AdminProductsComponentComponent
                    ),
                title: 'Admin Products'
            },
            {
                path: 'admin-categories',
                loadComponent: () =>
                    import('./pages/adminCategoriesComponent/admin-categories-component/admin-categories-component.component').then(
                        m => m.AdminCategoriesComponentComponent
                    ),
                title: 'Admin Categories'
            },
            {
                path: 'admin-users',
                loadComponent: () =>
                    import('./pages/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
                title: 'Admin Users'
            }
        ]
    },

    // 404 route
    {
        path: '**',
        loadComponent: () =>
            import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent),
        title: 'Not Found'
    }
];
