const canvas = document.getElementById("game") /*grab canvas*/
const ctx = canvas.getContext('2d') /*context for drawing on canvas*/
const scale = Math.floor(window.innerWidth/320) > Math.floor(window.innerHeight/180) ? Math.floor(window.innerHeight/180) : Math.floor(window.innerWidth/320) /*finds the largest possible integer scale value that the canvas can take up and saves it so everything can be resized uniformly*/
canvas.width = 320 * scale /*set the width and height according to scale*/
canvas.height = 180 * scale
centre = {x: 160 * scale, y: 90 * scale}
console.log("initialisation:", canvas.width +" x " + canvas.height)

function rescale(){
  canvas = document.getElementById("game") /*grab canvas*/
  ctx = canvas.getContext('2d') /*context for drawing on canvas*/
  scale = Math.floor(window.innerWidth/320) > Math.floor(window.innerHeight/180) ? Math.floor(window.innerHeight/180) : Math.floor(window.innerWidth/320) /*finds the largest possible integer scale value that the canvas can take up and saves it so everything can be resized uniformly*/
  canvas.width = 320 * scale /*set the width and height according to scale*/
  canvas.height = 180 * scale
  centre = {x: 160 * scale, y: 90 * scale}
}

/*floor0*/
board = {x:0,y:0}
const floor0 = new Image()
floor0.src = "./Assets/Map/floor0 vestibule.png"
const cam = {x:0, y:0}
console.log("camera created")
/*turn into:*/
class Area{
  constructor(type,spritesheet,boundaries){
    this.type = type
    this.sheet = new Image()
    this.sheet.src = spritesheet
    this.boundaries = boundaries
  }
  render(){
    ctx.drawImage(
      this.sheet,
      renderX(0,this.sheet.width), 
      renderY(0,this.sheet.height),
      scale * this.sheet.width, 
      scale * this.sheet.height)
  }
  inBounds(xCheck,yCheck){
    
    //if in bounds
    var region=this.boundaries.length-1
    for(region;region>-1;region--){
      //console.log(region,xCheck,yCheck,this.boundaries[region],(this.boundaries[region].xMin<=xCheck<=this.boundaries[region].xMax),(this.boundaries[region].yMin<=yCheck<=this.boundaries[region].yMax))
      if(
        (this.boundaries[region].xMin<=xCheck&& xCheck<=this.boundaries[region].xMax)
        && (this.boundaries[region].yMin<=yCheck&& yCheck<=this.boundaries[region].yMax)
      ){
        return true}
    }
    //if out of bounds
    return false
  }

}
vestibule = new Area("floor0","./Assets/Map/Floor0 vestibule.png",[{xMin:-72,xMax:72,yMin:-24,yMax:44}])

/*takes a cartesian x coordinate and the width of the image and returns the x centre of the image for canvas*/
function renderX(x,width){
  //console.log("X:",centre.x,cam.x)
  return (x*scale + centre.x - cam.x*scale) - scale*width / 2
}
/*takes a cartesian y coordinate and the height of the image and returns the y centre of the image for canvas*/
function renderY(y,height){
  //console.log("Y:",centre.y,cam.y)
  return (-1 * y*scale + centre.y + cam.y*scale) - scale*height/2 
}
ctx.imageSmoothingEnabled = false
console.log("Rendering defined")

