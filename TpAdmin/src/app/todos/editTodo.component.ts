import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../shared/services/todo.service';
import { Todo } from '../shared/model/todo';

@Component({
    selector: 'edit-todo',
    templateUrl: './editTodo.component.html'
})
export class EditTodoComponent {
    form: FormGroup;
    receiptKey: string;
    options = [{ value: "Erledigt", label: "Erl" }, { value: "Pendent", label: "Pend" }];
    chooseOption: string;
    editTodo: Todo = new Todo();
    saveTodo: Todo = new Todo();

    constructor(
        private todoService: TodoService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder) {
        this.form = this.fb.group({
            title: '',
            comment: '',
            owner: '',
            finished: '',
            prio: ''
        });
        this.route.params.subscribe((params: Params) => {
            this.receiptKey = params['rkey'];
        });
    }

    setValue(todo: Todo) {
        this.form.setValue({
            title: todo.title,
            comment: todo.comment,
            owner: todo.owner,
            finished: todo.finished,
            prio: 66
        });
    }
    
    save() {
        let todo = new Todo();
        todo.createdAt = this.saveTodo.createdAt;
        todo.createdBy = this. saveTodo.createdBy;
        todo = todo.cloneFrom(this.form.getRawValue());
        this.todoService.saveTodo(this.receiptKey, todo);
    }

    resetForm() {
        this.editTodo = this.editTodo.cloneFrom(this.saveTodo);
        this.setValue(this.editTodo);
        this.form.markAsPristine();
        this.form.markAsUntouched();
    }
}