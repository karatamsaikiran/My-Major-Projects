// Task management system
      let tasks = [];
      let taskId = 0;

      // DOM elements
      const taskInput = document.getElementById("taskInput");
      const taskList = document.getElementById("taskList");
      const totalTasksEl = document.getElementById("totalTasks");
      const completedTasksEl = document.getElementById("completedTasks");
      const pendingTasksEl = document.getElementById("pendingTasks");
      const productivityEl = document.getElementById("productivity");
      const progressBar = document.getElementById("progressBar");
      const modal = document.getElementById("modal");

      // Add task function
      function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") {
          alert("Please enter a task!");
          return;
        }

        const task = {
          id: taskId++,
          text: taskText,
          completed: false,
          createdAt: new Date(),
        };

        tasks.push(task);
        taskInput.value = "";
        renderTasks();
        updateStats();
      }

      // Render tasks
      function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task) => {
          const taskItem = document.createElement("div");
          taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
          taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${
                      task.completed ? "checked" : ""
                    } 
                           onchange="toggleTask(${task.id})">
                    <span>${task.text}</span>
                    <button style="margin-left: auto; background: var(--error); color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;" 
                            onclick="deleteTask(${task.id})">Delete</button>
                `;
          taskList.appendChild(taskItem);
        });
      }

      // Toggle task completion
      function toggleTask(id) {
        const task = tasks.find((t) => t.id === id);
        if (task) {
          task.completed = !task.completed;
          renderTasks();
          updateStats();
        }
      }

      // Delete task
      function deleteTask(id) {
        tasks = tasks.filter((t) => t.id !== id);
        renderTasks();
        updateStats();
      }

      // Update statistics
      function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter((t) => t.completed).length;
        const pending = total - completed;
        const productivity =
          total > 0 ? Math.round((completed / total) * 100) : 0;

        totalTasksEl.textContent = total;
        completedTasksEl.textContent = completed;
        pendingTasksEl.textContent = pending;
        productivityEl.textContent = productivity + "%";
        progressBar.style.width = productivity + "%";
      }

      // Modal functions
      function openModal() {
        modal.style.display = "block";
      }

      function closeModal() {
        modal.style.display = "none";
      }

      // Generate comprehensive report
      function generateReport() {
        const completedTasks = tasks.filter((t) => t.completed);
        const pendingTasks = tasks.filter((t) => !t.completed);
        const productivity =
          tasks.length > 0
            ? Math.round((completedTasks.length / tasks.length) * 100)
            : 0;

        // Calculate additional metrics
        const averageTasksPerDay = calculateAverageTasksPerDay();
        const taskCompletionTrend = getTaskCompletionTrend();
        const recentActivity = getRecentActivity();

        const reportData = {
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          pendingTasks: pendingTasks.length,
          productivity: productivity,
          averageTasksPerDay: averageTasksPerDay,
          taskCompletionTrend: taskCompletionTrend,
          recentActivity: recentActivity,
          completedTasksList: completedTasks,
          pendingTasksList: pendingTasks,
          generatedAt: new Date().toLocaleString(),
        };

        showReportModal(reportData);
      }

      // Helper functions for report generation
      function calculateAverageTasksPerDay() {
        if (tasks.length === 0) return 0;

        const dates = tasks.map((task) => {
          const date = new Date(task.createdAt);
          return date.toDateString();
        });

        const uniqueDates = [...new Set(dates)];
        return Math.round((tasks.length / uniqueDates.length) * 10) / 10;
      }

      function getTaskCompletionTrend() {
        const completed = tasks.filter((t) => t.completed).length;
        const total = tasks.length;

        if (total === 0) return "No data available";

        const percentage = (completed / total) * 100;

        if (percentage >= 80) return "Excellent";
        if (percentage >= 60) return "Good";
        if (percentage >= 40) return "Average";
        if (percentage >= 20) return "Needs Improvement";
        return "Poor";
      }

      function getRecentActivity() {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const recentTasks = tasks.filter(
          (task) => new Date(task.createdAt) >= last24Hours
        );
        const recentCompleted = recentTasks.filter((task) => task.completed);

        return {
          tasksAdded: recentTasks.length,
          tasksCompleted: recentCompleted.length,
        };
      }

      function showReportModal(reportData) {
        // Create report modal
        const reportModal = document.createElement("div");
        reportModal.className = "modal";
        reportModal.id = "reportModal";
        reportModal.innerHTML = `
                <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                    <button class="close-modal" onclick="closeReportModal()">&times;</button>
                    <div class="report-header">
                        <h2 style="color: var(--primary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 10px;">
                            📊 Comprehensive Productivity Report
                        </h2>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                            Generated on ${reportData.generatedAt}
                        </p>
                    </div>

                    <div class="report-content">
                        <!-- Executive Summary -->
                        <div class="report-section">
                            <h3 style="color: var(--secondary); margin-bottom: 1rem; border-bottom: 2px solid var(--secondary); padding-bottom: 0.5rem;">
                                📈 Executive Summary
                            </h3>
                            <div class="report-summary-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                                <div class="summary-card" style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; text-align: center;">
                                    <div style="font-size: 2rem; color: var(--primary); font-weight: bold;">${
                                      reportData.totalTasks
                                    }</div>
                                    <div style="color: var(--text-secondary);">Total Tasks</div>
                                </div>
                                <div class="summary-card" style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; text-align: center;">
                                    <div style="font-size: 2rem; color: var(--success); font-weight: bold;">${
                                      reportData.completedTasks
                                    }</div>
                                    <div style="color: var(--text-secondary);">Completed</div>
                                </div>
                                <div class="summary-card" style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; text-align: center;">
                                    <div style="font-size: 2rem; color: var(--warning); font-weight: bold;">${
                                      reportData.pendingTasks
                                    }</div>
                                    <div style="color: var(--text-secondary);">Pending</div>
                                </div>
                                <div class="summary-card" style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; text-align: center;">
                                    <div style="font-size: 2rem; color: var(--accent); font-weight: bold;">${
                                      reportData.productivity
                                    }%</div>
                                    <div style="color: var(--text-secondary);">Productivity</div>
                                </div>
                            </div>
                        </div>

                        <!-- Performance Metrics -->
                        <div class="report-section">
                            <h3 style="color: var(--secondary); margin-bottom: 1rem; border-bottom: 2px solid var(--secondary); padding-bottom: 0.5rem;">
                                📊 Performance Metrics
                            </h3>
                            <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                                    <div>
                                        <strong style="color: var(--text-primary);">Average Tasks Per Day:</strong>
                                        <div style="color: var(--primary); font-size: 1.2rem; margin-top: 0.5rem;">
                                            ${
                                              reportData.averageTasksPerDay
                                            } tasks/day
                                        </div>
                                    </div>
                                    <div>
                                        <strong style="color: var(--text-primary);">Completion Trend:</strong>
                                        <div style="color: var(--secondary); font-size: 1.2rem; margin-top: 0.5rem;">
                                            ${reportData.taskCompletionTrend}
                                        </div>
                                    </div>
                                    <div>
                                        <strong style="color: var(--text-primary);">Recent Activity (24h):</strong>
                                        <div style="color: var(--accent); font-size: 1.2rem; margin-top: 0.5rem;">
                                            ${
                                              reportData.recentActivity
                                                .tasksAdded
                                            } added, ${
          reportData.recentActivity.tasksCompleted
        } completed
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Task Breakdown -->
                        <div class="report-section">
                            <h3 style="color: var(--secondary); margin-bottom: 1rem; border-bottom: 2px solid var(--secondary); padding-bottom: 0.5rem;">
                                ✅ Task Breakdown
                            </h3>
                            
                            <!-- Completed Tasks -->
                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="color: var(--success); margin-bottom: 0.5rem;">
                                    ✅ Completed Tasks (${
                                      reportData.completedTasks
                                    })
                                </h4>
                                <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; max-height: 200px; overflow-y: auto;">
                                    ${
                                      reportData.completedTasksList.length > 0
                                        ? reportData.completedTasksList
                                            .map(
                                              (task) => `
                                            <div style="padding: 0.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                                                <span style="color: var(--text-primary);"> ${
                                                  task.text
                                                }</span>
                                                <span style="color: var(--text-secondary); font-size: 0.8rem;">${new Date(
                                                  task.createdAt
                                                ).toLocaleDateString()}</span>
                                            </div>
                                        `
                                            )
                                            .join("")
                                        : '<div style="color: var(--text-secondary); text-align: center; padding: 1rem;">No completed tasks yet</div>'
                                    }
                                </div>
                            </div>

                            <!-- Pending Tasks -->
                            <div>
                                <h4 style="color: var(--warning); margin-bottom: 0.5rem;">
                                    ⏳ Pending Tasks (${
                                      reportData.pendingTasks
                                    })
                                </h4>
                                <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; max-height: 200px; overflow-y: auto;">
                                    ${
                                      reportData.pendingTasksList.length > 0
                                        ? reportData.pendingTasksList
                                            .map(
                                              (task) => `
                                            <div style="padding: 0.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                                                <span style="color: var(--text-primary);">○ ${
                                                  task.text
                                                }</span>
                                                <span style="color: var(--text-secondary); font-size: 0.8rem;">${new Date(
                                                  task.createdAt
                                                ).toLocaleDateString()}</span>
                                            </div>
                                        `
                                            )
                                            .join("")
                                        : '<div style="color: var(--text-secondary); text-align: center; padding: 1rem;">No pending tasks</div>'
                                    }
                                </div>
                            </div>
                        </div>

                        <!-- Recommendations -->
                        <div class="report-section">
                            <h3 style="color: var(--secondary); margin-bottom: 1rem; border-bottom: 2px solid var(--secondary); padding-bottom: 0.5rem;">
                                💡 Recommendations
                            </h3>
                            <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: 8px;">
                                ${getRecommendations(reportData)}
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                            <button class="btn btn-primary" onclick="exportReport()">
                                📄 Export Report
                            </button>
                            <button class="btn btn-secondary" onclick="printReport()">
                                🖨️ Print Report
                            </button>
                            <button class="btn btn-secondary" onclick="closeReportModal()">
                                ✖️ Close Report
                            </button>
                        </div>
                    </div>
                </div>
            `;

        document.body.appendChild(reportModal);
        reportModal.style.display = "block";
      }

      function getRecommendations(reportData) {
        let recommendations = [];

        if (reportData.productivity >= 80) {
          recommendations.push(
            "🎉 Excellent work! You're maintaining high productivity levels."
          );
          recommendations.push(
            "💪 Consider taking on more challenging tasks to keep growing."
          );
        } else if (reportData.productivity >= 60) {
          recommendations.push("👍 Good progress! You're on the right track.");
          recommendations.push(
            "🎯 Focus on completing a few more tasks to boost your productivity."
          );
        } else if (reportData.productivity >= 40) {
          recommendations.push(
            "📈 There's room for improvement in task completion."
          );
          recommendations.push(
            "🕒 Consider breaking large tasks into smaller, manageable pieces."
          );
        } else {
          recommendations.push(
            "🚀 Let's work on improving your task completion rate."
          );
          recommendations.push(
            "📋 Start with the easiest pending tasks to build momentum."
          );
        }

        if (reportData.pendingTasks > reportData.completedTasks) {
          recommendations.push(
            "⚡ You have more pending tasks than completed ones - consider prioritizing."
          );
        }

        if (
          reportData.recentActivity.tasksAdded >
          reportData.recentActivity.tasksCompleted
        ) {
          recommendations.push(
            "🎯 Focus on completing existing tasks before adding new ones."
          );
        }

        return recommendations
          .map(
            (rec) =>
              `<div style="margin-bottom: 0.5rem; color: var(--text-primary);">${rec}</div>`
          )
          .join("");
      }

      function closeReportModal() {
        const reportModal = document.getElementById("reportModal");
        if (reportModal) {
          reportModal.remove();
        }
      }

      function exportReport() {
        const reportData = {
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t) => t.completed).length,
          pendingTasks: tasks.filter((t) => !t.completed).length,
          productivity:
            tasks.length > 0
              ? Math.round(
                  (tasks.filter((t) => t.completed).length / tasks.length) * 100
                )
              : 0,
          generatedAt: new Date().toLocaleString(),
          tasks: tasks,
        };

        const reportText = `
TASKFLOW PRODUCTIVITY REPORT
Generated: ${reportData.generatedAt}

SUMMARY:
- Total Tasks: ${reportData.totalTasks}
- Completed Tasks: ${reportData.completedTasks}
- Pending Tasks: ${reportData.pendingTasks}
- Productivity: ${reportData.productivity}%

COMPLETED TASKS:
${tasks
  .filter((t) => t.completed)
  .map(
    (task) =>
      `✓ ${task.text} (${new Date(task.createdAt).toLocaleDateString()})`
  )
  .join("\n")}

PENDING TASKS:
${tasks
  .filter((t) => !t.completed)
  .map(
    (task) =>
      `○ ${task.text} (${new Date(task.createdAt).toLocaleDateString()})`
  )
  .join("\n")}
`;

        const blob = new Blob([reportText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `TaskFlow_Report_${
          new Date().toISOString().split("T")[0]
        }.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      function printReport() {
        window.print();
      }

      // Event listeners
      taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          addTask();
        }
      });

      // Close modal when clicking outside
      modal.addEventListener("click", function (e) {
        if (e.target === modal) {
          closeModal();
        }
      });

      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });

      // Initialize with sample data
      function initializeSampleData() {
        const sampleTasks = [
          "Complete project documentation",
          "Review code changes",
          "Update team on progress",
          "Prepare presentation slides",
        ];

        sampleTasks.forEach((taskText) => {
          const task = {
            id: taskId++,
            text: taskText,
            completed: Math.random() > 0.5,
            createdAt: new Date(),
          };
          tasks.push(task);
        });

        renderTasks();
        updateStats();
      }

      // Initialize the app
      document.addEventListener("DOMContentLoaded", function () {
        initializeSampleData();

        // Add welcome animation delay
        setTimeout(() => {
          if (!localStorage.getItem("visited")) {
            openModal();
            // Note: localStorage not used in production, just showing the logic
          }
        }, 1000);
      });

      // Add some dynamic interactions
      setInterval(() => {
        const circles = document.querySelectorAll(".bg-circle");
        circles.forEach((circle) => {
          const randomX = Math.random() * 20 - 10;
          const randomY = Math.random() * 20 - 10;
          circle.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });
      }, 5000);