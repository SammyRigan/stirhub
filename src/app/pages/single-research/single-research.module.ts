import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleResearchPageRoutingModule } from './single-research-routing.module';

import { SingleResearchPage } from './single-research.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';
import { CustomPipesModule } from 'src/app/pipes/custom-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleResearchPageRoutingModule,
    SharedModule,
    SuggestionWidgetModule,
    CustomPipesModule
  ],
  declarations: [SingleResearchPage]
})
export class SingleResearchPageModule {}
