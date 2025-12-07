const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");
const logoutContainerDOM = document.querySelector(".logout-container");
const logoutBtnDOM = document.querySelector(".logout-btn");
const paginationDOM = document.querySelector(".pagination");

// Pagination state
let currentPage = 1;
let paginationData = null;
let currentTasksCount = 0;
const defaultLimit = 4;

// Load tasks from /api/tasks with pagination
const showTasks = async (page = 1, limit = defaultLimit) => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { tasks, pagination: paginationInfo },
    } = await axios.get("/api/v1/tasks", {
      params: { page, limit },
    });
    
    currentPage = page;
    paginationData = paginationInfo;
    currentTasksCount = tasks.length;

    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden";
      // Show logout button even when no tasks (user is still logged in)
      logoutContainerDOM.style.display = "flex";
      // Hide pagination if no tasks
      if (paginationDOM) {
        paginationDOM.style.display = "none";
      }
      return;
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name } = task;
        return `<div class="single-task ${completed && "task-completed"}">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">



<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`;
      })
      .join("");
    tasksDOM.innerHTML = allTasks;
    // Show logout button when tasks load successfully (user is logged in)
    logoutContainerDOM.style.display = "flex";
    
    // Render pagination controls
    renderPagination();
  } catch (error) {
    // Check if error is due to authentication
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Hide logout button and redirect to login page if not authenticated
      logoutContainerDOM.style.display = "none";
      window.location.href = "login.html";
      return;
    }
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
    // Hide logout button on error
    logoutContainerDOM.style.display = "none";
    // Hide pagination on error
    if (paginationDOM) {
      paginationDOM.style.display = "none";
    }
  }
  loadingDOM.style.visibility = "hidden";
};

// Render pagination controls
const renderPagination = () => {
  if (!paginationDOM || !paginationData) return;
  
  const { currentPage: page, totalPages, hasNextPage, hasPrevPage, totalTasks, tasksPerPage } = paginationData;
  
  // Hide pagination if only one page or no tasks
  if (totalPages <= 1) {
    paginationDOM.style.display = "none";
    return;
  }
  
  paginationDOM.style.display = "flex";
  
  // Calculate page range to display (show max 5 page numbers)
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // Build pagination HTML
  let paginationHTML = '<div class="pagination-info">';
  paginationHTML += `Showing ${(page - 1) * tasksPerPage + 1}-${Math.min(page * tasksPerPage, totalTasks)} of ${totalTasks} tasks`;
  paginationHTML += '</div>';
  
  paginationHTML += '<div class="pagination-controls">';
  
  // Previous button
  paginationHTML += `<button class="pagination-btn ${!hasPrevPage ? 'disabled' : ''}" ${!hasPrevPage ? 'disabled' : ''} data-page="${page - 1}">
    <i class="fas fa-chevron-left"></i> Previous
  </button>`;
  
  // First page button (if not in visible range)
  if (startPage > 1) {
    paginationHTML += `<button class="pagination-btn page-number" data-page="1">1</button>`;
    if (startPage > 2) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
  }
  
  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `<button class="pagination-btn page-number ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  
  // Last page button (if not in visible range)
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
    paginationHTML += `<button class="pagination-btn page-number" data-page="${totalPages}">${totalPages}</button>`;
  }
  
  // Next button
  paginationHTML += `<button class="pagination-btn ${!hasNextPage ? 'disabled' : ''}" ${!hasNextPage ? 'disabled' : ''} data-page="${page + 1}">
    Next <i class="fas fa-chevron-right"></i>
  </button>`;
  
  paginationHTML += '</div>';
  
  paginationDOM.innerHTML = paginationHTML;
  
  // Add event listeners to pagination buttons
  const paginationButtons = paginationDOM.querySelectorAll('.pagination-btn:not(.disabled)');
  paginationButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetPage = parseInt(e.currentTarget.dataset.page);
      if (targetPage && targetPage !== page) {
        showTasks(targetPage, defaultLimit);
        // Scroll to top of tasks container
        document.querySelector('.tasks-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

showTasks(currentPage, defaultLimit);

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    try {
      await axios.delete(`/api/v1/tasks/${id}`);
      // After deletion, check if current page becomes empty
      // If so, go to previous page, otherwise stay on current page
      if (currentTasksCount === 1 && currentPage > 1) {
        showTasks(currentPage - 1, defaultLimit);
      } else {
        showTasks(currentPage, defaultLimit);
      }
    } catch (error) {
      // Check if error is due to authentication
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        window.location.href = "login.html";
        return;
      }
      console.log(error);
    }
  }
  loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value;

  try {
    await axios.post("/api/v1/tasks", { name });
    // After adding a task, go to first page to show the new task
    showTasks(1, defaultLimit);
    taskInputDOM.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, task added`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    // Check if error is due to authentication
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      window.location.href = "login.html";
      return;
    }
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});

// logout functionality
logoutBtnDOM.addEventListener("click", async () => {
  try {
    await axios.get("/api/v1/auth/logout");
    // Redirect to login page after successful logout
    window.location.href = "login.html";
  } catch (error) {
    console.log(error);
    // Even if there's an error, redirect to login page
    window.location.href = "login.html";
  }
});
