
        document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.getElementById('task-input');
            const addButton = document.getElementById('add-btn');
            const prioritySelectors = document.querySelectorAll('.priority-selector');
            const categorySelectors = document.querySelectorAll('.category-selector');
            const taskList = document.getElementById('task-list');
            const statusFilters = document.querySelectorAll('.status-filter');
            const priorityFilters = document.querySelectorAll('.priority-filter');
            const categoryFilters = document.querySelectorAll('.category-filter');
            const updateTimeElement = document.getElementById('update-time');
            
            // Current filters and selected priority/category
            let currentStatusFilter = 'all';
            let currentPriorityFilter = 'all';
            let currentCategoryFilter = 'all';
            let selectedPriority = 'high'; // Default priority
            let selectedCategory = 'work'; // Default category
            
            // Set current time
            updateTime();
            
            // Add task event
            addButton.addEventListener('click', addTask);
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTask();
                }
            });
            
            // Priority selector events
            prioritySelectors.forEach(selector => {
                selector.addEventListener('click', function() {
                    prioritySelectors.forEach(s => s.classList.remove('active'));
                    this.classList.add('active');
                    selectedPriority = this.dataset.priority;
                });
            });
            
            // Category selector events
            categorySelectors.forEach(selector => {
                selector.addEventListener('click', function() {
                    categorySelectors.forEach(s => s.classList.remove('active'));
                    this.classList.add('active');
                    selectedCategory = this.dataset.category;
                });
            });
            
            // Status filter events
            statusFilters.forEach(filter => {
                filter.addEventListener('click', function() {
                    statusFilters.forEach(f => f.classList.remove('active'));
                    this.classList.add('active');
                    currentStatusFilter = this.dataset.status;
                    filterTasks();
                });
            });
            
            // Priority filter events
            priorityFilters.forEach(filter => {
                filter.addEventListener('click', function() {
                    priorityFilters.forEach(f => f.classList.remove('active'));
                    this.classList.add('active');
                    currentPriorityFilter = this.dataset.priority;
                    filterTasks();
                });
            });
            
            // Category filter events
            categoryFilters.forEach(filter => {
                filter.addEventListener('click', function() {
                    categoryFilters.forEach(f => f.classList.remove('active'));
                    this.classList.add('active');
                    currentCategoryFilter = this.dataset.category;
                    filterTasks();
                });
            });
            
            // Add event listeners to existing task buttons
            document.querySelectorAll('.status-btn').forEach(btn => {
                btn.addEventListener('click', advanceStatus);
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', deleteTask);
            });
            
            function addTask() {
                const taskText = taskInput.value.trim();
                
                if (taskText === '') {
                    alert('Please enter a task!');
                    return;
                }
                
                // Create new task item
                const taskItem = document.createElement('li');
                taskItem.className = `task-item priority-${selectedPriority}`;
                taskItem.dataset.status = 'pending';
                taskItem.dataset.priority = selectedPriority;
                taskItem.dataset.category = selectedCategory;
                
                taskItem.innerHTML = `
                    <span class="task-status status-pending">Pending</span>
                    <div class="task-content">
                        <span class="task-text">${taskText}</span>
                        <div class="task-meta">
                            <span class="task-category category-${selectedCategory}">${capitalizeFirstLetter(selectedCategory)}</span>
                            <span class="task-priority priority-${selectedPriority}">${capitalizeFirstLetter(selectedPriority)} Priority</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="status-btn"><i class="fas fa-arrow-right"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                // Remove empty state if it exists
                const emptyState = document.querySelector('.empty-state');
                if (emptyState) {
                    emptyState.remove();
                }
                
                // Add to list
                taskList.appendChild(taskItem);
                
                // Clear input
                taskInput.value = '';
                taskInput.focus();
                
                // Add event listeners to buttons
                taskItem.querySelector('.status-btn').addEventListener('click', advanceStatus);
                taskItem.querySelector('.delete-btn').addEventListener('click', deleteTask);
                
                // Update progress
                updateProgress();
                
                // Apply current filters
                filterTasks();
            }
            
            function advanceStatus(e) {
                const taskItem = e.target.closest('.task-item');
                const statusElement = taskItem.querySelector('.task-status');
                let currentStatus = taskItem.dataset.status;
                
                // Determine next status
                if (currentStatus === 'pending') {
                    statusElement.className = 'task-status status-inprogress';
                    statusElement.textContent = 'In Progress';
                    taskItem.dataset.status = 'inprogress';
                } else if (currentStatus === 'inprogress') {
                    statusElement.className = 'task-status status-completed';
                    statusElement.textContent = 'Completed';
                    taskItem.dataset.status = 'completed';
                } else {
                    statusElement.className = 'task-status status-pending';
                    statusElement.textContent = 'Pending';
                    taskItem.dataset.status = 'pending';
                }
                
                // Update progress
                updateProgress();
                
                // Apply current filters
                filterTasks();
            }
            
            function deleteTask(e) {
                const taskItem = e.target.closest('.task-item');
                taskItem.remove();
                
                // Show empty state if no tasks
                if (taskList.children.length === 0) {
                    const emptyState = document.createElement('li');
                    emptyState.className = 'empty-state';
                    emptyState.textContent = 'No tasks yet. Add a task to get started!';
                    taskList.appendChild(emptyState);
                }
                
                // Update progress
                updateProgress();
            }
            
            function filterTasks() {
                const tasks = document.querySelectorAll('.task-item');
                
                tasks.forEach(task => {
                    const statusMatch = currentStatusFilter === 'all' || task.dataset.status === currentStatusFilter;
                    const priorityMatch = currentPriorityFilter === 'all' || task.dataset.priority === currentPriorityFilter;
                    const categoryMatch = currentCategoryFilter === 'all' || task.dataset.category === currentCategoryFilter;
                    
                    if (statusMatch && priorityMatch && categoryMatch) {
                        task.style.display = 'flex';
                    } else {
                        task.style.display = 'none';
                    }
                });
            }
            
            function updateProgress() {
                const tasks = document.querySelectorAll('.task-item');
                let pendingCount = 0;
                let inProgressCount = 0;
                let completedCount = 0;
                
                tasks.forEach(task => {
                    const status = task.dataset.status;
                    
                    if (status === 'pending') {
                        pendingCount++;
                    } else if (status === 'inprogress') {
                        inProgressCount++;
                    } else if (status === 'completed') {
                        completedCount++;
                    }
                });
                
                const totalCount = tasks.length;
                const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
                
                // Update progress bar
                document.getElementById('progress-fill').style.width = `${completionPercentage}%`;
                
                // Update counts
                document.getElementById('count-pending').textContent = pendingCount;
                document.getElementById('count-inprogress').textContent = inProgressCount;
                document.getElementById('count-completed').textContent = completedCount;
                document.getElementById('count-total').textContent = totalCount;
                
                // Update time
                updateTime();
            }
            
            function updateTime() {
                const now = new Date();
                const formattedTime = now.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                });
                updateTimeElement.textContent = formattedTime;
            }
            
            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        });
   