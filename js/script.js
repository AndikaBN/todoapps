document.addEventListener("DOMContentLoaded", function () {
  const todos = [];
  const RENDER_EVENT = "render-todo";

  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById("todos");
    uncompletedTODOList.innerHTML = "";

    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if (!todoItem.isCompleted) {
        uncompletedTODOList.append(todoElement);
      }
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
        undiTaskFromCompleted(todoObject.id);
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
    }

    function findTodo(todoID) {
      for (const todoItem of todos) {
        if (todoItem.id === todoID) {
          return todoItem;
        }
      }
      return null;
    }

    return container;
  }
});
