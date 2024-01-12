import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchivesPublicationsPage } from './archives-publications.page';

const routes: Routes = [
  {
    path: '',
    component: ArchivesPublicationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArchivesPublicationsPageRoutingModule {}
