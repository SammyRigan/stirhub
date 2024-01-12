import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
// import { RounderPipe } from './rounder.pipe';
import { DateFromPipe } from './date-from.pipe';

@NgModule({
    imports: [CommonModule, IonicModule],
    declarations: [DateFromPipe],
    exports: [DateFromPipe]
})
export class CustomPipesModule {}
