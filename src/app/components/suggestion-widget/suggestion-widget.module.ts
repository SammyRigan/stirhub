import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SuggestionBlockComponent } from './suggestion-block/suggestion-block.component';
import { SuggestionWidgetComponent } from './suggestion-widget.component';
import { SuggestionsModalComponent } from './suggestions-modal/suggestions-modal.component';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule],
  declarations: [SuggestionWidgetComponent, SuggestionBlockComponent, SuggestionsModalComponent],
  exports: [SuggestionWidgetComponent, SuggestionBlockComponent, SuggestionsModalComponent]
})
export class SuggestionWidgetModule {}
