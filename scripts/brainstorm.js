let x = 0
let y = 0
//document.addEventListener('mousemove',getMouseCoords)
const zoomElement = document.getElementById('workspace')
/*
let zoom = 1 
document.addEventListener('wheel', function(e){
    if(e.deltaY > 0){ 
        zoomElement.style.transform = `scale(${(zoom += 0.05)})`
    } else{
        zoomElement.style.transform = `scale(${(zoom -= 0.05)})`
    }
    console.log(zoom)
})
*/

var scale = 1,
panning = false,
panning2 = false, 
pointX = 0,
pointY = 0,
start = { x:0, y:0 },
zoom = document.getElementById('workspace');

Draggable.create(".block",{
    type:"x,y",
    onDrag:function()
    {
    }
});


function setTransform(){
    zoom.style.translate = `${pointX}px  ${pointY}px`
    zoom.style.transform = `matrix(${scale}, 0, 0, ${scale}, 0, 0)`
}

window.onmousedown = function(e){
    e.preventDefault()
    start = {x: e.clientX - pointX, y: e.clientY - pointY}
    panning = true
}

window.onmouseup = function(e){
    panning = false
}

window.onmousemove = function(e){
    e.preventDefault()
    if(!panning){
        return
    }

    pointX = (e.clientX - start.x)
    pointY = (e.clientY - start.y)
    setTransform()
}

window.onwheel = function(e){
    e.preventDefault()
    var xs = (e.clientX - pointX)/scale
    var ys = (e.clientY - pointY)/scale

    var delta = (e.wheelDelta ? e.wheelDelta : -e.wheelDelta)

    if(delta>0 && scale < 3){
        (scale += 0.05)
    } else if(scale>0.2){(scale -= 0.05)} 

    pointX = e.clientX -  xs*scale
    pointY = e.clientY -  ys*scale
    
    setTransform()
}


/*
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
            square[i].style.transform = `translate(${pointX}px,  ${pointY}px) scale(${scale})`
        }
    }
    
}
*/
