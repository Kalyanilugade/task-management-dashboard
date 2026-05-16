import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';

import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import {
  Chart,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent
implements OnInit, AfterViewInit {

  currentUser:any;

  taskName:string='';

  tasks:any[]=[];

  searchText:string='';

  filterType:string='all';

  editMode:boolean=false;

  editTaskId:number=0;

  darkMode:boolean=false;

  suggestedTasks:string[]=[];

  chatInput:string='';

  todoTasks:any[]=[];

  progressTasks:any[]=[];

  completedTasks:any[]=[];

  pieChart:any;

  barChart:any;

  lineChart:any;

  chatMessages:any[]=[

    {
      role:'bot',
      text:'Hello 👋 How can I help you today?'
    }

  ];

  taskSuggestions:string[]=[

    'Complete Angular Project',
    'Practice TypeScript',
    'Fix Dashboard Bugs',
    'Prepare for Interview',
    'Push Code to GitHub',
    'Learn RxJS',
    'Build Authentication'

  ];

  constructor(

    private authService:AuthService,
    private router:Router

  ){}

  ngOnInit(){

    const userData=
    localStorage.getItem('loggedInUser');

    if(userData){

      this.currentUser=
      JSON.parse(userData);

    }

    this.loadTasks();

    this.organizeTasks();

    const theme=
    localStorage.getItem('darkMode');

    this.darkMode=
    theme==='true';

  }

  ngAfterViewInit(){

    setTimeout(()=>{

      this.createPieChart();

      this.createBarChart();

      this.createLineChart();

    },300);

  }

  /* 🌙 DARK MODE */

  toggleDarkMode(){

    this.darkMode=!this.darkMode;

    localStorage.setItem(

      'darkMode',

      this.darkMode.toString()

    );

  }

  /* 📌 ORGANIZE TASKS */

  organizeTasks(){

    this.todoTasks=
    this.tasks.filter(
      t=>t.status==='todo'
    );

    this.progressTasks=
    this.tasks.filter(
      t=>t.status==='progress'
    );

    this.completedTasks=
    this.tasks.filter(
      t=>t.status==='completed'
    );

  }

  /* 🚚 DRAG DROP */

  drop(event:CdkDragDrop<any[]>){

    if(
      event.previousContainer ===
      event.container
    ){

      moveItemInArray(

        event.container.data,

        event.previousIndex,

        event.currentIndex

      );

    }

    else{

      transferArrayItem(

        event.previousContainer.data,

        event.container.data,

        event.previousIndex,

        event.currentIndex

      );

    }

    /* UPDATE STATUS */

    this.todoTasks.forEach(task=>{
      task.status='todo';
    });

    this.progressTasks.forEach(task=>{
      task.status='progress';
    });

    this.completedTasks.forEach(task=>{
      task.status='completed';
      task.completed=true;
    });

    this.tasks=[

      ...this.todoTasks,
      ...this.progressTasks,
      ...this.completedTasks

    ];

    this.saveTasks();

    this.updateCharts();

  }

  /* ✍️ ADD TASK */

  addTask(){

    if(this.taskName.trim()){

      const newTask={

        id:Date.now(),

        title:this.taskName,

        status:'todo',

        completed:false,

        createdAt:new Date(),

        completedAt:null

      };

      this.tasks.push(newTask);

      this.taskName='';

      this.suggestedTasks=[];

      this.organizeTasks();

      this.saveTasks();

      this.updateCharts();

    }

  }

  /* ✏️ EDIT TASK */

  editTask(task:any){

    this.editMode=true;

    this.editTaskId=task.id;

    this.taskName=task.title;

  }

  updateTask(){

    const task=
    this.tasks.find(
      t=>t.id===this.editTaskId
    );

    if(task){

      task.title=this.taskName;

      this.taskName='';

      this.editMode=false;

      this.saveTasks();

      this.updateCharts();

    }

  }

  /* ❌ DELETE */

  deleteTask(id:number){

    this.tasks=
    this.tasks.filter(
      task=>task.id!==id
    );

    this.organizeTasks();

    this.saveTasks();

    this.updateCharts();

  }

  /* ✅ COMPLETE */

  toggleTask(task:any){

    task.completed=!task.completed;

    task.status=
    task.completed
    ?
    'completed'
    :
    'todo';

    if(task.completed){

      task.completedAt=
      new Date();

    }

    this.organizeTasks();

    this.saveTasks();

    this.updateCharts();

  }

  /* 💾 STORAGE */

  saveTasks(){

    localStorage.setItem(

      `tasks_${this.currentUser.email}`,

      JSON.stringify(this.tasks)

    );

  }

  loadTasks(){

    const data=
    localStorage.getItem(

      `tasks_${this.currentUser.email}`

    );

    if(data){

      this.tasks=
      JSON.parse(data);

    }

  }

  /* 📊 COUNTS */

  getTotalTasks(){

    return this.tasks.length;

  }

  getCompletedCount(){

    return this.tasks.filter(
      task=>task.completed
    ).length;

  }

  getPendingCount(){

    return this.tasks.filter(
      task=>!task.completed
    ).length;

  }

  /* 🔍 FILTER */

  getFilteredTasks(){

    let filtered=this.tasks;

    if(this.searchText){

      filtered=
      filtered.filter(task=>

        task.title
        .toLowerCase()
        .includes(
          this.searchText.toLowerCase()
        )

      );

    }

    if(this.filterType==='completed'){

      filtered=
      filtered.filter(
        task=>task.completed
      );

    }

    if(this.filterType==='pending'){

      filtered=
      filtered.filter(
        task=>!task.completed
      );

    }

    return filtered;

  }

  /* 💡 SUGGESTIONS */

  getSuggestions(){

    if(!this.taskName){

      this.suggestedTasks=[];

      return;

    }

    this.suggestedTasks=
    this.taskSuggestions.filter(task=>

      task
      .toLowerCase()
      .includes(
        this.taskName.toLowerCase()
      )

    );

  }

  /* 📈 PRODUCTIVITY */

  getProductivityScore(){

    const total=
    this.getTotalTasks();

    const completed=
    this.getCompletedCount();

    if(total===0){

      return 0;

    }

    return Math.round(

      (completed/total)*100

    );

  }

  getAverageCompletionTime(){

    return 'Keep completing tasks consistently 🚀';

  }

  /* 🥧 PIE CHART */

  createPieChart(){

    this.pieChart=
    new Chart('taskChart',{

      type:'pie',

      data:{

        labels:[
          'Completed',
          'Pending'
        ],

        datasets:[{

          data:[

            this.getCompletedCount(),

            this.getPendingCount()

          ]

        }]

      }

    });

  }

  /* 📊 BAR CHART */

  createBarChart(){

    this.barChart=
    new Chart('barChart',{

      type:'bar',

      data:{

        labels:[
          'Completed',
          'Pending'
        ],

        datasets:[{

          label:'Tasks',

          data:[

            this.getCompletedCount(),

            this.getPendingCount()

          ]

        }]

      }

    });

  }

  /* 📈 LINE CHART */

  createLineChart(){

    this.lineChart=
    new Chart('lineChart',{

      type:'line',

      data:{

        labels:[
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri'
        ],

        datasets:[{

          label:'Performance',

          data:[
            20,
            40,
            60,
            80,
            100
          ]

        }]

      }

    });

  }

  /* 🔄 UPDATE CHARTS */

  updateCharts(){

    if(this.pieChart){

      this.pieChart.data.datasets[0].data=[

        this.getCompletedCount(),

        this.getPendingCount()

      ];

      this.pieChart.update();

    }

    if(this.barChart){

      this.barChart.data.datasets[0].data=[

        this.getCompletedCount(),

        this.getPendingCount()

      ];

      this.barChart.update();

    }

  }

  /* 🤖 CHATBOT */

  sendMessage(){

    if(!this.chatInput.trim()){

      return;

    }

    this.chatMessages.push({

      role:'user',

      text:this.chatInput

    });

    const userText=
    this.chatInput.toLowerCase();

    this.chatInput='';

    let response=
    'I am here to help you 🚀';

    if(userText.includes('task')){

      response=
      'You can add and manage tasks easily ✅';

    }

    else if(userText.includes('productivity')){

      response=
      `Your productivity is ${this.getProductivityScore()}% 🔥`;

    }

    else if(userText.includes('help')){

      response=
      'Try completing pending tasks first 👍';

    }

    setTimeout(()=>{

      this.chatMessages.push({

        role:'bot',

        text:response

      });

    },500);

  }

  /* 🚪 LOGOUT */

  logout(){

    this.authService.logout();

    this.router.navigate(['/']);

  }

}