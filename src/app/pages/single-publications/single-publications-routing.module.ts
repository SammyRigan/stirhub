import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SinglePublicationsPage } from './single-publications.page';

const routes: Routes = [
  {
    path: '',
    component: SinglePublicationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinglePublicationsPageRoutingModule {}
