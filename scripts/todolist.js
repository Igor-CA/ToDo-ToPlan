const Task = (id, values) => {
    let name = values.name;
    let taskId = id;
    let description = values.description;
    let repetition = values.repetition;
    let dueDate = values.dueDate;
    let category = values.category;
    let status = 'undone';
    
    let listItem = document.createElement('li')
    let checkbox = document.createElement('input')
    let checkboxLabel = document.createElement('label')

    checkbox.addEventListener('click', ()=>{
        toggleStatus()
    })
    
    const toggleStatus = () => {
        status = (status === 'undone')? 'done':'undone' ;
        listItem.classList = status;
    }

    const getNodeHTML = () => {
        return listItem
    }

    const initHTML = () =>{
        listItem.classList = status
        checkbox.type = 'checkbox'
        checkbox.id = `task-${taskId}`
        checkboxLabel.htmlFor = `task-${taskId}`
        checkboxLabel.innerHTML = `${name}`
        listItem.appendChild(checkbox)
        listItem.appendChild(checkboxLabel)
    }

    const generateTaskJSON = () => {
        let object = {name, taskId, description, repetition, dueDate, category, status}
        return object
    }
    
    initHTML()

    return { toggleStatus, getNodeHTML, generateTaskJSON}
}

const todoList = (() => {
    let todoListHTML = document.getElementById('todo-list')
    let tasksList = [];
    let categorysList = [];
    
    const addTask = () => {
        if(!addScreen.checkForName()) return 
        
        addScreen.hide()

        let values = addScreen.returnScreenInputValues()
        let newTaskId = tasksList.length
        
        let newTask = Task(newTaskId, values)
        
        todoListHTML.appendChild(newTask.getNodeHTML())
        tasksList.push(newTask)
    }
    
    return { tasksList, addTask }
})();

const addScreen = (() => {

    let screenContainer = document.getElementById('add_task_screen')
    let nameInput = document.getElementById('new_task_name')
    let categoryInput = document.getElementById('category_input')
    let dateInput = document.getElementById('due_date')
    let repetitionInput = document.getElementById('task_repetition')

    const show = () => {
        document.body.classList.toggle('background-mask')
        screenContainer.classList.toggle('unvisible')   
        resetInputValues()
        nameInput.focus()
    }
    const hide = () => {
        document.body.classList.toggle('background-mask')
        screenContainer.classList.toggle('unvisible') 
    }

    const returnScreenInputValues = () => {
        let name = nameInput.value
        let date = (dateInput.value !== '')? dateInput.value: '2003-03-23'
        let category = (categoryInput.value !== '')? categoryInput.value: 'none'
        let repetition = repetitionInput.value
        return {name, category, date, repetition}
    }

    const resetInputValues = () => {
        nameInput.value = null
        categoryInput.value = null
        repetitionInput.value = 1 //Equivalent to Once
        resetDate()
    }

    const resetDate = () => {
        dateInput.value =  null
    }

    const checkForName = () => {
        if(nameInput.value.length > 0) return true
        
        nameInput.placeholder = "Add tesk here"
        nameInput.focus()
        return false
    }

    return { show, hide, resetDate, returnScreenInputValues, checkForName }
})();

let add_btn = document.getElementById("add")
let screen = document.getElementById('add_task_screen')

add_btn.addEventListener("click", addScreen.show)


function select_category(selected_category){
    let categorys = document.querySelectorAll('#categorys>li')
    for(let i=0; i<categorys.length; i++){
        categorys[i].classList.remove('selected')
    }
    selected_category.classList = 'selected'
    document.querySelector('main>h1').innerHTML =selected_category.textContent
}
/*
function check_tasks(){
    let tasks_check_boxes = document.querySelectorAll("#todo-list > li > input[type=checkbox]")
    let task_list = document.querySelectorAll("main > ul > li")
    
    for(let element in tasks_check_boxes){
        if(tasks_check_boxes[element].checked){
            task_list[element].classList = 'done'
        }
        else{
            task_list[element].classList = 'undone'
        }
    }
    order_tasks()
}
*/
function order_tasks(){
    let to_do_list = document.querySelector("#todo-list")
    let tasks_list = document.querySelectorAll("#todo-list>li")
    for(let task in tasks_list){
        if(tasks_list[task].className == 'undone'){
            to_do_list.appendChild(tasks_list[task])
        }
    }
    for(let task in tasks_list){
        if(tasks_list[task].className == 'done'){
            to_do_list.appendChild(tasks_list[task])
        }
    }
}



function set_category(){
    let category_input = document.getElementById('category_input')
    let categorys_data_list = document.getElementById('categorys_list')
    let item = document.createElement('option')
    item.value = category_input.value
    if(!check_in_category_list(item)){
        categorys_data_list.appendChild(item)
        add_to_category_selector(item.value)
    }
}

function add_to_category_selector(category_name){
    let categorys_list = document.getElementById('categorys')
    let item = document.createElement('li')
    item.innerText = category_name
    item.setAttribute('onclick',' select_category(this)')
    categorys_list.appendChild(item)
}

function check_in_category_list(item){
    let category = document.querySelectorAll("#categorys_list > option")
    for(let i=0; i<category.length; i++){
        if(item.value == category[i].value){
            return true
        }
    }
    return false
}