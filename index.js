var form = document.getElementById("add-todo");
var ul = document.getElementById("todo-list");
var userInput = document.querySelector("input");

form.addEventListener('submit', function addToList(e) {
    e.preventDefault();
    var li = document.createElement("li");
    var addButton = document.createElement("button");
    var value = /^[A-Za-z]+$/;

    if(userInput.value.match(value)) {
        ul.appendChild(li);
        li.appendChild(addButton);
        var todo = userInput.value;
        addButton.textContent = todo;
        userInput.value = "";
        var todo = document.querySelector("li");
        var count= 0;
    
        addButton.onclick = function clicks(){
            function doneTodo() {
            addButton.style.textDecoration = "line-through";
            }
            function deleteTodo() {
            ul.removeChild(li);
            li.removeChild(addButton);
            count= 0;
            }
            if(count == 0) {
            doneTodo();
            count++;
            } else { deleteTodo();
            }
        }
    }
});


