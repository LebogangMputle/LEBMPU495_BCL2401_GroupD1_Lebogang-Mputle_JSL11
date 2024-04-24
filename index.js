// TASK: import helper functions from utils
// TASK: import initialData
import { 
  getTasks, 
  createNewTask, 
  patchTask, 
  putTask, 
  deleteTask} 
  from "./utils/taskFunctions.js";
import { initialData } from './initialData.js';

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
  } else {
    console.log('Data already exists in localStorage');
  }
}

// TASK: Get elements from the DOM
const elements = {
  // Navigation Sidebar elements
  sideBar: document.querySelector(".side-bar"),
  boardsNavLinksDiv: document.getElementById("boards-nav-links-div"),
  themeSwitch: document.getElementById("switch"),
  hideSideBarBtn: document.getElementById("hide-side-bar-btn"),
  showSideBarBtn: document.getElementById("show-side-bar-btn"),
  sideLogoDiv: document.getElementById("side-logo-div"),

  // Header
  headerBoardName: document.getElementById("header-board-name"),
  addNewTaskBtn: document.getElementById("add-new-task-btn"),
  editBoardBtn: document.getElementById("edit-board-btn"),
  editBtns: document.getElementById("deleteBoardBtn"),
  dropDown: document.getElementById("dropdownBtn"),

  // New Task Modal
  titleInput: document.getElementById("title-input"),
  teatArea: document.getElementById("desc-input"),
  selectStatus: document.getElementById("select-status"),
  createNewTaskBtn: document.getElementById("add-new-task-btn"),
  cancelAddTaskBtn: document.getElementById("cancel-add-task-btn"),
  modalWindow: document.getElementById("new-task-modal-window"),
  inputDiv : document.getElementById("modal-select-status"),

  //Task column
  columnDiv : document.querySelectorAll(".column-div"),
  tasksContainer : document.querySelectorAll(".tasks-container"),

  // Edit Task Modal
  editTaskModal: document.querySelector(".edit-task-modal-window"),
  editTaskTitleInput: document.getElementById("edit-task-title-input"),
  editTaskDescInput: document.getElementById("edit-task-desc-input"),
  editSelectStatus: document.getElementById("edit-select-status"),
  saveTaskChangesBtn: document.getElementById("save-task-changes-btn"),
  cancelEditBtn: document.getElementById("cancel-edit-btn"),
  deleteTaskBtn: document.getElementById("delete-task-btn"),
  
  // Filter
  filterDiv: document.getElementById("filterDiv"),
};

let activeBoard = ""

/*const sideBarDiv = elements.sideBarDiv;
const logo = elements.logo;
const boardsNavLinksDiv = elements.boardsNavLinksDiv;
const headlineSidepanel = elements.headlineSidepanel;
const hideSideBarBtn = elements.hideSideBarBtn;
const showSideBarBtn = elements.showSideBarBtn;
const themeSwitch = elements.themeSwitch;
const createNewTaskBtn = elements.createNewTaskBtn;
const newTaskModalWindow = elements.newTaskModalWindow;
const filterDiv = elements.filterDiv;
const editTaskModalWindow = elements.editTaskModalWindow;
const editTaskModalSideBarDiv = elements.editTaskModalSideBarDiv;
const editTaskModalSideLogoDiv = elements.editTaskModalSideLogoDiv;
const editTaskModalHeadlineSidepanel = elements.editTaskModalHeadlineSidepanel;
const editTaskModalSideBarBottom = elements.editTaskModalSideBarBottom;
const editTaskModalToggleDiv = elements.editTaskModalToggleDiv;
const editTaskModalIconDark = elements.editTaskModalIconDark;
const editTaskModalIconLight = elements.editTaskModalIconLight;
const editTaskModalSwitch = elements.editTaskModalSwitch;
const editTaskModalLabelCheckboxTheme = elements.editTaskModalLabelCheckboxTheme;
const editTaskModalEditBoardDiv = elements.editTaskModalEditBoardDiv;
const editTaskModalDeleteBoardBtn = elements.editTaskModalDeleteBoardBtn;
const editTaskModalBoardBtn = elements.editTaskModalBoardBtn;
const editTaskModalButton = elements.editTaskModalButton;
const editTaskModalNewTaskModalWindow = elements.editTaskModalNewTaskModalWindow;
*/

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard")) || boards[0];
    activeBoard = localStorageBoard ? localStorageBoard : boards[0];
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  // Access the container element for the boards
  const boardsContainer = document.getElementById('boards-nav-links-div');
  // Clear the existing content in the boards container to avoid duplicates
  boardsContainer.innerHTML = '';

  // Iterate through each board name provided in the boards array
  boards.forEach(board => {
    // Create a new button element for each board
    const boardElement = document.createElement("button");
    // Set the button text to the board name
    boardElement.textContent = board; 

    boardElement.classList.add("board-btn");

    boardElement.addEventListener("click", () => { 
      elements.headerBoardName.textContent = board;  
      // Filter and display tasks associated with the clicked board
      filterAndDisplayTasksByBoard(board);
      // Update the active board variable
      activeBoard = board;
      // Save the new active board to local storage
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      // Apply styling specific to the active board
      styleActiveBoard(activeBoard);
    });
    
    // Append the newly created button to the boards container
    boardsContainer.appendChild(boardElement);
  });
}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board = boardName);

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status = status).forEach(task => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener("click",() => { 
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
}

function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').forEach(btn => { 
    if (btn.textContent === boardName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function addTaskToUI(task) {
  const column = document.querySelector(`.column-div[data-status="${task.status}"]`); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  //responsible for dynamically adding tasks to a web page
  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  tasksContainer.appendChild();
}

function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', () => toggleModal(false, elements.editTaskModal));

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
    elements.modalWindow.reset();
  }); //added the reset function to clear the form after cancel.

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener('click', () => toggleSidebar(false));
  elements.showSideBarBtn.addEventListener('click', () => toggleSidebar(true));

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit', (event) => {
    addTask(event);
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none'; 
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 
  // Extract user input and create a new task object
  const task = {
    // Extract task details from event or form inputs
  };
  const newTask = createNewTask(task); // Create a new task
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
    event.target.reset(); // Reset the form
    refreshTasksUI(); // Refresh tasks UI
  }
}

function toggleSidebar(show) {
  // Toggle sidebar visibility based on show parameter
}

function toggleTheme() {
  // Toggle theme based on theme switch
}

function openEditTaskModal(task) {
  // Set task details in modal inputs
  
  // Get button elements from the task modal
  
  // Call saveTaskChanges upon click of Save Changes button
  
  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get updated task details from modal inputs
  
  // Update the task using helper functions
  
  // Close the modal and refresh the UI to reflect changes
  
  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}
