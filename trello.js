// часы

let clock = document.getElementById("clock");
let time = new Date();
clock.innerHTML = time.toLocaleTimeString();
window.setInterval(function () {
  let time = new Date();
  clock.innerHTML = time.toLocaleTimeString();
}, 1000);

const getTodosFromLocalStorage = () => {
  const todos = localStorage.getItem("todos");
  if (todos) {
    return JSON.parse(todos);
  }
  return [];
};

const setTodosToLocalStorage = (todoList) => {
  localStorage.setItem("todos", JSON.stringify(todoList));
};

const todos = {
  list: getTodosFromLocalStorage(),

  create(title, description, user) {
    const todo = {
      id: Math.random(),
      title,
      description,
      user,
      completed: false,
      status: "todo",
      // date: new Date().toLocaleString(),
      date: new Date().toLocaleDateString(),
    };

    this.list.unshift(todo);
    setTodosToLocalStorage(this.list);
  },

  edit(id, title, description, user) {
    for (let todo of todos.list) {
      if (todo.id === id) {
        (todo.title = title),
          (todo.description = description),
          (todo.user = user);
      }
    }
    setTodosToLocalStorage(this.list);
  },

  setTodoStatus(id) {
    const todo = this.list.find((todo) => todo.id === id);
    todo.status = "todo";
    setTodosToLocalStorage(this.list);
  },

  setInProgressStatus(id) {
    const todo = this.list.find((todo) => todo.id === id);
    todo.status = "inprogress";
    setTodosToLocalStorage(this.list);
  },
  setDoneStatus(id) {
    const todo = this.list.find((todo) => todo.id === id);
    todo.status = "done";
    setTodosToLocalStorage(this.list);
  },

  coutByStatus(status) {
    let count = 0;
    for (let todo of todos.list) {
      if (todo.status === status) {
        count++;
      }
    }
    return count;
  },

  showCompleted() {
    this.list = this.list.filter((todo) => todo.completed === true);
  },

  deleteAll() {
    this.list = this.list.filter((todo) => todo.status !== "done");
    setTodosToLocalStorage(this.list);
  },

  deleteById(id) {
    this.list = this.list.filter((todo) => todo.id !== id);
    setTodosToLocalStorage(this.list);
  },
};

function showCover() {
  let coverDiv = document.createElement("div");
  coverDiv.id = "cover-div";

  document.body.style.overflowY = "hidden";
  document.body.append(coverDiv);
}

function hideCover() {
  document.getElementById("cover-div")?.remove();
  document.body.style.overflowY = "";
}

function showPrompt() {
  showCover();
  let form = document.getElementById("prompt-form");
  let formContainer = document.getElementById("prompt-form-container");

  function complete() {
    hideCover();
    formContainer.style.display = "none";
    document.onkeydown = null;
  }

  form.addEventListener("submit", function func(event) {
    event.preventDefault();

    let title = form.elements["title"].value;
    let description = form.elements["description"].value;
    let selectUsers = form.elements["select"].value;
    if (title === "" || description === "") {
      return false;

    }
    complete();
    todos.create(title, description, selectUsers);
    renderTodos();
    form.reset();
    form.removeEventListener("submit", func);
  });

  form.elements["cancel"].addEventListener("click", function () {
    complete();
  });

  document.onkeydown = function (e) {
    if (e.key === "Escape") {
      complete();
    }
  };

  formContainer.style.display = "block";
  form.elements['title'].focus();
  
}

const buttonAdd = document.getElementById("show-button");
buttonAdd.addEventListener("click", function () {
  showPrompt();
});

function showPromptForEdit(id) {
  showCover();
  let form = document.getElementById("prompt-form");
  let formContainer = document.getElementById("prompt-form-container");

  function complete() {
    hideCover();
    formContainer.style.display = "none";
    document.onkeydown = null;
  }

  for (let todo of todos.list) {
    if (todo.id === id) {
      console.log(todo.id);
      form.elements["title"].value = todo.title;
      form.elements["description"].value = todo.description;
      form.elements["select"].value = todo.user;
    }
  }

  form.addEventListener("submit", function func(event) {
    event.preventDefault();

    let title = form.elements["title"].value;
    let description = form.elements["description"].value;
    let selectUsers = form.elements["select"].value;
    if (title === "" || description === "") {
      return false;
      // игнорируем отправку пустой формы
    }
    complete();
    todos.edit(id, title, description, selectUsers);
    renderTodos();
    form.reset();
    form.removeEventListener("submit", func);
  });

  form.elements["cancel"].addEventListener("click", function () {
    complete();
  });

  document.onkeydown = function (e) {
    if (e.key === "Escape") {
      complete();
    }
  };

  formContainer.style.display = "block";
  // form.elements.focus();
}

