import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { routing } from './todos.routing';
import { SmartadminModule } from '../shared/smartadmin.module';
import { TodosComponent, AddTodoDialog } from './todos.component';
import { EditTodoComponent } from './editTodo.component';

@NgModule({
  imports: [
    routing,
    SmartadminModule
  ],
  declarations: [
    TodosComponent,
    AddTodoDialog,
    EditTodoComponent
  ],
  entryComponents: [
    AddTodoDialog
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TodosModule { }
