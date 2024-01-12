import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleResearchPage } from './single-research.page';

const routes: Routes = [
  {
    path: '',
    component: SingleResearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleResearchPageRoutingModule {}
