// ----------Option Variables (Can be changed)----------
// minimum height of the selections
var minHeight = 50;
var minWidth = 50;
// gap between the resizer and the selection
var resizerGapX = 10;
var resizerGapY = 10;

// ----------Private Variables (Don't change)----------
var dragging = false;
var resizing = false;
var selections = [];
var currentSelection = {};
var mouseOffsetX = 0;
var mouseOffsetY = 0;
var initialMousePosition = [];
var initialSelectionSize = [];

// ----------Initialization----------
var cropper = document.getElementById("MultiAreaCropper")

var resizer = document.createElement("div")

// styles for resizer
resizer.style.width = "40px";
resizer.style.height = "40px";
resizer.style.background = "rgba(255,255,255,0.5)";
resizer.style.border = "2px solid gray";
resizer.style.position = "absolute";

// Add event listeners
resizer.addEventListener("touchstart", resizerDragStart, false);
document.addEventListener("touchmove", selectionDrag, false);
document.addEventListener("touchend", selectionDragEnd, false);

resizer.addEventListener("mousedown", resizerDragStart, false);
document.addEventListener("mousemove", selectionDrag, false);
document.addEventListener("mouseup", selectionDragEnd, false);

// ----------Helper functions----------
function getMousePosition(event){
    var cropperOffset = [cropper.offsetLeft, cropper.offsetTop]
    if (! event.pageX) {
        if (event.originalEvent) {
            event = event.originalEvent
        }

        if(event.changedTouches) {
            event = event.changedTouches[0]
        }

        if(event.touches) {
            event = event.touches[0]
        }
    }

    var x = event.pageX - cropper.offsetLeft
    var y = event.pageY - cropper.offsetTop

    return [x,y]
}

function moveTo(coords){
    var x = coords[0]
    var y = coords[1]

    // Subtract the offset of the mouse position relative to the current selection
    x -= mouseOffsetX
    y -= mouseOffsetY

    // Ensure that the current selection only stays within the cropper div
    x = (x < 0) ? 0 : (x > cropper.offsetWidth - currentSelection.offsetWidth) ? cropper.offsetWidth - currentSelection.offsetWidth : x;
    y = (y < 0) ? 0 : (y > cropper.offsetHeight - currentSelection.offsetHeight) ? cropper.offsetHeight - currentSelection.offsetHeight : y;

    // Update the style
    currentSelection.style.left = x + "px"
    currentSelection.style.top = y + "px"
}

function updateResizerPosition(){
    resizer.style.left = (currentSelection.offsetLeft + currentSelection.offsetWidth + resizerGapX) + "px"
    resizer.style.top = (currentSelection.offsetTop + currentSelection.offsetHeight + resizerGapY) + "px"
}

function updateSelectionStyle(){
    currentSelection.style.backgroundPosition = "-"+currentSelection.offsetLeft+"px -"+currentSelection.offsetTop+"px"
}

function resizeSelection(coords){
    var maxWidth = cropper.offsetWidth - currentSelection.offsetLeft
    var maxHeight = cropper.offsetHeight - currentSelection.offsetTop

    var newWidth = initialSelectionSize[0] - (initialMousePosition[0] - coords[0])
    var newHeight = initialSelectionSize[1] - (initialMousePosition[1] - coords[1])

    newWidth = newWidth < minWidth ? minWidth : newWidth
    newWidth = newWidth > maxWidth ? maxWidth : newWidth
    newHeight = newHeight < minHeight ? minHeight : newHeight
    newHeight = newHeight > maxHeight ? maxHeight : newHeight
    
    currentSelection.style.width = newWidth + "px"
    currentSelection.style.height = newHeight + "px"
}

// ----------Handler functions----------
// Button functions
function addSelection(){
    var newSelection = document.createElement("div")

    newSelection.style.width = "200px";
    newSelection.style.height = "300px";
    newSelection.style.background = "url('./cinnamon.jpg')";
    newSelection.style.backgroundRepeat = "no-repeat";
    newSelection.style.position = "absolute";

    newSelection.addEventListener("touchstart", selectionDragStart, false);
    newSelection.addEventListener("mousedown", selectionDragStart, false);

    cropper.appendChild(newSelection);
    selections.push(newSelection)
}

function printCoords(){
    outputString = ""
    selections.forEach((selection, index)=>{
        outputString += "Selection "+index+"\n"
        outputString += "Coords: "+selection.offsetLeft+" "+selection.offsetTop+"\n"
        outputString += "Size: "+selection.offsetWidth+" "+selection.offsetHeight+"\n\n"
    })
    alert(outputString)
}

// Selection handler functions
function selectionDragStart(event){
    event.preventDefault();
    currentSelection = event.srcElement;
    if(!dragging){
        dragging = true
        currentSelectionHeight = currentSelection.offsetHeight
        currentSelectionWidth = currentSelection.offsetWidth
        mousePosition = getMousePosition(event)
        mouseOffsetX = mousePosition[0] - currentSelection.offsetLeft
        mouseOffsetY = mousePosition[1] - currentSelection.offsetTop

        resizer.style.left = (currentSelection.offsetLeft + currentSelection.offsetWidth + resizerGapX) + "px"
        resizer.style.top = (currentSelection.offsetTop + currentSelection.offsetHeight + resizerGapY) + "px"
        cropper.appendChild(resizer);
    }
}

function selectionDrag(event){
    if(dragging){
        moveTo(getMousePosition(event));
        updateResizerPosition();
        updateSelectionStyle();
    }
    if(resizing){
        resizeSelection(getMousePosition(event));
        updateResizerPosition();
    }
}

function selectionDragEnd(event){
    dragging = false
    resizing = false
}

// Resizer handler functions
function resizerDragStart(event){
    event.preventDefault()
    resizing = true
    initialMousePosition = getMousePosition(event)
    initialSelectionSize = [currentSelection.offsetWidth, currentSelection.offsetHeight]
}

addSelection()