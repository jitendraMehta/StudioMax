import type { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

import { AboutComponent } from './components/about/about.component';

import { CatalogComponent } from './components/catalog/catalog.component';

import { CatalogCategoryComponent } from './components/catalog-category/catalog-category.component';

import { ContactComponent } from './components/contact/contact.component';

import { ProductDetailComponent } from './components/product-detail/product-detail.component';



export const routes: Routes = [

	{ path: '', component: HomeComponent },

	{ path: 'about', component: AboutComponent },

	{ path: 'catalog/product/:id', component: ProductDetailComponent },

	{ path: 'catalog/category/:categoryId', component: CatalogCategoryComponent },

	{ path: 'catalog', component: CatalogComponent },

	{ path: 'contact', component: ContactComponent },

	{ path: '**', redirectTo: '' },

];


