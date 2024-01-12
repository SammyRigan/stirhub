import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstitutionsPageRoutingModule } from './institutions-routing.module';

import { InstitutionsPage } from './institutions.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstitutionsPageRoutingModule,
    SharedModule,
    SuggestionWidgetModule
  ],
  declarations: [InstitutionsPage]
})
export class InstitutionsPageModule {}
