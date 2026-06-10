const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize",resizeCanvas);

let score = 0;
let gameRunning = true;

const scoreText = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const gameOverBox = document.getElementById("gameOver");

const player={
x:window.innerWidth/2,
y:window.innerHeight-120,
size:25
};

const bullets=[];
const enemies=[];

function shoot(){
bullets.push({
x:player.x,
y:player.y-20,
r:4
});
}

setInterval(()=>{
if(gameRunning) shoot();
},200);

function spawnEnemy(){
enemies.push({
x:Math.random()*canvas.width,
y:-30,
size:20+Math.random()*25,
speed:2+Math.random()*3
});
}

setInterval(()=>{
if(gameRunning) spawnEnemy();
},700);

canvas.addEventListener("touchmove",(e)=>{
const touch=e.touches[0];
player.x=touch.clientX;
player.y=touch.clientY;
});

canvas.addEventListener("mousemove",(e)=>{
player.x=e.clientX;
player.y=e.clientY;
});

function drawPlayer(){

ctx.fillStyle="#00aaff";

ctx.beginPath();
ctx.moveTo(player.x,player.y-25);
ctx.lineTo(player.x-20,player.y+25);
ctx.lineTo(player.x+20,player.y+25);
ctx.fill();
}

function gameLoop(){

if(!gameRunning) return;

ctx.clearRect(0,0,canvas.width,canvas.height);

drawPlayer();

ctx.fillStyle="yellow";

for(let i=bullets.length-1;i>=0;i--){

bullets[i].y-=10;

ctx.beginPath();
ctx.arc(
bullets[i].x,
bullets[i].y,
bullets[i].r,
0,
Math.PI*2
);
ctx.fill();

if(bullets[i].y<0){
bullets.splice(i,1);
}
}

ctx.fillStyle="red";

for(let i=enemies.length-1;i>=0;i--){

const enemy=enemies[i];

enemy.y+=enemy.speed;

ctx.fillRect(
enemy.x,
enemy.y,
enemy.size,
enemy.size
);

const dx=player.x-(enemy.x+enemy.size/2);
const dy=player.y-(enemy.y+enemy.size/2);

if(Math.sqrt(dx*dx+dy*dy)<enemy.size){

gameRunning=false;

finalScore.textContent=score;
gameOverBox.style.display="block";

return;
}

for(let j=bullets.length-1;j>=0;j--){

if(
bullets[j].x>enemy.x &&
bullets[j].x<enemy.x+enemy.size &&
bullets[j].y>enemy.y &&
bullets[j].y<enemy.y+enemy.size
){

enemies.splice(i,1);
bullets.splice(j,1);

score+=10;
scoreText.textContent=score;

break;
}
}
}

requestAnimationFrame(gameLoop);
}

function restartGame(){

score=0;

scoreText.textContent=0;

bullets.length=0;
enemies.length=0;

gameRunning=true;

gameOverBox.style.display="none";

gameLoop();
}

gameLoop();