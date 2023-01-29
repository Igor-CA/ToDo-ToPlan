let add_btn = document.getElementById("add")
add_btn.addEventListener("click", add_screen)

function check_boxes(){
    let check_boxes = document.querySelectorAll("main > ul > li > input[type=checkbox]")
    let list_item = document.querySelectorAll("main > ul > li")
    for(let element = 0; element<check_boxes.length; element++){
        if(check_boxes[element].checked){
            list_item[element].classList.add('done')  
            list_item[element].classList.remove('undone')  
        }
        else{
            list_item[element].classList.add('undone') 
            list_item[element].classList.remove('done')  
        }
    }
}

function add_screen(){
    screen = document.getElementById('add_task_screen')
    document.body.classList.add('disabled')
    screen.classList.remove('unvisible')
}

function add(){
    list = document.getElementById('todo-list')
    list_size = document.querySelectorAll("main > ul > li").length
    
    screen = document.getElementById('add_task_screen')
    
    task_name = document.getElementById('add_task')
    list_item = document.createElement('li')
    list_item.classList.add('undone') 
    

    if(task_name.value.length > 0){
        list_item.innerHTML = `<input type="checkbox" name="task${list_size}" id="task${list_size}">
        <label for="task${list_size}">${task_name.value}</label>`
        task_name.value = null
        screen.classList.add('unvisible')
        document.body.classList.remove('disabled')
        list.appendChild(list_item)
        window.scrollTo(0, document.body.scrollHeight);
    }
    else{
        task_name.placeholder = "Add tesk here"
        task_name.focus()
    }
}
function check_save(){
    console.log('aqui')
    save_button = document.getElementById('save_task_button')
    task_name = document.getElementById('add_task')
    if(task_name.value.length > 0){
        save_button.style.color = 'var(--cor005)'
    }
    else{
        save_button.style.color = '#4a4a4a'        
    }
}