class Ui{
  constructor(imagePath,row,column,x,y,width,height,sheetInfo){
    this.sheet = new Image()
    this.sheet.src = imagePath
    this.frame = {row:row, col:column, width:width, height:height}
    this.sheetInfo = sheetInfo /*how many columns each row has*/
    this.position = {x:x, y:y}
    this.hover = false
  }
  render(){
    this.sheet.onload = 
    ctx.drawImage(
      this.sheet,
      this.frame.col*this.frame.width,
      this.frame.row*this.frame.height, 
      this.frame.width,
      this.frame.height,
      (this.position.x*scale + centre.x) - scale*this.frame.width / 2,
      (-1 * this.position.y*scale + centre.y) - scale*this.frame.height/2,
      scale * this.frame.width, 
      scale * this.frame.height)
  }
  frameIncrement(inc){ /*increment the current animation's frame*/
     /*workaround for decrement issue: 
    increment by number of frames
    this effectively makes it travel backwards*/
    for(inc; inc<0;inc){
      inc+= this.sheetInfo[this.frame.row]
    }

    this.frame.col = (this.frame.col + inc) % this.sheetInfo[this.frame.row]
   
  }
  animationChange(spritesheetRow){ /*change the row for the spritesheet*/
    if(spritesheetRow < this.sheetInfo.length){
      this.frame.row = spritesheetRow
      this.frame.col = 0
    }
    else{
      console.log("animation out of range")
    }
  }
  updatePosition(newX,newY){ /*for instantateously moving position*/
    this.position = {x:newX,y:newY}
  }
  frameSet(col){
    for(col; col<0;col){
      col+= this.sheetInfo[this.frame.row]
    }

    this.frame.col = col % this.sheetInfo[this.frame.row]
  }
}
class Entity{
  constructor(type,imagePath,row,column,x,y,width,height,sheetInfo){
    this.type = type /*the kind of Entity it is such as "Nigelas", "Cavro" or "Blockade"*/
    this.sheet = new Image()
    this.sheet.src = imagePath
    this.frame = {row:row, col:column, width:width, height:height} /*information about spritesheeting*/
    this.sheetInfo = sheetInfo /*how many columns each row has*/
    this.position = {x:x, y:y}
    this.vector = {x:0,y:0}
  }
  render(){ /*doesn't work outside of a loop?*/
    this.sheet.onload = 
    ctx.drawImage(
      this.sheet,
      this.frame.col*this.frame.width,
      this.frame.row*this.frame.height, 
      this.frame.width,
      this.frame.height,
      renderX(this.position.x,this.frame.width),
      renderY(this.position.y ,this.frame.height), 
      scale * this.frame.width, 
      scale * this.frame.height
    )
    /*for all your rendering issues:*/
    //console.log(this.sheet,this.frame.col*this.frame.width,this.frame.row * this.frame.height, this.frame.width,this.frame.height,renderX(this.position.x,this.frame.width),renderY(this.position.y,this.frame.height), scale * this.frame.width, scale * this.frame.height)
  }
  frameIncrement(inc){ /*increment the current animation's frame*/
     /*workaround for decrement issue: 
    increment by number of frames
    this effectively makes it travel backwards*/
    for(inc; inc<0;inc){
      inc+= this.sheetInfo[this.frame.row]
    }

    this.frame.col = (this.frame.col + inc) % this.sheetInfo[this.frame.row]
   
  }
  animationChange(spritesheetRow){ /*change the row for the spritesheet*/
    if(spritesheetRow < this.sheetInfo.length){
      this.frame.row = spritesheetRow
      this.frame.col = 0
    }
    else{
      console.log("animation out of range")
    }
  }
  updatePosition(newX,newY){ /*for instantateously moving position*/
    this.position = {x:newX,y:newY}
  }
  getPosition(){
    return this.position
  }
}
class Character extends Entity{
  constructor(type,imagePath,row,column,x,y,width,height,stats,sheetInfo){
    super(type,imagePath,row,column,x,y,width,height,sheetInfo)
    this.stats = {str:stats[0],agl:stats[1],vit:stats[2],int:stats[3],spr:stats[4]}
    this.health  = this.getMaxHealth()

  }
  updateVector(targetX,targetY){ /*creates a vector to the target*/
    this.vector = {x:targetX - this.position.x,y:targetY - this.position.y}

  }
  vectorTravel(){
    this.position.x += this.vector.x
    this.position.y += this.vector.y

  }
  getModifier(stat){
    return Math.ceil(Math.abs(stat-7.5)) * Math.abs(stat-7.5)/(stat-7.5)
  }
  getMaxHealth(){
    return 2 * this.stats.vit + Math.ceil(/*level:*/3 + (this.getModifier(this.stats.vit + 8)/4))
  }

}
class Queue{/*Circular Queue*/
  constructor(size){
    this.characters = new Array(size)
    this.frontPointer = 0
    this.rearPointer = -1
    this.size = size
    this.count = 0
  }

