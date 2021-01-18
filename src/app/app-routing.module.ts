import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {MortgageCalculatorComponent} from './components/mortgage-calculator/mortgage-calculator.component';
import {PostComponent} from './components/post/post.component';
import {PostCreateComponent} from './components/post-create/post-create.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostComponent },
  { path: 'post/edit/:postId', component: PostCreateComponent },
  { path: 'calculator', component: MortgageCalculatorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
