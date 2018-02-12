import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditFormTriggerComponent } from './edit-form-trigger.component';
import { TemplateModule }         from 'ng2-qgrid/template';
import { EditFormComponent }      from 'ng2-qgrid/plugins/edit-form/edit-form.component';
import { EditFormControlComponent } from 'ng2-qgrid/plugins/edit-form/edit-form-control.component';

@NgModule({
	declarations: [EditFormTriggerComponent, EditFormComponent, EditFormControlComponent ],
    exports: [EditFormTriggerComponent, EditFormComponent, EditFormControlComponent],
    imports: [CommonModule, TemplateModule]
})
export class EditFormModule {}
