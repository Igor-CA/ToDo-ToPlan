let x = 0
let y = 0
document.addEventListener('mousemove',getMouseCoords)
const zoomElement = document.getElementById('workspace')
let zoom = 1 
/*
document.addEventListener('wheel', function(e){
    if(e.deltaY > 0){ 
        zoomElement.style.transform = `scale(${(zoom += 0.05)})`
    } else{
        zoomElement.style.transform = `scale(${(zoom -= 0.05)})`
    }
    console.log(zoom)
})
*/
function getMouseCoords(event){
    x = event.clientX
    y = event.clientY
    handleMovement()
}

function handleMovement() {
    let square = document.querySelectorAll('.block')
    for(let i=0; i<square.length; i++){
        if(square[i].classList.contains('active')){
            console.log(square[i].style.left)
            square[i].style.left = x + 'px'
            square[i].style.top = y + 'px'     
        }
    }
    
}