document.addEventListener("DOMContentLoaded", function () {
  const todos = [];
  const RENDER_EVENT = "render-todo";

  const SAVED_EVENT = "saved-todo";
  const STORAGE_KEY = "TODO_APPS";

  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById("todos");
    uncompletedTODOList.innerHTML = "";

    const completedTODOList = document.getElementById("completed-todos");
    completedTODOList.innerHTML = "";

    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if (!todoItem.isCompleted) uncompletedTODOList.append(todoElement);
      else completedTODOList.append(todoElement);
    }
  });

  function addTodo() {
    const textTodo = document.getElementById("title").value;
    const timeStamp = document.getElementById("date").value;

    const generatedID = generateId();
    const todoObject = generateTodoObject(
      generatedID,
      textTodo,
      timeStamp,
      false
    );
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }

  function generateTodoObject(id, task, timeStamp, isCompleted) {
    return {
      id,
      task,
      timeStamp,
      isCompleted,
    };
  }

  function makeTodo(todoObject) {
    const textTile = document.createElement("h2");
    textTile.innerText = todoObject.task;

    const textTimeStamp = document.createElement("p");
    textTimeStamp.innerText = todoObject.timeStamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTile, textTimeStamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("undo-button");

      undoButton.addEventListener("click", function () {
        undoTaskFromCompleted(todoObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");

      trashButton.addEventListener("click", function () {
        removeTaskFromCompleted(todoObject.id);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("check-button");

      checkButton.addEventListener("click", function () {
        addTaskToCompleted(todoObject.id);
      });

      container.append(checkButton);
    }

    function addTaskToCompleted(todoID) {
      const todoTarger = findTodo(todoID);

      if (todoTarger == null) return;

      todoTarger.isCompleted = true;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }

    function findTodo(todoID) {
      for (const todoItem of todos) {
        if (todoItem.id === todoID) {
          return todoItem;
        }
      }
      return null;
    }

    function removeTaskFromCompleted(todoId) {
      const todoTarger = findTodoIndex(todoId);
      if (todoTarger == null) return;
      todos.splice(todoTarger, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }

    function undoTaskFromCompleted(todoId) {
      const todoTarger = findTodo(todoId);
      if (todoTarger == null) return;
      todoTarger.isCompleted = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }

    function findTodoIndex(todoId) {
      for (const index in todos) {
        if (todos[index].id == todoId) {
          return index;
        }
      }
      return null;
    }

    function saveData() {
      if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
      }
    }

    function isStorageExist() {
      if (typeof Storage === undefined) {
        alert("browser kamu tidak mendukung local storage");
        return false;
      }
      return true;
    }

    function loadDataFromStorage() {
      const serializedData = localStorage.getItem(STORAGE_KEY);
      let data = JSON.parse(serializedData);

      if (data !== null) {
        for (const todo of data) {
          todos.push();
        }
      }

      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    if (isStorageExist()) {
      loadDataFromStorage();
    }

    return container;
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
});
