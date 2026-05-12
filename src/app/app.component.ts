import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Task{
  id:number;
  title:string;
  completed:boolean;
}

@Component({
  selector: 'app-root',
  standalone:true,
  imports:[FormsModule,CommonModule],
  templateUrl:'./app.component.html',
  styleUrl:'./app.component.css'
})
export class AppComponent{

  taskName:string="";

  selectedId:number=0;

  isEdit:boolean=false;

  tasks:Task[]=[];

  // ADD TASK
  addTask(){

    if(this.taskName.trim()==""){
      alert("Enter Task");
      return;
    }

    const newTask:Task={
      id:this.tasks.length+1,
      title:this.taskName,
      completed:false
    };

    this.tasks.push(newTask);

    this.taskName="";
  }

  // DELETE TASK
  deleteTask(id:number){

    this.tasks=this.tasks.filter(
      x=>x.id!==id
    );

  }

  // EDIT TASK
  editTask(task:Task){

    this.taskName=task.title;

    this.selectedId=task.id;

    this.isEdit=true;

  }

  // UPDATE TASK
  updateTask(){

    const index=this.tasks.findIndex(
      x=>x.id===this.selectedId
    );

    this.tasks[index].title=this.taskName;

    this.taskName="";

    this.isEdit=false;

  }

  // COMPLETE TASK
  completeTask(task:Task){

    task.completed=!task.completed;

  }

}