  /*Queue methods:*/
  enqueue(character){
    if(this.full()){return 'combat full'}
    this.rearPointer = (this.rearPointer+1)%this.size
    this.count++
    this.characters[this.rearPointer] = character
  }
  dequeue(){
    if(this.empty()){return 'no combat'}
    const removed = this.characters[this.frontPointer]
    this.count--
    this.frontPointer = (this.frontPointer+1)%this.size
    //if(this.empty()){
      //this.frontPointer = 0
      ///this.rearPointer = -1
    //}
    return removed
  }
  peek(){
    if(this.empty()){return 'no combat'}
    return this.characters[this.frontPointer]
  }
  full(){
    return this.count === this.characters.length
  }
  empty(){
    return this.count === 0
  }

 
}
class TurnQueue extends Queue{/*Modified Circular Queue*/
  constructor(size){
    super(size)
    this.alternate=0
  }
 /*Unique methods:*/
  createEncounter(participants){
    /*merge sort*/

  }
  sortEncounter(){/*takes entire encounter and sorts it by speed value*/
    
  }
  processTurn(){/*dequeues character to the back of the queue*/
    
  }
  renderOrder(){/*renders the turn order*/
    for(n=0;n<this.count;n++){
      /*this makes a tesselated row of hexagons!*/
      portraits.animationChange((Math.floor(initialPortrait)+n)%9)
      portraits.frameIncrement(n==0?1:0)
      portraits.updatePosition(-160+18+26*n,90-16-14*((n+Math.floor(this.alternate))%2))
      portraits.render()
    }
    
  }
  alternate(){
    this.alternate = (this.alternate + 1)%2
  }
}
class Hashtable {
  constructor(size){
    this.table = new Array(size)
    this.size = size
  }
  get(location){
    var index = this.hash(location)
    var record = this.table[index]
    if(record==undefined){return null}
    var n = record.length - 1
    for(n;n-1;n--){
      if(rec[n].llocation == location){
        return rec[n].data
      }
    }
    return null
  }
  set(location,data){
    var index = this.hash(location)
    if (!this.table[index]){ /*no collisions - best case*/
      this.table[index]=[]
    }
    for(var pair of this.table[index]){
      if(pair.location == location){
        pair.data = data
        return
      }
    }
    this.table[index].push({location:location,data:data})
  }
  hash(input){
    const salt = "pleasedon'tcollide"
    input = input + salt
    var output = 0
    const prime = 419
    var n = input.length - 1
    for(n;n>=0;n--){
      output += input.charCodeAt(n) * (n+5) * 419
    }
    return output % this.size
  }
}
class PriorityQueue {
  constructor(size){
    this.data = new Array(size)
  }
}
class Stack{
  constructor(size){
    this.pointer = -1
    this.data = new Array(size)
  }
  push(data){
    if(this.pointer===this.data.length-1){return false}
    this.pointer ++ 
    this.data[this.pointer] = data
  }
  pop(){
    if(this.isEmpty()){return false}
    this.pointer --
    return this.data[this.pointer+1]
  }
  peek(){
    if(this.isEmpty()){return false}
    return this.data[this.pointer]
  }
  isEmpty(){
    if(this.pointer==-1){return true}
  }
}
class Level{
  constructor(){
    this.objects = []
    this.renderStack = new Stack(64)
  }
  addObject(object){
    this.objects.push(object)
  }
  renderObjects(){
    if(! this.renderStack.isEmpty()){
      while (! this.renderStack.isEmpty()){
        this.renderStack.pop()
      }
    }
    /*Sort the objects by their Y coordinates*/
    this.objects = this.mergeSort(this.objects)
    //console.log(this.objects)

    /*push objects into a stack to render then*/
    for(var n=this.objects.length-1;n>-1;n--){
      this.renderStack.push(this.objects[n])
    }
    //console.log(this.objects,this.renderStack.data)
    /*render each object in the stack*/
    while(! this.renderStack.isEmpty()){
      this.renderStack.pop().render()
    }
    
    //console.log(this.renderStack.pointer)
  }
  mergeSort(data){
    if (data.length<=1) {return data}
    const centre = Math.floor(data.length/2)
    const left = this.mergeSort(data.slice(0,centre))
    const right = this.mergeSort(data.slice(centre))
    return this.merge(left,right)
  }
  merge(leftData,rightData){
    var result = []
    var leftIndex = 0
    var rightIndex = 0
    while (leftIndex < leftData.length && rightIndex < rightData.length){
      if(leftData[leftIndex].getPosition().y > rightData[rightIndex].getPosition().y){
        result.push(leftData[leftIndex])
        leftIndex ++
      }
      else{
        result.push(rightData[rightIndex])
        rightIndex++
      }
    }
    //console.log(result.concat(leftData.slice(leftIndex),rightData.slice(rightIndex)))
    return result.concat(leftData.slice(leftIndex),rightData.slice(rightIndex))
  }



}

