let add_btn = document.getElementById("add")
add_btn.addEventListener("click", add)
add_btn.addEventListener("mousedown", change_color)
add_btn.addEventListener("mouseup", change_color_back)

function check_boxes(){
    let check_boxes = document.querySelectorAll("main > ul > li > input[type=checkbox]")
    let list_item = document.querySelectorAll("main > ul > li")
    for(let element = 0; element<check_boxes.length; element++){
        console.log(`Box ${element} is ${check_boxes[element].checked}`)
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

function add(){
    list = document.getElementById('todo-list')
    list_size = document.querySelectorAll("main > ul > li").length
    
    list_item = document.createElement('li')
    list_item.classList.add('undone') 
    
    list_item.innerHTML = `<input type="checkbox" name="task${list_size}" id="task${list_size}">
    <label for="task${list_size}">Task${list_size}</label>`
    list.appendChild(list_item)
    window.scrollTo(0, document.body.scrollHeight);
}

function change_color(){
    add_btn.classList.add('clicked') 
}
function change_color_back(){
    add_btn.classList.remove('clicked') 
}