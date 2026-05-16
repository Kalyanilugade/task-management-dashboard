import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  currentUser: any;
  taskName: string = '';
  tasks: any[] = [];
  myChart: any;

  searchText: string = '';
  editMode: boolean = false;
  editTaskId: number = 0;
  filterType: string = 'all';
 chatMessages: { role: string; text: string }[] = [];

 barChart:any;

lineChart:any;

chatInput: string = '';
  // 🧠 Smart feature
  suggestedTasks: string[] = [];

  taskSuggestions: string[] = [
    "Complete Angular project",
    "Fix bugs in dashboard",
    "Write API integration",
    "Update resume",
    "Practice coding",
    "Review pull requests",
    "Prepare for interview"
  ];
  //dark mode
  darkMode:boolean=false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(){

 const userData=
 localStorage.getItem('loggedInUser');

 if(userData){

   this.currentUser=
   JSON.parse(userData);

 }
 

 this.loadTasks();

 const theme=
 localStorage.getItem('darkMode');

 this.darkMode=
 theme==='true';

}
toggleDarkMode(){

 this.darkMode=!this.darkMode;

 localStorage.setItem(
  'darkMode',
  this.darkMode.toString()
 );

}
sendMessage() {
  if (!this.chatInput.trim()) return;

  // user message
  this.chatMessages.push({
    role: 'user',
    text: this.chatInput
  });

  const userText = this.chatInput.toLowerCase();
  this.chatInput = '';

  // AI response (smart rule-based)
  let response = "I'm here to help you with your tasks 😊";

  if (userText.includes("productivity")) {
    response = `Your productivity is ${this.getProductivityScore()}% 🚀`;
  }
  else if (userText.includes("task")) {
    response = "Try breaking tasks into small steps for better results 👍";
  }
  else if (userText.includes("complete")) {
    response = "Focus on high priority tasks first 🔥";
  }
  else if (userText.includes("help")) {
    response = "You can add, edit, delete, and track tasks easily in this dashboard.";
  }
  else if (userText.includes("motivate")) {
    response = "You're doing great! Keep going 💪 Consistency is the key.";
  }

  // bot message
  setTimeout(() => {
    this.chatMessages.push({
      role: 'bot',
      text: response
    });
  }, 400);
}
 ngAfterViewInit(){

 setTimeout(()=>{

   this.createChart();

   this.createBarChart();

   this.createLineChart();

 },100);

}
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
  // 🧠 Suggestions
  getSuggestions() {
    if (!this.taskName) {
      this.suggestedTasks = [];
      return;
    }

    this.suggestedTasks = this.taskSuggestions.filter(task =>
      task.toLowerCase().includes(this.taskName.toLowerCase())
    );
  }

  addTask() {
    if (this.taskName.trim()) {

      const newTask = {
        id: Date.now(),
        title: this.taskName,
        completed: false,
        createdAt: new Date(),
        completedAt: null
      };

      this.tasks.push(newTask);
      this.taskName = '';

      this.saveTasks();
      this.updateChart();
    }
  }

  editTask(task: any) {
    this.editMode = true;
    this.editTaskId = task.id;
    this.taskName = task.title;
  }

  updateTask() {
    const task = this.tasks.find(t => t.id === this.editTaskId);

    if (task) {
      task.title = this.taskName;

      this.saveTasks();
      this.taskName = '';
      this.editMode = false;
      this.updateChart();
    }
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
    this.updateChart();
  }

  toggleTask(task: any) {
    task.completed = !task.completed;

    if (task.completed) {
      task.completedAt = new Date();
    }

    this.saveTasks();
    this.updateChart();
  }

  saveTasks() {
    localStorage.setItem(
      `tasks_${this.currentUser.email}`,
      JSON.stringify(this.tasks)
    );
  }

  loadTasks() {
    const data = localStorage.getItem(`tasks_${this.currentUser.email}`);

    if (data) {
      this.tasks = JSON.parse(data);
    }
  }

  getCompletedCount() {
    return this.tasks.filter(task => task.completed).length;
  }

  getPendingCount() {
    return this.tasks.filter(task => !task.completed).length;
  }

  getTotalTasks() {
    return this.tasks.length;
  }

  getFilteredTasks() {
    let filtered = this.tasks;

    if (this.searchText) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.filterType === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    if (this.filterType === 'pending') {
      filtered = filtered.filter(t => !t.completed);
    }

    return filtered;
  }

  // 📊 Chart
  createChart() {
    this.myChart = new Chart('taskChart', {
      type: 'pie',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [
            this.getCompletedCount(),
            this.getPendingCount()
          ]
        }]
      }
    });
  }

  updateChart() {
    if (this.myChart) {
      this.myChart.data.datasets[0].data = [
        this.getCompletedCount(),
        this.getPendingCount()
      ];
      this.myChart.update();
    }
  }

  // 🔥 Productivity Score
  getProductivityScore(): number {
    const total = this.getTotalTasks();
    const completed = this.getCompletedCount();

    if (total === 0) return 0;

    return Math.round((completed / total) * 100);
  }

  // 🧠 Insight
  getAverageCompletionTime(): string {
    const completedTasks = this.tasks.filter(t => t.completed && t.completedAt);

    if (completedTasks.length === 0) return "Not enough data";

    let totalDays = 0;

    completedTasks.forEach(task => {
      const created = new Date(task.createdAt).getTime();
      const completed = new Date(task.completedAt).getTime();

      const diffDays = (completed - created) / (1000 * 60 * 60 * 24);
      totalDays += diffDays;
    });

    const avg = totalDays / completedTasks.length;

    return avg < 1
      ? "You usually complete tasks within a day 🚀"
      : `You usually complete tasks in ${avg.toFixed(1)} days`;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}