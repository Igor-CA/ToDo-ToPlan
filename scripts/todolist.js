function getCurrentDate(){
    let currentDate = new Date()
    let isoDate = currentDate.toISOString().slice(0,10);
    return isoDate
}


const Task = (id, values) => {
    let name = values.name;
    let taskId = id;
    let repetition = values.repetition;
    let dueDate = values.dueDate;
    let category = values.category;
    let status = values.status;
    
    let listItem = document.createElement('li')
    let checkbox = document.createElement('input')
    let checkboxLabel = document.createElement('label')
    
    const toggleStatus = () => {
        status = (status === 'undone')? 'done':'undone' ;
        listItem.classList = status;
    }

    checkbox.addEventListener('click', toggleStatus)

    const getNodeHTML = () => {
        return listItem
    }

    const initHTML = () =>{
        listItem.classList = status
        checkbox.type = 'checkbox'
        checkbox.id = `task-${taskId}`
        
        if(status === 'done'){ checkbox.checked = true}

        checkboxLabel.htmlFor = `task-${taskId}`
        checkboxLabel.innerHTML = `${name}`
        listItem.appendChild(checkbox)
        listItem.appendChild(checkboxLabel)
    }

    const getTaskProperties = () => {
        let object = {name, taskId, repetition, dueDate, category, status}
        return object
    }
    
    const getStatus = () => { return status }

    initHTML()

    return { getNodeHTML, getTaskProperties, getStatus }
}

const taskMannager = (() => {
    let todoListHTML = document.querySelector('#todo-list')
    let tasksList = [];
    let visibleTasksList = tasksList
    
    const addTask = (values) => {
        
        let newTaskId = tasksList.length
        
        let newTask = Task(newTaskId, values)
        
        todoListHTML.appendChild(newTask.getNodeHTML())
        tasksList.push(newTask)
        categoryManagger.addCategory(values.category)
        categoryManagger.selectCategory(values.category)
    }

    const orderDoneTasks = () => {
        //Put all incompleted tasks at end of html
        visibleTasksList.forEach( (task) => {
            if(task.getStatus() === 'undone')
                todoListHTML.appendChild(task.getNodeHTML())
        })
        //Put all completed tasks at end of html so the incompleted stay at the top
        visibleTasksList.forEach( (task) => {
            if(task.getStatus() === 'done')
                todoListHTML.appendChild(task.getNodeHTML())
        })
    }

    const showTasksFromCategory = (categoryName) => {
        if(categoryName === 'All') { visibleTasksList = tasksList}
        else if(categoryName === 'Today'){
            visibleTasksList = tasksList.filter( (task) => {
                let taskProperties = task.getTaskProperties()
                return (taskProperties.dueDate === getCurrentDate())
            }) 
        }
        else{
            visibleTasksList = tasksList.filter( (task) => {
                let taskProperties = task.getTaskProperties()
                return (taskProperties.category === categoryName)
            })  
        }
        todoListHTML.innerHTML = null
        visibleTasksList.forEach( (task) => {
            todoListHTML.appendChild(task.getNodeHTML())
        })
        orderDoneTasks()
    }

    todoListHTML.addEventListener('change', orderDoneTasks)
    
    return { tasksList, addTask, showTasksFromCategory }
})();

const Category = (categoryName) => {

    let name = categoryName
    let elementHTML = document.createElement('li')
    elementHTML.classList = 'category' 
    elementHTML.innerHTML = name

    elementHTML.addEventListener('click', () => {
        categoryManagger.selectCategory(name)
    })

    const addToDataList = (() => {
        let dataList = document.querySelector('#categorys_list')
        let option = document.createElement('option')
        option.value = name
        dataList.appendChild(option)
    })();

    return { elementHTML, name }
}

const categoryManagger = (() => {

    let categorysListHTML = document.querySelector('#categorys')
    let categorysList = [];

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
        let categoryIndicator = document.querySelector('#category-indicator')
        categoryIndicator.textContent = name
        categorysList.forEach((category) => {
            
            category.elementHTML.classList.remove('selected')
            
            if(category.name === name) 
                category.elementHTML.classList.add('selected')
        
        })
        taskMannager.showTasksFromCategory(name)
    }

    return { addCategory, selectCategory }
})();

const addScreen = (() => {

    let screenContainer = document.querySelector('#add_task_screen')
    let nameInput = document.querySelector('#new_task_name')
    let categoryInput = document.querySelector('#category_input')
    let dateInput = document.querySelector('#due_date')
    let repetitionInput = document.querySelector('#task_repetition')
    let addBtn = document.querySelector("#add")
    let saveBtn = document.querySelector("#save_new_task_button")
    let cancelBtn = document.querySelector('#cancel_new_task_button')
    let resetDateBtn = document.querySelector('#reset_date')

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

    cancelBtn.addEventListener('click', hide)

    const returnScreenInputValues = () => {
        let name = nameInput.value
        let dueDate = (dateInput.value !== '')? dateInput.value: getCurrentDate()
        let category = (categoryInput.value !== '')? categoryInput.value: 'No category'
        let repetition = repetitionInput.value
        let status = 'done'
        return {name, category, dueDate, repetition, status}
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

    resetDateBtn.addEventListener('click', resetDate)

    const checkForName = () => {
        if(nameInput.value.length > 0) return true
        
        nameInput.placeholder = "Add tesk here"
        nameInput.focus()
        return false
    }

    saveBtn.addEventListener('click', () => { 
        if(!checkForName()) return 
        hide()
        let values = returnScreenInputValues()
        taskMannager.addTask(values) 
    })

    return { show, hide, resetDate, returnScreenInputValues, checkForName }
})();

categoryManagger.addCategory('All')
categoryManagger.addCategory('Today')
categoryManagger.addCategory('No category')
