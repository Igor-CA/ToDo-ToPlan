function getCurrentDate(){
    let currentDate = new Date()
    let isoDate = currentDate.toISOString().slice(0,10);
    return isoDate
}
function firstLetterToUpperCase(string){
    let newString = string.charAt(0).toUpperCase() + string.slice(1);
    return newString
}

const Task = (id, values) => {
    let name = values.name;
    let taskId = id;
    let repetition = values.repetition;
    let dueDate = values.dueDate;
    let category = values.category;
    let status = values.status;
    
    //It's this way to show how one element is related to one another
    let ItemHTML = document.createElement('li')
        let mainBody = document.createElement('div')
            let checkboxContainer = document.createElement('div')
                let checkbox = document.createElement('input')
                let checkboxLabel = document.createElement('label')
            let moreOptionsIcon = document.createElement('i')
        let optionsContainer = document.createElement('div')
            let dueDateIndicator = document.createElement('div')
            let deleteIcon = document.createElement('i')
            let editIcon = document.createElement('i')
    
    const toggleStatus = () => {
        status = (status === 'undone')? 'done':'undone' ;
        if(status === 'done'){ ItemHTML.classList.add('task--done') }
        else {ItemHTML.classList.remove('task--done') }
        saveTask()
    }

    checkbox.addEventListener('click', toggleStatus)
    
    deleteIcon.addEventListener('click', () => {
        taskMannager.deleteTask(taskId)
    })
    editIcon.addEventListener('click', () => {
        taskPropertiesScreen.edit(getTaskProperties())
    })
    mainBody.addEventListener('click', () => {
        optionsContainer.classList.toggle('task__options-container--invisible')
        moreOptionsIcon.classList.toggle('task__options-icon--rotate')
    })

    const getNodeHTML = () => {
        return ItemHTML
    }

    const generateHTML = () =>{
        ItemHTML.classList = 'task'
        
        mainBody.classList = 'task__main-body'
        checkboxContainer.classList = 'task__checkbox-container'
        checkbox.classList = 'task__checkbox'
        checkboxLabel.classList = 'task__label'
        moreOptionsIcon.classList = 'task__icon task__options-icon fa fa-angle-down '
        optionsContainer.classList = 'task__options-container task__options-container--invisible'
        dueDateIndicator.classList = 'task__due-date'
        deleteIcon.classList = 'task__icon task__delete fa fa-trash-o '
        editIcon.classList = 'task__icon task__edit fa fa-pencil '


        checkbox.type = 'checkbox'
        if(status === 'done'){ 
            checkbox.checked = true
            ItemHTML.classList.add('task--done')
        }
        
        checkbox.id = `task-${taskId}`
        checkboxLabel.htmlFor = `task-${taskId}`
        checkboxLabel.innerHTML = name
        
        
        dueDateIndicator.innerHTML = dueDate.replaceAll('-', '/')
        
        checkboxContainer.appendChild(checkbox)
        checkboxContainer.appendChild(checkboxLabel)

        mainBody.appendChild(checkboxContainer)
        mainBody.appendChild(moreOptionsIcon)
        
        optionsContainer.appendChild(dueDateIndicator)
        optionsContainer.appendChild(deleteIcon)
        optionsContainer.appendChild(editIcon)
        
        ItemHTML.appendChild(mainBody)
        ItemHTML.appendChild(optionsContainer)
    };

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

    const edit = (newValues) => {
        name = newValues.name;
        repetition = newValues.repetition;
        dueDate = newValues.dueDate;
        category = newValues.category;
        generateHTML()
        saveTask()
    }
    
    generateHTML()
    saveTask()

    return { name, getNodeHTML, getTaskProperties, getStatus, updateId, edit }
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
        tasksList.splice(taskId, 1)
        showTasksFromCategory(categoryManagger.getSelectedCategory())
        updatesIds()
        localStorage.removeItem(`Task-${tasksList.length}`)
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
    elementHTML.classList = 'category-holder__selector' 
    elementHTML.innerHTML = name

    elementHTML.addEventListener('click', () => {
        categoryManagger.selectCategory(name)
    })

    const addToDataList = (() => {
        let dataList = document.querySelector('#categorys-list')
        let option = document.createElement('option')
        if(name !== 'All' && name !== 'Today')
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
        addCategory(name)
        let categoryIndicator = document.querySelector('#category-indicator')
        selectedCategory =  name
        categoryIndicator.textContent = selectedCategory
        categorysList.forEach((category) => {
            
            category.elementHTML.classList.remove('category-holder__selector--active')
            
            if(category.name === selectedCategory) 
                category.elementHTML.classList.add('category-holder__selector--active')
        
        })
        taskMannager.showTasksFromCategory(selectedCategory)
    }

    const getSelectedCategory = () => {
        return selectedCategory
    }


    return { addCategory, selectCategory, getSelectedCategory }
})();

const taskPropertiesScreen = (() => {

    let screenContainer = document.querySelector('#add-task-screen')
    let nameInput = document.querySelector('#new-task-name')
    let categoryInput = document.querySelector('#category-input')
    let dateInput = document.querySelector('#due-date')
    let repetitionInput = document.querySelector('#task-repetition')
    let addBtn = document.querySelector("#new-task-button")
    let saveNewTaskBtn = document.querySelector("#add-new-task-button")
    let saveEditBtn = document.querySelector("#save-new-task-button")
    let cancelBtn = document.querySelector('#cancel-new-task-button')
    let resetDateBtn = document.querySelector('#reset-date')
    let editedTaskId = null

    const show = () => {
        document.body.classList.toggle('background-mask')
        screenContainer.classList.remove('add-screen--invisible')   
        resetInputValues()
        nameInput.focus()
    }
    const showAddScreen = () => {
        show()
        saveEditBtn.classList.add('add-screen__close-icons--invisible')
        saveNewTaskBtn.classList.remove('add-screen__close-icons--invisible')
    }
    const showEditScreen = () => {
        show()
        saveEditBtn.classList.remove('add-screen__close-icons--invisible')
        saveNewTaskBtn.classList.add('add-screen__close-icons--invisible')
    }

    addBtn.addEventListener("click", showAddScreen)

    const hide = () => {
        document.body.classList.toggle('background-mask')
        screenContainer.classList.add('add-screen--invisible') 
    }

    cancelBtn.addEventListener('click', hide)

    const edit = (taskValues) => {
        showEditScreen()
        nameInput.value = taskValues.name
        categoryInput.value = taskValues.category
        repetitionInput.value = taskValues.repetition 
        dateInput.value = taskValues.dueDate
        editedTaskId = taskValues.taskId
    }

    const returnScreenInputValues = () => {
        let name = firstLetterToUpperCase(nameInput.value)
        let dueDate = (dateInput.value !== '')? dateInput.value: getCurrentDate()
        let category = (categoryInput.value !== '')
                            ?firstLetterToUpperCase(categoryInput.value)
                            :'No category'
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

    saveNewTaskBtn.addEventListener('click', () => { 
        if(!checkForName()) return 
        hide()
        let values = returnScreenInputValues()
        taskMannager.addTask(values) 
    })
    
    saveEditBtn.addEventListener('click', () => { 
        if(!checkForName()) return 
        hide()
        let newValues = returnScreenInputValues()
        taskMannager.tasksList[editedTaskId].edit(newValues)
    })
    
    return { edit }
})();

categoryManagger.addCategory('All')
categoryManagger.addCategory('Today')
taskMannager.loadTasks()
