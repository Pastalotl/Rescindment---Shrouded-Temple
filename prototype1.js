const canvas = document.getElementById("game") /*grab canvas*/
const ctx = canvas.getContext('2d') /*context for drawing on canvas*/
const scale = Math.floor(window.innerWidth/320) > Math.floor(window.innerHeight/180) ? Math.floor(window.innerHeight/180) : Math.floor(window.innerWidth/320) /*finds the largest possible integer scale value that the canvas can take up and saves it so everything can be resized uniformly*/
canvas.width = 320 * scale /*set the width and height according to scale*/
canvas.height = 180 * scale
centre = {x: 160 * scale, y: 90 * scale}
console.log("initialisation:", canvas.width +" x " + canvas.height)

/*floor0*/
board = {x:0,y:0}
const floor0 = new Image()
floor0.src = "./Assets/Map/floor0 vestibule.png"
const cam = {x:0, y:0}
console.log("camera created")

/*takes a cartesian x coordinate and the width of the image and returns the x centre of the image for canvas*/
function renderX(x,width){
  //console.log("X:",centre.x,cam.x)
  return (x*scale + centre.x - cam.x*scale) - scale*width / 2
}
/*takes a cartesian y coordinate and the height of the image and returns the y centre of the image for canvas*/
function renderY(y,height){
//console.log("Y:",centre.y,cam.y)
  return (y*scale + centre.y - cam.y*scale) - scale*height/2 
}
console.log("Rendering defined")

/*whilst waiting for everything to load, it displays the Rescindment logo*/
const logo = new Image()
logo.src = "./Assets/Icons/Shrouded Temple.png" /*url for shrouded temple logo*/
logo.height = 128
logo.width = 128
ctx.imageSmoothingEnabled = false
ctx.drawImage(logo,renderX(board.x,logo.width),renderY(board.y,logo.height),logo.width * scale, logo.height * scale)
//console.log("logo rendered with parameters: " ,logo,renderX(0,logo.width),renderY(0,logo.height),logo.width * scale, logo.height * scale)


var lastFrameTime = 0
const silaeraSheet = new Image()
silaeraSheet.src = "./Assets/Characters/Silaera.png" /*current url for Silaera (front sprite only), check this is still correct if you do not see it*/
const Silaera = {height:40, width:31, row:0, col:0, xpos:0, ypos:0} /*object containing information on cutting down Silaera's spritesheet*/
console.log("Silaera created")
Silaera.xpos = -64 //centre.x - Silaera.width / 2 * scale
Silaera.ypos = 0 //centre.y - Silaera.height / 2 * scale
cam.x = Silaera.xpos
cam.y = Silaera.ypos
//console.log(centre.x,scale,cam.x)
//console.log(-cam.x * (centre.x/ 2 - cam.x * scale)/scale)
//console.log(renderX(-0,228))
function cycle(time) {
  console.log(time,lastFrameTime)
  if (time - lastFrameTime > 167){
    /* ^^ this limits the frame rate, 1000/6 ~= 167*/
    Silaera.col ++ /*iterate to next frame for direction*/
    Silaera.col = Silaera.col % 4 /*loop if ends*/
    lastFrameTime = time
  }
    
  
  ctx.clearRect(0,0,canvas.width,canvas.height) /*clear the canvas*/
  
  /*Background*/
  ctx.drawImage(floor0,renderX(board.x,floor0.width), renderY(board.y,floor0.height),scale * floor0.width, scale * floor0.height)
  console.log("Floor rendered at: ",floor0,renderX(board.x,floor0.width), renderY(board.y,floor0.height),scale * floor0.width, scale * floor0.height)
  /*Object Rendering*/
  console.log(silaeraSheet,Silaera.col * Silaera.width, Silaera.row * Silaera.height, Silaera.width, Silaera.height, renderX(Silaera.xpos,Silaera.width), renderY(Silaera.ypos,Silaera.height), 
Silaera.width * scale, Silaera.height * scale)
  ctx.drawImage(
    silaeraSheet,
    Silaera.col * Silaera.width, 
    Silaera.row * Silaera.height, 
    Silaera.width, 
    Silaera.height, 
    renderX(Silaera.xpos,Silaera.width), 
    renderY(Silaera.ypos,Silaera.height), 
    Silaera.width * scale, 
    Silaera.height * scale) /*draw Silaera frame*/
  console.log("Silaera rendered at:",centre.x,scale,cam.x,Silaera.xpos)
  //console.log(centre.x - cam.x * scale)
  if (Silaera.xpos + 1 < 64){
  Silaera.xpos ++
  cam.x = Silaera.xpos
  requestAnimationFrame(cycle) /*loop*/
  }
}
console.log("beginning loop")
silaeraSheet.onload = setTimeout(function() {
cycle()
},103)
