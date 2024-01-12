import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsHubPage } from './events-hub.page';

const routes: Routes = [
  {
    path: '',
    component: EventsHubPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsHubPageRoutingModule {}
