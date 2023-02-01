let add_btn = document.getElementById("add")
let screen = document.getElementById('add_task_screen')

add_btn.addEventListener("click", show_add_screen)


function select_category(selected_category){
    let categorys = document.querySelectorAll('#categorys>li')
    for(let i=0; i<categorys.length; i++){
        categorys[i].classList.remove('selected')
    }
    selected_category.classList = 'selected'
    document.querySelector('main>h1').innerHTML =selected_category.textContent
}

function check_tasks(){
    let tasks_check_boxes = document.querySelectorAll("#todo-list > li > input[type=checkbox]")
    let task_list = document.querySelectorAll("main > ul > li")
    
    for(let element in tasks_check_boxes){
        if(tasks_check_boxes[element].checked){
            task_list[element].classList = 'done'
        }
        else{task_list
            task_list[element].classList = 'undone'
        }
    }
    order_tasks()
}

function order_tasks(){
    to_do_list = document.querySelector("#todo-list")
    tasks_list = document.querySelectorAll("#todo-list>li")
    for(task in tasks_list){
        if(tasks_list[task].className == 'undone'){
            to_do_list.appendChild(tasks_list[task])
        }
    }
    for(task in tasks_list){
        if(tasks_list[task].className == 'done'){
            to_do_list.appendChild(tasks_list[task])
        }
    }
}

function show_add_screen(){
    document.body.classList.add('disabled')
    screen.classList.remove('unvisible')
    let task_name_input = document.getElementById('new_task_name')
    let category_input = document.getElementById('category_input')
    task_name_input.value = ''
    task_name_input.focus()
    category_input.value = ''
    reset_date()
}

function close_add_screen(){
    document.body.classList.remove('disabled')
    screen.classList = 'unvisible'
}

function reset_date(){
    let date_input = document.getElementById('due_date')
    date_input.value =  ''
}

function add_new_task(){

    let tasks_list = document.getElementById('todo-list')
    let task_list_size = document.querySelectorAll("main > ul > li").length
    
    let task_name_input = document.getElementById('new_task_name')
    let task_name = task_name_input.value
    
    let list_item = document.createElement('li')
    list_item.classList = 'undone'
    

    if(task_name.length > 0){
        list_item.innerHTML = create_task_html(task_list_size, task_name)
        tasks_list.appendChild(list_item)
        
        screen.classList = 'unvisible'
        document.body.classList.remove('disabled')

        window.scrollTo(0, document.body.scrollHeight);
        task_name_input.value = ''
        order_tasks()
        set_category()
    }
    else{
        task_name_input.placeholder = "Add tesk here"
        task_name_input.focus()
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

function create_task_html(task_index, task_name){
    let task = `<input type="checkbox" name="task${task_index}" id="task${task_index}">
    <label for="task${task_index}"> ${task_name} </label>`
    return task
}