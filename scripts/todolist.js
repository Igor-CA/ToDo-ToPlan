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
    let todoListHTML = document.querySelector('#todo-list')
    let categorysListHTML = document.querySelector('#categorys')
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
        addCategory(values.category)
    }

    const addCategory = (name) => {
        if(checkCategoryList(name)) return true 
        
        let newCategory = Category(name)
        categorysListHTML.appendChild(newCategory.elementHTML)
        categorysList.push(newCategory)
    }

    const checkCategoryList = (name) => {
        for(let index in categorysList){
            if(categorysList[index].name === name) return true
        }
        return false
        
    }

    const selectCategory = (name) => {
        categorysList.forEach((category) => {
            
            category.elementHTML.classList.remove('selected')
            
            if(category.name === name) 
                category.elementHTML.classList.add('selected')
        
        })
    }

    
    return { tasksList, addTask, addCategory, selectCategory }
})();

const Category = (categoryName) => {

    let name = categoryName
    let elementHTML = document.createElement('li')
    elementHTML.classList = 'category' 
    elementHTML.innerHTML = name

    elementHTML.addEventListener('click', () => {
        todoList.selectCategory(name)
    })

    const addToDataList = (() => {
        let dataList = document.querySelector('#categorys_list')
        let option = document.createElement('option')
        option.value = name
        dataList.appendChild(option)
    })();

    return { elementHTML, name }
}


const addScreen = (() => {

    let screenContainer = document.getElementById('add_task_screen')
    let nameInput = document.getElementById('new_task_name')
    let categoryInput = document.getElementById('category_input')
    let dateInput = document.getElementById('due_date')
    let repetitionInput = document.getElementById('task_repetition')
    let addBtn = document.getElementById("add")

    const show = () => {
        document.body.classList.toggle('background-mask')
        screenContainer.classList.toggle('unvisible')   
        resetInputValues()
        nameInput.focus()
    }

    addBtn.addEventListener("click", show)

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

