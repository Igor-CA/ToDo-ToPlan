let x = 0
let y = 0
const zoomElement = document.getElementById('workspace')


var scale = 1,
panning = false,
panning2 = false, 
pointX = 0,
pointY = 0,
start = { x:0, y:0 },
zoom = document.getElementById('workspace');
box = document.getElementById('square')

draggableBox = new Draggable(box,{
    type:"x,y"
});

var rightBox = document.getElementsByClassName('right')
var leftBox = document.getElementsByClassName('left')
var bottonBox = document.getElementsByClassName('botton');
var topBox = document.getElementsByClassName('top')

let rightLastX = 0;
let rightDraggable = new Draggable(rightBox, {
    trigger:".topRight, .bottomRight",
    type:"x,y",
    onDrag: updateRight,
    onPress: function(){
        rightLastX = this.x
        draggableBox.disable()
    },
    onRelease: function(){
        draggableBox.enable()
    }
})

function updateRight(){
    var diffX = this.x - rightLastX
    TweenMax.set(box, { width: "+=" + diffX })
    rightLastX = this.x
}

let topLastY = 0;
let topDraggable = new Draggable(topBox, {
    trigger:".topRight, .topLeft",
    type:"x,y",
    onDrag: updateTop,
    onPress: function(){
        topLastY = this.Y
        draggableBox.disable()
    },
    onRelease: function(){
        draggableBox.enable()
    }
})

function updateTop(){
    var diffY = this.y - topLastY
    TweenMax.set(box, { height: "-=" + diffY ,y: "+=" + diffY })
    topLastY = this.y
}

let leftLastX = 0;
let leftDraggable = new Draggable(leftBox, {
    trigger:".topLeft, .bottomLeft",
    type:"x,y",
    onDrag: updateLeft,
    onPress: function(){
        leftLastX = this.x
        draggableBox.disable()
    },
    onRelease: function(){
        draggableBox.enable()
    }
})

function updateLeft(){
    var diffX = this.x - leftLastX
    TweenMax.set(box, { width: "-=" + diffX, x: "+=" + diffX })
    leftLastX = this.x
}

let bottomLastY = 0;
let bottomDraggable = new Draggable(bottonBox, {
    trigger:".bottomRight, .bottomLeft",
    type:"x,y",
    onDrag: updateBottom,
    onPress: function(){
        bottomLastY = this.Y
        draggableBox.disable()
    },
    onRelease: function(){
        draggableBox.enable()
    }
})

function updateBottom(){
    var diffY = this.y - bottomLastY
    TweenMax.set(box, { height: "+=" + diffY})
    bottomLastY = this.y
}





function setTransform(){
    zoom.style.translate = `${pointX}px  ${pointY}px`
    zoom.style.transform = `matrix(${scale}, 0, 0, ${scale}, 0, 0)`
    let stretch_buttons = document.getElementsByClassName('diagonalResize')
    for(let i=0; i<stretch_buttons.length; i++){
        stretch_buttons[i].style.transform = `matrix(${1/scale}, 0, 0, ${1/scale}, 0, 0)`
    }
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

