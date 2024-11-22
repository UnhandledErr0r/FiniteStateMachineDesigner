let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')


let states = []
let selectedState = null;
let inputField = null;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

class State{
	constructor(ctx, x, y, name=""){
		this.x = x;
		this.y = y;
		this.ctx = ctx;
		this.name = name;
		this.color = "black";
		this.transitions = [];
	}

	draw(){
		this.ctx.beginPath();
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = this.color;
		this.ctx.arc(this.x, this.y, 40, 0, Math.PI*2, false)
		this.ctx.stroke();
		this.write()
	}

	write(){
		
		const text = this.name || "";
		this.ctx.font = "16px sans-serif";
		let textWidth = this.ctx.measureText(text).width;
		let textHeight = 16;
		this.ctx.fillText(text, this.x-(textWidth/2), this.y+(textHeight/4));
	}
}

function createStateText(state) {
    if (inputField) {
        inputField.remove();
        inputField = null;
    }

    inputField = document.createElement('input');
    inputField.type = "text";
    inputField.value = state.name || "";
    inputField.style.position = "absolute";
    inputField.style.width = "60px";
    inputField.maxLength = 7;

	document.body.appendChild(inputField);
	

	
	
    const inputWidth = inputField.offsetWidth;
    const inputHeight = inputField.offsetHeight;
    const canvasOffsetX = canvas.offsetLeft;
    const canvasOffsetY = canvas.offsetTop;
    inputField.style.left = `${state.x + canvasOffsetX - inputWidth / 2}px`;
    inputField.style.top = `${state.y + canvasOffsetY - inputHeight / 2}px`;
	inputField.style.border = "none";
	inputField.style.outline = "none";
	//inputField.style.background = "none";
	inputField.style.fontSize = "16px";
	inputField.style.textAlign = "center"

    inputField.focus();

	inputField.addEventListener('keydown', function(e){
		if(inputField){
			if(e.key === "Enter"){
				selectedState.name = inputField.value;
				inputField.remove();
				inputField = null;
				redraw()
			}
		}
	})

    inputField.addEventListener('blur', function () {
        state.name = inputField.value;
        if (inputField && inputField.parentNode) {
            inputField.remove();
            inputField = null;
        }
        redraw();
    });
}

function redraw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	states.forEach(state => {
		if(selectedState===state){
			state.color = "blue";
		}else{
			state.color = "black"
		}
        state.draw();
    });
}




canvas.addEventListener('dblclick', function(e){

	if (inputField) {
        const inputRect = inputField.getBoundingClientRect();
        const isClickInsideInput = e.clientX >= inputRect.left &&
            e.clientX <= inputRect.right &&
            e.clientY >= inputRect.top &&
            e.clientY <= inputRect.bottom;

        if (!isClickInsideInput) {
            inputField.remove();
            inputField = null;
            redraw();
        }
        return;
    }


	let mouseX = e.pageX - canvas.offsetLeft;
	let mouseY = e.pageY - canvas.offsetTop;
	console.log(states)
	let state = new State(ctx, mouseX, mouseY)
	state.draw()
	state.write()
	states.push(state);
	redraw();	
})

canvas.addEventListener('click', function(e){

	let mouseX = e.pageX - canvas.offsetLeft;
	let mouseY = e.pageY - canvas.offsetTop;

	if (inputField) {
        const inputRect = inputField.getBoundingClientRect();
        const isClickInsideInput = e.clientX >= inputRect.left &&
            e.clientX <= inputRect.right &&
            e.clientY >= inputRect.top &&
            e.clientY <= inputRect.bottom;

        if (!isClickInsideInput) {
            inputField.remove();
            inputField = null;
            redraw();
        }
        return;
    }

	if(selectedState){
		const distance = Math.sqrt((mouseX - state.x) ** 2 + (mouseY - state.y) ** 2);
		if(distance>30){
			selectedState = null;
			redraw()
		}
	}


	states.forEach(state => {
        const distance = Math.sqrt((mouseX - state.x) ** 2 + (mouseY - state.y) ** 2);
        if (distance < 30) {
            selectedState = state;
            createStateText(state);
        }
    });

	redraw();
})

canvas.addEventListener('mousedown', function(e){
	if(selectedState){
		let mouseX = e.pageX - canvas.offsetLeft;
		let mouseY = e.pageY - canvas.offsetTop;
		offsetX = mouseX - selectedState.x;
        offsetY = mouseY - selectedState.y;
		isDragging = true;
	}
})

canvas.addEventListener('mousemove', function(e){
	if(selectedState && isDragging){
		const mouseX = e.pageX - canvas.offsetLeft;
        const mouseY = e.pageY - canvas.offsetTop;
		selectedState.x = mouseX - offsetX;
        selectedState.y = mouseY - offsetY;
		redraw();
	}
})

canvas.addEventListener("mouseup", function(){
	if(isDragging){
		isDragging = false;
		selectedState = null;
	}
})

canvas.addEventListener("mouseleave", function(){
	if(isDragging){
		isDragging = false;
		selectedState = null;
	}
})