ctx.clearRect(0,0,canvas.width,canvas.height) /*clear the canvas*/
ctx.drawImage(floor0,renderX(board.x,floor0.width), renderY(board.y,floor0.height),scale * floor0.width, scale * floor0.height)
Nigelas = new Character("Nigelas","./Assets/Characters/Nigelas.png",0,0,-32,-13,64,64,[8,8,10,7,2],[6])
Kauplaire = new Character("Kauplaire","./Assets/Characters/Kauplaire.png",0,0,0,0,64,64,[8,9,5,8,8],[6])
Calian = new Character("Calian","./Assets/Characters/Calian.png",0,3,22,-20,64,64,[5,9,7,11,6],[6])
Spectre = new Character("Spectre","./Assets/Characters/Spectre.png",0,0,13,20,64,64,[7,9,6,7,9],[6])
Cavro = new Character("Cavro","./Assets/Characters/Cavro.png",0,0,-42,36,64,64,[7,9,6,8,4],[1])
Husk = new Character("Husk","./Assets/Characters/Husk.png",0,0,47,28,64,64,[11,4,11,4,4],[1])
Warden = new Character("Warden","./Assets/Characters/Warden.png",0,0,-13,49,64,64,[9,7,9,8,5],[1])
Cultist = new Character("Cultist","./Assets/Characters/Cultist.png",0,0,60,-3,64,64,[5,7,6,9,9],[6])
//smite = new Entity("Effect","./Assets/Effects/spells-damage.png",0,0,16,2,32,32,[8,4,6])
//stellarCrash = new Entity("Effect","./Assets/Effects/spells-damage.png",2,5,16,32,32,32,[8,5,6])
portraits = new Ui("./Assets/Icons/portraits-combat.png",0,0,60,-60,32,32,[2,2,2,2,2,2,2,2,2])
menu = new Ui("./Assets/Icons/player-actions.png",3,0,-60,-60,24,24,[6,6,6,2])
lowerIcon = new Ui("./Assets/Icons/portraits-idle.png",0,1,-40,-70,32,32,[2,2,2])

currentLevel = new Level()
currentLevel.addObject(Nigelas)
currentLevel.addObject(Kauplaire)
currentLevel.addObject(Calian)
currentLevel.addObject(Spectre)
currentLevel.addObject(Cavro)
currentLevel.addObject(Husk)
currentLevel.addObject(Warden)
currentLevel.addObject(Cultist)

