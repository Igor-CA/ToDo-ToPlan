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
    let deleteInput = document.createElement('input')
    
    const toggleStatus = () => {
        status = (status === 'undone')? 'done':'undone' ;
        listItem.classList = status;
        saveTask()
    }

    checkbox.addEventListener('click', toggleStatus)
    
    deleteInput.addEventListener('click', () => {
        taskMannager.deleteTask(taskId)
    })

    const getNodeHTML = () => {
        return listItem
    }

    const initHTML = (() =>{
        listItem.classList = status
        checkbox.type = 'checkbox'
        checkbox.id = `task-${taskId}`
        
        if(status === 'done'){ checkbox.checked = true}

        checkboxLabel.htmlFor = `task-${taskId}`
        checkboxLabel.innerHTML = `${name}`
        deleteInput.type = 'button'
        deleteInput.value = 'Delete'
        listItem.appendChild(checkbox)
        listItem.appendChild(checkboxLabel)
        listItem.appendChild(deleteInput)
    })();

    const getTaskProperties = () => {
        let object = {name, taskId, repetition, dueDate, category, status}
        return object
    }
    
    const getStatus = () => { return status }

    const getTaskJSON = () => {
        let object = JSON.stringify({name, taskId, repetition, dueDate, category, status})
        return object
    }

    const saveTask = () => {
        let keyValue = `Task-${taskId}`
        let object = getTaskJSON()
        localStorage.setItem(keyValue, object)
    }

    const updateId = (newId) => {
        taskId = newId
        saveTask()
    }
    
    saveTask()

    return { getNodeHTML, getTaskProperties, getStatus, updateId }
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
        showVisibleTasks()
    }

    const showVisibleTasks = () => {
        todoListHTML.innerHTML = null
        visibleTasksList.forEach( (task) => {
            todoListHTML.appendChild(task.getNodeHTML())
        })
        orderDoneTasks()
    }

    const loadTasks = () => {
        let newTask = {}
        let id = 0
        while(newTask !== null){
            newTask = localStorage.getItem(`Task-${id}`)
            newTask = JSON.parse(newTask)
            if(newTask !== null){
                addTask(newTask)
            }
            id++
        }
        categoryManagger.selectCategory('All')
    }

    const deleteTask = (taskId) => {
        localStorage.removeItem(`Task-${taskId}`)
        tasksList.splice(taskId, 1)
        console.log(categoryManagger.getSelectedCategory())
        showTasksFromCategory(categoryManagger.getSelectedCategory())
        updatesIds()
    }

    const updatesIds = () => {
        tasksList.forEach( (task, id) => {
            task.updateId(id)
        })
    }


    todoListHTML.addEventListener('change', orderDoneTasks)

    return { tasksList, addTask, showTasksFromCategory, loadTasks, deleteTask, updatesIds }
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
    let selectedCategory = 'All'

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
        selectedCategory =  name
        categoryIndicator.textContent = selectedCategory
        categorysList.forEach((category) => {
            
            category.elementHTML.classList.remove('selected')
            
            if(category.name === selectedCategory) 
                category.elementHTML.classList.add('selected')
        
        })
        taskMannager.showTasksFromCategory(selectedCategory)
    }

    const getSelectedCategory = () => {
        return selectedCategory
    }


    return { addCategory, selectCategory, getSelectedCategory }
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
        let status = 'undone'
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

    return { show, hide }
})();

categoryManagger.addCategory('All')
categoryManagger.addCategory('Today')
taskMannager.loadTasks()
