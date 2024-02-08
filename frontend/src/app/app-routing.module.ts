import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {AgreementComponent} from "./views/agreement/agreement.component";
import {authForwardGuard} from "./core/auth/auth-forward.guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: MainComponent },
      { path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule), canActivate: [authForwardGuard]},
      { path: '', loadChildren: () => import('./views/blog/blog.module').then(m => m.BlogModule)},
      { path: 'policy', component: AgreementComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
