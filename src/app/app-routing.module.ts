import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { GatewaysComponent } from './gateways/gateways.component'; 

const routes: Routes = [
  {   
     path: 'home', component: GatewaysComponent     
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