//Nigelas.render()
//Kauplaire.render()
//Calian.render()
//console.log(Nigelas.stats.vit, Calian.stats.str)
//console.log(Nigelas.getModifier(Nigelas.stats.vit),Calian.getModifier(Calian.stats.str))
var initialPortrait = 0
var alternate = 0
var frame = 0
function renderLoop(){
    frame = (frame+1)%5
    ctx.clearRect(0,0,canvas.width,canvas.height) /*clear the canvas*/
    backgroundRendering()
    objectRendering()
    interfaceRendering()
}

function backgroundRendering(){ /*draws the basic floors and layers all characters are in front of*/
  ctx.drawImage(floor0,renderX(board.x,floor0.width), renderY(board.y,floor0.height),scale * floor0.width, scale * floor0.height)
}
function objectRendering(){ /*draws the layers and objects that may overlap each other in the correct order*/
  /*TEMPORARY:*/
    //Nigelas.render()
    //Kauplaire.render()
    //Calian.render()
    if(frame==0){
    Calian.frameIncrement(1)
    Nigelas.frameIncrement(1)
    Kauplaire.frameIncrement(1)
    Spectre.frameIncrement(1)
    Cultist.frameIncrement(1)
    }
    currentLevel.renderObjects()
    //smite.render()
    //if(frame==0){smite.frameIncrement(1)}
    //stellarCrash.render()
    //if(frame==0){stellarCrash.frameIncrement(-1)}
}
function interfaceRendering(){ /*draws all the non-world elements such as menus and icons*/
  /*TEMPORARY:*/

  /*Turn Order:*/
    for(n=0;n<9;n++){
      /*this makes a tesselated row of hexagons!*/
      portraits.animationChange((Math.floor(initialPortrait)+n)%9)
      portraits.frameIncrement(n==0?1:0)
      portraits.updatePosition(-160+18+26*n,90-16-14*((n+Math.floor(alternate))%2))
      //console.log(`${90-16-14*((n+Math.floor(alternate))%2)}`)
      portraits.render()
    }
    if(frame==0){alternate = (alternate + 0.125)%2}
    if(frame==0){initialPortrait = (initialPortrait+0.125)%9}


    /*Menu (left):*/
    menu.animationChange(3)
    for(n=0;n<2;n++){
      menu.frameIncrement(1)
      menu.updatePosition(-140+n*25,-70)
      menu.render()
    }
    menu.frameIncrement(1)
    menu.animationChange(initialPortrait<3?Math.floor(initialPortrait):1)
    menu.frameIncrement(-1)

    /*Menu (portrait):*/
    lowerIcon.animationChange(initialPortrait<3?Math.floor(initialPortrait):1)
    lowerIcon.frameSet(initialPortrait<3?1:0)
    lowerIcon.render()

    /*Menu (Player actions)*/
    for(n=5;n>-1;n--){
      menu.updatePosition(170+(n-6)*25,-70)
      //console.log(n, 140+(n-6)*25)
      menu.render()
      menu.frameIncrement(-1)
    }
}
var countdown = 200
document.addEventListener('keydown',keyDown)
//const movementKeys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"]
function keyDown(event){
  if(event.code == "ArrowRight"){
    cam.x += scale
  }
  else if(event.code == "ArrowLeft"){
    cam.x -= scale
  }
  if(event.code == "ArrowUp"){
    cam.y += scale
  }
  else if(event.code == "ArrowDown"){
    cam.y -= scale
  }
  /*TEMPORARY:*/
  if (vestibule.inBounds(cam.x,cam.y) === true){
  Kauplaire.updatePosition(cam.x,cam.y)
  }
  //console.log(cam.x,cam.y)
}

setInterval(renderLoop, 33)

/*TO DO:
- make a hashmap for looking data up e.g. to instantiate a cavro
- make a priority queue to replace the turn queue
- replace merge sort for insertion sort AND YAP ABOUT IT!!!!
- finish and clarify boundaries for vestibule (floor 0)
- make the turn order preview use the turn order
- expand the entity and character classes
- make an NPC class
- make a list of true-false flags
- make buttons clickable
- tie buttons to actions
- cursors (for extra pizzaz)
- consider allowing diagonal movement
*/