import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [EducationComponent, ExperienceComponent],
  exports: [EducationComponent, ExperienceComponent]
})
export class ProfileBuilderWidgetsModule {}
