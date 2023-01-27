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