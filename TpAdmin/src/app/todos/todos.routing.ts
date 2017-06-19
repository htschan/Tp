import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodosComponent } from "./todos.component";
import { EditTodoComponent } from "./editTodo.component";

export const todosRoutes: Routes = [
    {
        path: '', 
        component: TodosComponent,
        data: {
            pageTitle: 'Todos'
        }
    },
    {
        path: 'edit/:rkey',
        component: EditTodoComponent
    }
];

export const routing = RouterModule.forChild(todosRoutes);

