import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';
import { CustomPipesModule } from 'src/app/pipes/custom-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    SharedModule,
    SuggestionWidgetModule,
    CustomPipesModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
