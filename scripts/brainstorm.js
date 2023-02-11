let note = document.querySelectorAll(".block");
function setNotesListener(){
    for(let i=0; i<note.length; i++){
        let rightBox = document.getElementsByClassName('rightResize')[i]
        let leftBox =  document.getElementsByClassName('leftResize')[i]
        let bottomBox =  document.getElementsByClassName('topResize')[i]
        let topBox =  document.getElementsByClassName('bottomResize')[i]

        let rightTrigger = note[i].querySelectorAll('.right')
        let leftTrigger = note[i].querySelectorAll('.left')
        let topTrigger = note[i].querySelectorAll('.top')
        let BottomTrigger = note[i].querySelectorAll('.bottom')

        let draggableBox = new Draggable(note[i],{
            type:"x,y",
            onClick:function(){
                note[i].classList.add('active')
                rightDraggable.enable()
                leftDraggable.enable()
                topDraggable.enable()
                bottomDraggable.enable()
            },
            onDrag:function(){
                note[i].classList.remove('active')
                rightDraggable.disable()
                leftDraggable.disable()
                topDraggable.disable()
                bottomDraggable.disable()
            }
        });
        let rightLastX = 0;
        let rightDraggable = new Draggable(rightBox, {  
            trigger:rightTrigger,
            type:"x,y",
            onDrag: function(){
                let diffX = this.x - rightLastX
                gsap.set(note[i], { width: "+=" + diffX })
                rightLastX = this.x
            },
            onPress: function(){
                rightLastX = this.x
                draggableBox.disable()
            },
            onRelease: function(){
                draggableBox.enable()
            }
        })


        let topLastY = 0;
        let topDraggable = new Draggable(topBox, {
            trigger:topTrigger,
            type:"x,y",
            onDrag: function(){
                var diffY = this.y - topLastY
                TweenMax.set(note[i], { height: "-=" + diffY ,y: "+=" + diffY })
                topLastY = this.y
            },
            onPress: function(){
                topLastY = this.Y
                draggableBox.disable()
            },
            onRelease: function(){
                draggableBox.enable()
            }
        })


        let leftLastX = 0;
        let leftDraggable = new Draggable(leftBox, {
            trigger:leftTrigger,
            type:"x,y",
            onDrag: function(){
                var diffX = this.x - leftLastX
                TweenMax.set(note[i], { width: "-=" + diffX, x: "+=" + diffX })
                leftLastX = this.x
            },
            onPress: function(){
                leftLastX = this.x
                draggableBox.disable()
            },
            onRelease: function(){
                draggableBox.enable()
            }
        })


        let bottomLastY = 0;
        let bottomDraggable = new Draggable(bottomBox, {
            trigger:BottomTrigger,
            type:"x,y",
            onDrag: function(){
                var diffY = this.y - bottomLastY
                TweenMax.set(note[i], { height: "+=" + diffY})
                bottomLastY = this.y
            },
            onPress: function(){
                bottomLastY = this.Y
                draggableBox.disable()
            },
            onRelease: function(){
                draggableBox.enable()
            }
        })
    }
}
setNotesListener()
function addNote(){
    let newNote = document.createElement('div')
    let noteHTML = 
        `<div class="diagonalResize bottom left"></div>
        <div class="diagonalResize bottom right"></div>
        <div class="diagonalResize top left"></div>
        <div class="diagonalResize top right"></div>
        <div class="leftResize"></div>
        <div class="rightResize"></div>
        <div class="topResize"></div>
        <div class="bottomResize"></div>`
    newNote.innerHTML = noteHTML
    newNote.classList = 'block'
    let workspace = document.getElementById("workspace")
    workspace.appendChild(newNote)
    note = document.querySelectorAll(".block");
    setNotesListener()

}

var scale = 1,
panning = false,
panning2 = false, 
pointX = 0,
pointY = 0,
start = { x:0, y:0 },
zoom = document.getElementById('workspace');

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

