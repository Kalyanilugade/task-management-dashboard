import {
 Component,
 OnInit,
 AfterViewInit
} from '@angular/core';

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
 selector:'app-dashboard',
 standalone:true,

 imports:[
  CommonModule,
  FormsModule
 ],

 templateUrl:'./dashboard.component.html',
 styleUrl:'./dashboard.component.css'
})

export class DashboardComponent
implements OnInit,AfterViewInit{

 currentUser:any;

 taskName:string='';

 tasks:any[]=[];

 myChart:any;

 barChart:any;

 lineChart:any;

 searchText:string='';

 editMode:boolean=false;

 editTaskId:number=0;

 filterType:string='all';

 /* 🤖 NEW AI CHATBOT */

 chatInput:string='';

 messages:any[]=[

  {
   sender:'bot',
   text:'Hello 👋 I am your AI Assistant'
  }

 ];

 /* 🧠 TASK SUGGESTIONS */

 suggestedTasks:string[]=[];

 taskSuggestions:string[]=[

  "Complete Angular project",
  "Fix bugs in dashboard",
  "Write API integration",
  "Update resume",
  "Practice coding",
  "Review pull requests",
  "Prepare for interview"

 ];

 /* 🌙 DARK MODE */

 darkMode:boolean=false;

 constructor(

  private authService:AuthService,
  private router:Router

 ){}

 /* 🚀 INIT */

 ngOnInit(){

   const userData=
   localStorage.getItem(
    'loggedInUser'
   );

   if(userData){

     this.currentUser=
     JSON.parse(userData);

   }

   this.loadTasks();

   const theme=
   localStorage.getItem(
    'darkMode'
   );

   this.darkMode=
   theme==='true';

 }

 /* 📊 CHARTS */

 ngAfterViewInit(){

   setTimeout(()=>{

     this.createChart();

     this.createBarChart();

     this.createLineChart();

   },100);

 }

 /* 🌙 DARK MODE */

 toggleDarkMode(){

   this.darkMode=
   !this.darkMode;

   localStorage.setItem(

    'darkMode',

    this.darkMode.toString()

   );

 }

 /* 🤖 REALTIME AI CHATBOT */

 sendMessage(){

   if(!this.chatInput.trim()){

     return;

   }

   /* USER MESSAGE */

   this.messages.push({

     sender:'user',

     text:this.chatInput

   });

   const userMessage=
   this.chatInput.toLowerCase();

   this.chatInput='';

   /* BOT REPLY */

   setTimeout(()=>{

     let botReply='';

     if(userMessage.includes('hello')){

       botReply='Hello 👋';

     }

     else if(
      userMessage.includes('task')
     ){

       botReply=

       'You currently have '

       +

       this.tasks.length

       +

       ' tasks';

     }

     else if(
      userMessage.includes('completed')
     ){

       botReply=

       'Completed tasks: '

       +

       this.getCompletedCount();

     }

     else if(
      userMessage.includes('pending')
     ){

       botReply=

       'Pending tasks: '

       +

       this.getPendingCount();

     }

     else if(
      userMessage.includes('productivity')
     ){

       botReply=

       'Your productivity is '

       +

       this.getProductivityScore()

       +

       '% 🚀';

     }

     else if(
      userMessage.includes('motivate')
     ){

       botReply=

       'You are doing amazing 💪';

     }

     else if(
      userMessage.includes('help')
     ){

       botReply=

       'You can add, edit, delete and manage tasks easily';

     }

     else{

       botReply=

       'I am your AI dashboard assistant 🤖';

     }

     this.messages.push({

       sender:'bot',

       text:botReply

     });

   },500);

 }

 /* 📈 PIE CHART */

 createChart(){

   this.myChart=new Chart(

    'taskChart',

    {

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

    }

   );

 }

 /* 📊 BAR CHART */

 createBarChart(){

   this.barChart=new Chart(

    'barChart',

    {

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

    }

   );

 }

 /* 📉 LINE CHART */

 createLineChart(){

   this.lineChart=new Chart(

    'lineChart',

    {

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

          label:'Productivity',

          data:[

           20,
           40,
           60,
           80,
           100

          ]

        }]

      }

    }

   );

 }

 /* 💡 SUGGESTIONS */

 getSuggestions(){

   if(!this.taskName){

     this.suggestedTasks=[];

     return;

   }

   this.suggestedTasks=

   this.taskSuggestions.filter(

    task=>

    task.toLowerCase().includes(

     this.taskName.toLowerCase()

    )

   );

 }

 /* ➕ ADD TASK */

 addTask(){

   if(this.taskName.trim()){

     const newTask={

       id:Date.now(),

       title:this.taskName,

       completed:false,

       createdAt:new Date(),

       completedAt:null

     };

     this.tasks.push(newTask);

     this.taskName='';

     this.saveTasks();

     this.updateChart();

   }

 }

 /* ✏️ EDIT TASK */

 editTask(task:any){

   this.editMode=true;

   this.editTaskId=task.id;

   this.taskName=task.title;

 }

 /* 🔄 UPDATE TASK */

 updateTask(){

   const task=

   this.tasks.find(

    t=>t.id===this.editTaskId
   );

   if(task){

     task.title=this.taskName;

     this.saveTasks();

     this.taskName='';

     this.editMode=false;

     this.updateChart();

   }

 }

 /* ❌ DELETE */

 deleteTask(id:number){

   this.tasks=

   this.tasks.filter(

    task=>task.id!==id
   );

   this.saveTasks();

   this.updateChart();

 }

 /* ✅ COMPLETE */

 toggleTask(task:any){

   task.completed=!task.completed;

   if(task.completed){

     task.completedAt=
     new Date();

   }

   this.saveTasks();

   this.updateChart();

 }

 /* 💾 SAVE */

 saveTasks(){

   localStorage.setItem(

    `tasks_${this.currentUser.email}`,

    JSON.stringify(this.tasks)

   );

 }

 /* 📂 LOAD */

 loadTasks(){

   const data=

   localStorage.getItem(

    `tasks_${this.currentUser.email}`

   );

   if(data){

     this.tasks=JSON.parse(data);

   }

 }

 /* 📊 COUNTS */

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

 getTotalTasks(){

   return this.tasks.length;

 }

 /* 🔍 FILTER */

 getFilteredTasks(){

   let filtered=this.tasks;

   if(this.searchText){

     filtered=

     filtered.filter(

      task=>

      task.title.toLowerCase().includes(

       this.searchText.toLowerCase()

      )

     );

   }

   if(this.filterType==='completed'){

     filtered=

     filtered.filter(
      t=>t.completed
     );

   }

   if(this.filterType==='pending'){

     filtered=

     filtered.filter(
      t=>!t.completed
     );

   }

   return filtered;

 }

 /* 🔄 UPDATE CHART */

 updateChart(){

   if(this.myChart){

     this.myChart.data.datasets[0].data=[

      this.getCompletedCount(),

      this.getPendingCount()

     ];

     this.myChart.update();

   }

 }

 /* 🔥 PRODUCTIVITY */

 getProductivityScore():number{

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

 /* 🧠 INSIGHT */

 getAverageCompletionTime():string{

   const completedTasks=

   this.tasks.filter(

    t=>t.completed
    &&
    t.completedAt

   );

   if(completedTasks.length===0){

     return 'Not enough data';

   }

   let totalDays=0;

   completedTasks.forEach(task=>{

     const created=

     new Date(
      task.createdAt
     ).getTime();

     const completed=

     new Date(
      task.completedAt
     ).getTime();

     const diffDays=

     (completed-created)

     /

     (1000*60*60*24);

     totalDays+=diffDays;

   });

   const avg=

   totalDays/completedTasks.length;

   return avg<1

   ?

   'You complete tasks within a day 🚀'

   :

   `Average completion ${avg.toFixed(1)} days`;

 }

 /* 🚪 LOGOUT */

 logout(){

   this.authService.logout();

   this.router.navigate(['/']);

 }

}