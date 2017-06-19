import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { FloatingActionService } from '../shared/services/floating.action.service';
import { TodoService } from '../shared/services/todo.service';
import { Todo } from '../shared/model/todo';
import { Hero } from '../shared/model/hero';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit, OnDestroy {
  todos: any;
  fabSubscription: Subscription;
  dialogRef: MdDialogRef<AddTodoDialog>;
  heroes: Hero[];
  selectedHero: Hero;
  error: any;

  constructor(private todoService: TodoService, private router: Router, private fabService: FloatingActionService, private dialog: MdDialog) {
    this.todos = todoService.todos;
    this.fabSubscription = fabService.fab1Clicked$.subscribe((fab1) => {
      this.openDialog();
    });
  }

  ngOnInit() {
    this.fabService.setFab1(true, "add circle");
    this.getHeroes();
  }

  ngOnDestroy() {
    this.fabService.setFab1(false);
  }

  getDate(fbTimestamp): Date {
    return new Date(fbTimestamp);
  }

  openDialog() {
    this.dialogRef = this.dialog.open(AddTodoDialog, {
      disableClose: false
    });

    this.dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result) {
        this.todoService.addNewTodo(result.title, result.comment);
      }
      this.dialogRef = null;
    });
  }



  getHeroes() {
    this.todoService.getHeroes().then(heroes => this.heroes = heroes);
  }
  onSelect(hero: Hero) { this.selectedHero = hero; }

  gotoDetail() {
    this.router.navigate(['/detail', this.selectedHero._id]);
  }

  addHero() {
    this.selectedHero = null;
    this.router.navigate(['/detail', 'new']);
  }

  deleteHero(hero: Hero, event: any) {
    event.stopPropagation();
    this.todoService
      .delete(hero)
      .then(res => {
        this.heroes = this.heroes.filter(h => h !== hero);
        if (this.selectedHero === hero) { this.selectedHero = null; }
      })
      .catch(error => this.error = error);
  }

}

@Component({
  selector: 'add-todo-dialog',
  templateUrl: './addTodo.dialog.html'
})
export class AddTodoDialog {
  constructor(public dialogRef: MdDialogRef<AddTodoDialog>) { }
}