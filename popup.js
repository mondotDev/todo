// popup.js

// Listen for when HTML has completely loaded
document.addEventListener('DOMContentLoaded', function () {
  
  // TODO: Note for future improvement
  // UUIDs can be used for unique identification of tasks.
  // A UUID library could be used to generate these IDs.
  // The codebase would need to be refactored to handle this change.

  // Reference to DOM elements
  // These will be used throughout the script to manipulate the DOM.
  let focusedTab = document.getElementById('focused-tab');
  let listTab = document.getElementById('list-tab');
  let focusedTabContent = document.getElementById('focused-tab-content');
  let listTabContent = document.getElementById('list-tab-content');
  let addTaskButton = document.getElementById('add-task');
  let newTaskInput = document.getElementById('new-task');
  let todoList = document.getElementById('todo-list');
  let topTodo = document.getElementById('top-todo');
  let completedTasks = document.getElementById('completed-tasks');
  
  // Variable for storing the element currently being dragged
  let draggedElement = null;

  // Event listeners for tab click events
  // These functions are used to switch between the two tabs
  focusedTab.addEventListener('click', function () {
    focusedTabContent.style.display = 'block';
    listTabContent.style.display = 'none';
  });

  listTab.addEventListener('click', function () {
    focusedTabContent.style.display = 'none';
    listTabContent.style.display = 'block';
  });

  // Event listener for 'Add Task' button
  // This function creates a new task when the 'Add Task' button is clicked
  addTaskButton.addEventListener('click', function () {
    let newTask = newTaskInput.value;
    if(newTask) {
      addTask(newTask);
      newTaskInput.value = '';
    }
  });

  // Functions for managing tasks
  function addTask(task) {
    // Create a new task and add it to the list
    let taskElement = createTaskElement(task);
    todoList.appendChild(taskElement);
    // Update the 'top todo' display
    updateTopTodo();
  }

  function createTaskElement(task) {
    // Create a new task element and add event listeners to it
    let taskElement = document.createElement('div');
    taskElement.textContent = task;
    taskElement.setAttribute('draggable', 'true');
    taskElement.classList.add('task');
    addTaskEventListeners(taskElement);
    return taskElement;
  }

  function addTaskEventListeners(taskElement) {
    // Add event listeners for drag-and-drop and task completion
    taskElement.addEventListener('dragstart', handleDragStart);
    taskElement.addEventListener('dragenter', handleDragEnter);
    taskElement.addEventListener('dragover', handleDragOver);
    taskElement.addEventListener('dragleave', handleDragLeave);
    taskElement.addEventListener('drop', handleDrop);
    taskElement.addEventListener('dragend', handleDragEnd);
    taskElement.addEventListener('click', function () {
      markTaskComplete(taskElement);
    });
    taskElement.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      deleteTask(taskElement);
    });
  }

  function markTaskComplete(taskElement) {
    // Move a task from the 'to-do' list to the 'completed tasks' list
    todoList.removeChild(taskElement);

    // Remove the 'task' class and add 'completed-task' class
    taskElement.classList.remove('task');
    taskElement.classList.add('completed-task');

    completedTasks.appendChild(taskElement);
    // Update the 'top todo' display
    updateTopTodo();
  }

  function deleteTask(taskElement) {
    // Remove a task from the 'to-do' list
    todoList.removeChild(taskElement);
    // Update the 'top todo' display
    updateTopTodo();
  }

  function updateTopTodo() {
    // Clear the current 'top todo' display
    while(topTodo.firstChild){
      topTodo.removeChild(topTodo.firstChild);
    }
  
    // If there are any tasks left, display the first one as the 'top todo'
    if(todoList.firstChild){
      let topTask = todoList.firstChild.cloneNode(true);
      topTask.addEventListener('click', function () {
        markTaskCompleteFromTop(topTask);
      });
      topTask.removeEventListener('contextmenu', function (e) {
        e.preventDefault();
        deleteTask(topTask);
      });
      topTodo.appendChild(topTask);
    }
  }

  function markTaskCompleteFromTop(taskElement) {
    // Find and mark the corresponding task complete from the main todo list
    let correspondingElement = Array.from(todoList.childNodes).find(el => el.textContent === taskElement.textContent);
    markTaskComplete(correspondingElement);
  }

  // Functions for handling drag-and-drop events
  function handleDragStart(e) {
    // Store the element being dragged and change its opacity
    draggedElement = this;
    this.style.opacity = '0.4';
  }

  function handleDragEnter(e) {
    // Add a border to the task being dragged over (if it is not the task being dragged)
    if (draggedElement !== this) {
      this.style.border = '2px solid #000';
    }
  }

  function handleDragOver(e) {
    // Prevent the default action to allow dropping
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  }

  function handleDragLeave(e) {
    // Remove the border from the task being dragged over
    this.style.border = '';
  }

  function handleDrop(e) {
    // If the task being dropped is not the one being dragged over, move it in the list
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    if (draggedElement !== this) {
      todoList.removeChild(draggedElement);
      let dropHTML = e.dataTransfer.getData('text/html');
      this.insertAdjacentHTML('beforebegin',dropHTML);
      this.style.border = '';
    }
    return false;
  }

  function handleDragEnd(e) {
    // Reset the opacity of the task that was being dragged
    this.style.opacity = '1';
  }
});