const renderTodo = (todo) => {
  return `
<li class="todo-item ${todo.completed ? "completed" : ""}" data-todo-status = ${
    todo.status
  }>
<div class="infoTodo">
<p class="title">${todo.title}</p>
<p class="description">${todo.description}</p>
<p class="selectUser">${todo.user}</p>
</div>
<div class="btnsTodo">
<button class="edit" data-todo-id = ${todo.id}>Edit</button>
<button class="delete" data-todo-id = ${todo.id}>Delete</button>
<button class="relocate" data-todo-id = ${todo.id}>></button>
<p class="date">${todo.date}</p>
</div>
</li>`;
};

const renderTodoInProgress = (todo) => {
  return `
<li class="todo-item ${todo.completed ? "completed" : ""}" data-todo-status = ${
    todo.status
  }>
<div class="infoTodo">
<p class="title">${todo.title}</p>
<p class="description">${todo.description}</p>
<p class="selectUser">${todo.user}</p>
</div>
<div class="btnsTodo">
<button class="back" data-todo-id = ${todo.id}>Back</button>
<button class="complete" data-todo-id = ${todo.id}>Complete</button>
<p class="date">${todo.date}</p>
</div>
</li>`;
};

const renderTodoIDone = (todo) => {
  return `
<li class="todo-item ${todo.completed ? "completed" : ""}" data-todo-status = ${
    todo.status
  }>
<div class="infoTodo">
<p class="title">${todo.title}</p>
<p class="description">${todo.description}</p>
<p class="selectUser">${todo.user}</p>
</div>
<div class="btnsTodo">
<button class="delete" data-todo-id = ${todo.id}>Delete</button>
<p class="date">${todo.date}</p>
</div>
</li>`;
};

let todoWrapper = document.querySelector(".todoWrapper");
let progressWrapper = document.querySelector(".progressWrapper");
let doneWrapper = document.querySelector(".doneWrapper");
const renderTodos = () => {
  let counterTodo = document.querySelector(".counter-todo");
  let counterInProgress = document.querySelector(".counter-progress");
  let counterDone = document.querySelector(".counter-done");

  document.body.onclick = (event) => {
    const todoId = event.target.getAttribute("data-todo-id");
    if (!todoId) return;

    if (event.target.classList.contains("delete")) {
      todos.deleteById(+todoId);
      renderTodos();
      setTodosToLocalStorage(todos.list);
    }

    if (event.target.classList.contains("edit")) {
      console.log(todoId);
      showPromptForEdit(+todoId);
      setTodosToLocalStorage(todos.list);
    }

    if (event.target.classList.contains("relocate")) {
      if (todos.coutByStatus("inprogress") >= 6) {
        alert("Warning");
        return;
      }
      todos.setInProgressStatus(+todoId);
      renderTodos();
      setTodosToLocalStorage(todos.list);
    }

    if (event.target.classList.contains("back")) {
      console.log(todoId);
      todos.setTodoStatus(+todoId);
      renderTodos();
      setTodosToLocalStorage(todos.list);
    }

    if (event.target.classList.contains("complete")) {
      console.log(todoId);
      todos.setDoneStatus(+todoId);
      renderTodos();
      setTodosToLocalStorage(todos.list);
    }
  };

  todoWrapper.innerHTML = "";
  progressWrapper.innerHTML = "";
  doneWrapper.innerHTML = "";

  counterTodo.innerHTML = todos.coutByStatus("todo");
  counterDone.innerHTML = todos.coutByStatus("done");
  counterInProgress.innerHTML = todos.coutByStatus("inprogress");

  todos.list.forEach((todo) => {
    if (todo.status === "todo") {
      let li = renderTodo(todo);
      todoWrapper.innerHTML += li;
    }
    if (todo.status === "inprogress") {
      let li = renderTodoInProgress(todo);
      progressWrapper.innerHTML += li;
    }
    if (todo.status === "done") {
      let li = renderTodoIDone(todo);
      doneWrapper.innerHTML += li;
    }
  });
};
renderTodos();
console.log(todos.list);

const buttonDellAll = document.querySelector(".btnDel");

buttonDellAll.addEventListener("click", function (e) {
  console.log(e.target);
  todos.deleteAll();
  renderTodos();
  setTodosToLocalStorage(todos.list);
});
