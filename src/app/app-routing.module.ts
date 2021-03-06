import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/auth/login/login.component';
import {MortgageCalculatorComponent} from './components/mortgage-calculator/mortgage-calculator.component';
import {PostCreateComponent} from './components/post/post-create/post-create.component';
import {SignupComponent} from './components/auth/signup/signup.component';
import {AuthGuard} from './components/auth/auth.guard';
import {PostListComponent} from './components/post/post-list/post-list.component';
import {GuideInfoComponent} from './components/guide-info/guide-info.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'guide', component: GuideInfoComponent },
  { path: 'post/add', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'post/edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'calculator', component: MortgageCalculatorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
