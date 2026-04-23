import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CorporateComponent } from './pages/corporate/corporate.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/products/product-detail/product-detail.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/corporate/components/about/about.component';
import { SssComponent } from './pages/corporate/components/sss/sss.component';
import { ReferencesComponent } from './pages/corporate/components/references/references.component';
import { TeamComponent } from './pages/corporate/components/team/team.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, 
    { 
      path: 'corporate', 
      children: [
        { path: '', component: CorporateComponent },
        { path: 'components/about', component: AboutComponent },
        { path: 'components/sss', component: SssComponent },
        { path: 'components/references', component: ReferencesComponent },
        { path: 'components/team', component: TeamComponent }
      ]
    }, 
    { path: 'products', component: ProductsComponent }, 
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'contact', component: ContactComponent }, 
    { path: '**', redirectTo: '' }  
];
