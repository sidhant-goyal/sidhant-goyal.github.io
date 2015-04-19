var canvasBg=document.getElementById('canvasBg');
var ctxBg=canvasBg.getContext('2d');
var canvasBg1=document.getElementById('canvasBg1');
var ctxBg1=canvasBg1.getContext('2d');	
var canvasJet=document.getElementById('canvasJet');
var ctxJet=canvasJet.getContext('2d');
var canvasEnemy=document.getElementById('canvasEnemy');
var ctxEnemy=canvasEnemy.getContext('2d');
var canvasSc=document.getElementById('score');
var ctxSc=canvasSc.getContext('2d');

var mouseX,mouseY;
var jet=new Jet();

var isPlayingGame=false;
var requestAnimFrame=window.requestAnimationFrame||
					 window.webkitRequestAnimationFrame||
					 window.mozRequestAnimationFrame||
					 window.msRequestAnimationFrame||
					 window.oRequestAnimationFrame;
						 
	
var score=0;
var enemies=[];
var spawnAmount=5;

	
	var gameWidth=canvasBg.width;
	var gameHeight=canvasBg.height;
	
	//loading an imageSprite
	var imageBgSprite= new Image();
	imageBgSprite.src="assets/sprite.png";
	imageBgSprite.addEventListener('load',init,false);
	
var bgDrawX1=0;
var bgDrawX2=1600;
var bgDrawX3=0;
var bgDrawX4=1600;




function moveBg()
{
	bgDrawX1-=2.5;
	bgDrawX2-=2.5;
	if(bgDrawX1<=-1600)
	{
		bgDrawX1=1600;
	}
	else if(bgDrawX2<=-1600)
	{
		bgDrawX2=1600;	
	}
drawBg();	
}

	
function moveBg1()
{
	bgDrawX3-=2;
	bgDrawX4-=2;
	if(bgDrawX3<=-1600)
	{
		bgDrawX3=1600;
	}
	else if(bgDrawX4<=-1600)
	{
		bgDrawX4=1600;	
	}	
drawBg1();
}
	
	

   
//main functions
function init()
{	
	
	enemies.length=0;
	score=0;	
	spawnEnemy(spawnAmount);
	drawMenu();
	
	document.removeEventListener('keydown',checkKeyEnd,false);
	document.removeEventListener('click',mouseClickEndScreen,false);
	
	document.addEventListener('click',mouseClickStartScreen,false);
	document.addEventListener('keydown',checkKey,false);
}
	

function playGame()
{	
	
	jet.drawX=20;	
	jet.drawY=100;
	document.removeEventListener('keydown',checkKey,false);
	document.removeEventListener('click',mouseClickStartScreen,false);
	drawBg();
	drawBg1();
	ctxSc.fillText("Score: 0",651,50);
	startLoop();
	document.addEventListener('keydown',checkKeyDown,false);
	document.addEventListener('keyup',checkKeyUp,false);
	
}


function endScreen()
{		
	document.removeEventListener('keydown',checkKeyDown,false);
	document.removeEventListener('keyup',checkKeyUp,false);
	
	clearSc();//clearing score canvas
	ctxBg1.clearRect(0,0,800,600);//clearing bg1 canvas
	ctxBg.clearRect(0,0,800,600);//clearing bg canvas
	clearEnemy();
	clearjet();	
	ctxBg.drawImage(imageBgSprite,1626,0,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
	ctxBg.fillStyle="#FFFFFF";
	ctxBg.font="28px Bebas";
	ctxBg.fillText(score,594,292);
	
	document.addEventListener('keydown',checkKeyEnd,false);
	document.addEventListener('click',mouseClickEndScreen,false);
		
}



function spawnEnemy(number)
{
	for(var i=0;i<number;i++)
	{
		enemies[enemies.length]=new Enemy();
		
	}	
}
	
	
function drawAllEnemies()
{
		clearEnemy();
		for(var i=0;i<enemies.length;i++)
		{
			enemies[i].draw();
		}
	}
		
	
function drawBg()
{
	
	ctxBg.clearRect(0,0,800,600);
	ctxBg.drawImage(imageBgSprite,0,0,1600,gameHeight,bgDrawX1,0,1600,gameHeight);
	ctxBg.drawImage(imageBgSprite,0,0,1600,gameHeight,bgDrawX2,0,1600,gameHeight);
}
	
function drawBg1()
{	
	ctxBg1.clearRect(0,0,800,600);
	ctxBg1.drawImage(imageBgSprite,0,1479,1600,gameHeight,bgDrawX3,0,1600,gameHeight);
	ctxBg1.drawImage(imageBgSprite,0,1479,1600,gameHeight,bgDrawX4,0,1600,gameHeight);	
}

function startLoop()
{
	isPlaying=true;
	loop();		
}	

function loop()
{
	if(isPlaying)
	{
	moveBg();
	moveBg1();
	jet.draw();	
	drawAllEnemies();
	Score();
	requestAnimFrame(loop);	
	}
}
	

	
function stopLoop()
{
	isPlaying=false;
}
	
function drawMenu()
{
	ctxBg.drawImage(imageBgSprite,0,789.6,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
}
//end of main functions


	
	
	
	
//jet functions
	function Jet()
	{   
		this.srcX=0;
		this.srcY=702;
		this.drawX=20;
		this.drawY=100;
		this.width=109;
		this.height=63;
		this.speed=3.2;
		this.isUpKey=false;	
		this.isDownKey=false;
		this.isLeftKey=false;
		this.isRightKey=false;
		this.isSpacebar=false;
		this.isShooting=false;
		this.bullets=[];
		this.currentBullet=0;
		this.noseX=this.drawX+this.width;
		this.noseY=this.drawY+33;
		this.explosion2=new Explosion2();
		for(var i=0;i<30;i++)
		{
			this.bullets[this.bullets.length]=new Bullet();			
		}
	}

Jet.prototype.draw=function()
	{
		clearjet();
		this.hitEnemy();
		this.movingJet();
		this.noseX=this.drawX+this.width;
		this.noseY=this.drawY+33;
		this.checkShooting();
		this.drawAllBullets();
	ctxJet.drawImage(imageBgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

//moving the jet	
Jet.prototype.movingJet=function ()
{
		if(this.drawY<0)
		{
			if(this.isUpKey)
			{
				this.drawY=0;
			}
			if(this.isDownKey)
			{	
				this.drawY+=this.speed;			
			}
		
			if(this.isLeftKey)
			{
				this.drawX-=this.speed;				
			}
			if(this.isRightKey)
			{
				this.drawX+=this.speed;			
			}	
		
		}
		
		else if(this.drawX<0)
		{
			if(this.isUpKey)
			{
				this.drawY-=this.speed;
			}
			if(this.isDownKey)
			{	
				this.drawY+=this.speed;			
			}
		
			if(this.isLeftKey)
			{
				this.drawX=0;				
			}
			if(this.isRightKey)
			{
				this.drawX+=this.speed;			
			}	
		
		}
		
		else if(this.drawX>gameWidth-this.width)
		{
			if(this.isUpKey)
			{
				this.drawY-=this.speed;
			}
			if(this.isDownKey)
			{	
				this.drawY+=this.speed;			
			}
		
			if(this.isLeftKey)
			{
				this.drawX-=this.speed;			
			}
			if(this.isRightKey)
			{
				this.drawX=gameWidth-this.width;		
			}	
		
		}
		
		else if(this.drawY>gameHeight-this.height)
		{
			if(this.isUpKey)
			{
				this.drawY-=this.speed;
			}
			if(this.isDownKey)
			{	
				this.drawY=gameHeight-this.height;			
			}
		
			if(this.isLeftKey)
			{
				this.drawX-=this.speed;			
			}
			if(this.isRightKey)
			{
				this.drawX+=this.speed;		
			}	
		
		}
		
		
		else
		{
			if(this.isUpKey)
			{
				this.drawY-=this.speed;	
			}
			if(this.isDownKey)
			{	
				this.drawY+=this.speed;			
			}
		
			if(this.isLeftKey)
			{
				this.drawX-=this.speed;				
			}
			if(this.isRightKey)
			{
				this.drawX+=this.speed;			
			}
			
		}
		
};

//Jet shooting bullet
Jet.prototype.drawAllBullets=function()
	{
		for(var i=0;i<this.bullets.length;i++)
		{
			if(this.bullets[i].drawX>=0) this.bullets[i].draw();//checkHit is included in this, go to bullets.draw()	
			if(this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw();
	
		}
};

Jet.prototype.checkShooting=function(){ 
		
		if(this.isSpacebar && !this.isShooting)
		{	
			this.isShooting=true;
			this.bullets[this.currentBullet].fire(this.noseX,this.noseY);
			this.currentBullet++;
			if(this.currentBullet>=this.bullets.length) this.currentBullet = 0;			
		}
		else if(!this.isSpacebar)
		{
			this.isShooting=false;	
			
		}
};

Jet.prototype.hitEnemy=function ()
{
		for(var i=0;i<enemies.length;i++)
		{
		if(
				
				(	
					(this.drawX>=enemies[i].drawX && this.drawX<=enemies[i].drawX+enemies[i].width )&&
					(this.drawY>=enemies[i].drawY && this.drawY<=enemies[i].drawY+enemies[i].height)
				)
				||
				(
					(this.drawX+this.width>=enemies[i].drawX && this.drawX+this.width<=enemies[i].drawX+enemies[i].width) &&
					(this.drawY+this.height>=enemies[i].drawY && this.drawY+this.height<=enemies[i].drawY+enemies[i].height)
				)
				||
				(
					this.drawX+this.width>=enemies[i].drawX &&
					this.drawX+this.width<=enemies[i].drawX+enemies[i].width&&
					this.drawY>enemies[i].drawY-enemies[i].height/2&&
					this.drawY<enemies[i].drawY+enemies[i].height
				)
				
		  )
			
			{   
				this.explosion2.drawX=this.drawX+this.width-50;
				this.explosion2.drawY=this.drawY;
				this.explosion2.hasHit=true;
				this.explosion2.draw()
				enemies[i].recycleEnemy();
				this.drawX=-200;
				stopLoop();
				for(var i=0; i<this.bullets.length;i++)
				{
					this.bullets[i].drawX=-20;
					
				}
				setTimeout(endScreen,1000);
				//document.removeEventListener('keydown',checkKeyDown,false);
				//document.removeEventListener('keyup',checkKeyUp,false);
				
				
				
				
				
				
				
				
				
			}
			//this.bullets.explosion.draw();
		}			
};


//end Jet shooting bullet
	

  function clearjet()
	{
	    ctxJet.clearRect(0,0,800,600);
	}
//end of jet functions






//bullet functions
function Bullet()
	{   
		this.srcX=0;
		this.srcY=671;
		this.drawX=-20;
		this.drawY=0;
		this.width=5.5;
		this.height=5.5;	
		this.explosion=new Explosion();
	}
	
	
Bullet.prototype.draw=function()
{
		this.drawX+=6;
		ctxJet.drawImage(imageBgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
		this.checkHitEnemy();	
		if(this.drawX>gameWidth) this.recycle();
		
};

Bullet.prototype.fire=function(startX,startY)//to set the x,y position of new bllt on prsing space bar
{
		this.drawX=startX;
		this.drawY=startY;
};

Bullet.prototype.recycle=function()//to set the x,y position of new bllt on prsing space bar
{
		this.drawX=-20;
};

Bullet.prototype.checkHitEnemy=function()//to set the x,y position of new bllt on prsing space bar
{
		for(var i=0;i<enemies.length;i++)
		{
			if(this.drawX>=enemies[i].drawX && 
			   this.drawX<=enemies[i].drawX+enemies[i].width&&
			   this.drawY>=enemies[i].drawY && 
			   this.drawY<=enemies[i].drawY+enemies[i].height)
			{
				this.explosion.drawX=enemies[i].drawX;
				this.explosion.drawY=enemies[i].drawY;
				this.explosion.hasHit=true;
				this.recycle();
				enemies[i].recycleEnemy();
				score++;
			}
		}
};
//bullet functions

function clearSc()
{
	ctxSc.clearRect(0,0,800,600);
	
}
function Score()
{
	
	clearSc();
	ctxSc.fillStyle="#000000";
	ctxSc.font="28px Bebas";
	ctxSc.fillText("Score: "+score,651,50);
		
}
	
	
//explosion functions
function Explosion()
{
		this.srcX=1521;
		this.srcY=630;
		this.drawX=0;
		this.drawY=0;
		this.width=69;
		this.height=62;	
		this.currentFrame=0;
		this.totalFrame=10;
		this.hasHit=false;
}

Explosion.prototype.draw=function()
{
	if(this.currentFrame<=this.totalFrame)
	{
		ctxJet.drawImage(imageBgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.currentFrame++;
	
	}
	else
	{
		this.hasHit=false;	
		this.currentFrame=0;	
	}
};

function Explosion2()
{
		this.srcX=1521;
		this.srcY=630;
		this.drawX=0;
		this.drawY=0;
		this.width=69;
		this.height=62;	
		this.currentFrame=0;
		this.totalFrame=10;
		this.hasHit=false;
}

Explosion2.prototype.draw=function()
{
	if(this.currentFrame<=this.totalFrame)
	{
	ctxJet.drawImage(imageBgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.currentFrame++;
	
	}
	else
	{
		this.hasHit=false;	
		this.currentFrame=0;	
	}
};
//explosion functio


	
	
	
	
//event functions





function mouseClickStartScreen(e)
{
	var xL=359,xR=441,yT=333,yB=370;//start button
	
	mouseX=e.pageX-canvasBg.offsetLeft;
	mouseY=e.pageY-canvasBg.offsetTop;
	
	if(mouseX>=xL && mouseX<=xR && mouseY<=yB && mouseY>=yT)
	{
		playGame();
	}
}

function mouseClickEndScreen(e)
{
	var xL=499,xR=645,yT=307,yB=344;//reset button
	var xLt=698,xRt=724,yTt=553,yBt=575;//twitter button
	var xLf=743,xRf=767,yTf=553,yBf=576;//twitter button
	
	mouseX=e.pageX-canvasBg.offsetLeft;
	mouseY=e.pageY-canvasBg.offsetTop;
	
	if(mouseX>=xL && mouseX<=xR && mouseY<=yB && mouseY>=yT)
	{
		init();
	}
	
	else if(mouseX>=xLt && mouseX<=xRt && mouseY<=yBt && mouseY>=yTt)
	{
		url="https://twitter.com/SidoFido";
		//window.open(url);
		window.location="https://www.twitter.com/SidoFido";
	}
	
	else if(mouseX>=xLf && mouseX<=xRf && mouseY<=yBf && mouseY>=yTf)
	{
		url2="https://www.facebook.com/sidhant.goyal.16";
		window.open(url2);	
		//window.location="https://www.facebook.com/sidhant.goyal.16";
	}	
}

function mouseHover(e)
{
	//var xL=531,xR=611,yT=306,yB=344;//reset button
	var xLt=698,xRt=724,yTt=553,yBt=575;//twitter button
	//var xLf=743,xRf=767,yTf=553,yBf=576;//twitter button
	
	mouseX=e.pageX-canvasBg.offsetLeft;
	mouseY=e.pageY-canvasBg.offsetTop;
	
	document.getElementById('coordinates').innerHTML="X="+mouseX+" Y="+mouseY;
}
function checkKey(e)
{
	var KeyID=e.keyCode || e.which;
	if(KeyID==32) playGame();		
	
}

function checkKeyEnd(e)
{
	var KeyID=e.keyCode || e.which;
	if(KeyID==32) init();		
	
}



	function checkKeyDown(e)
	
	{
		 var keyID= e.keyCode|| e.which;
		 		 
		 if(keyID==38|| keyID==87)	{//up
			e.preventDefault();
			jet.isUpKey=true;
		}
				
		 if(keyID==39 || keyID==68) {//right
			e.preventDefault();
			jet.isRightKey=true;
		}
		
		 if(keyID==40  || keyID==83)	{//down
			e.preventDefault();
			jet.isDownKey=true;
		}	
		
		
		if(keyID==37 || keyID==65) {//left
			e.preventDefault();
			jet.isLeftKey=true;
		}	
		
		if(keyID==32) {//spacebar
			
			e.preventDefault();
			jet.isSpacebar=true;
			
		}	
	}
	
	
	function checkKeyUp(e)
	
	{
		 var keyID= e.keyCode || e.which;
				 
		 if(keyID==38 || keyID==87)	{//up
			
			e.preventDefault();
			jet.isUpKey=false;
		}
				
		 if(keyID==39 || keyID==68) {//right
			
			e.preventDefault();
			jet.isRightKey=false;
		}
		
		 if(keyID==40 || keyID==83)	{//down
			
			e.preventDefault();
			jet.isDownKey=false;
		}	
		
		
		if(keyID==37 || keyID==65) {//left
			
			e.preventDefault();
			jet.isLeftKey=false;
		}	
		
		if(keyID==32) {//spacebar
			
			e.preventDefault();
			jet.isSpacebar=false;
		}	
	}	
	
	
//end of event functions







//enemy functions
	function Enemy()
	{
	this.srcX=0;
	this.srcY=608;
	this.width=109;
	this.height=62;
	this.speed=4;
	this.drawX=Math.floor(Math.random()*1500)+gameWidth;
	this.drawY=Math.floor(Math.random()*400);
	}

Enemy.prototype.draw=function(){
	
	this.drawX-=this.speed;	
	ctxEnemy.drawImage(imageBgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);	
	this.checkEscaped();
};

Enemy.prototype.checkEscaped=function(){
	
	if(this.drawX+this.width<=0)
	{  
		this.recycleEnemy();
	}
};

Enemy.prototype.recycleEnemy=function(){
	
	this.drawX=Math.floor(Math.random()*1000)+gameWidth;
	this.drawY=Math.floor(Math.random()*400);	    
};

	function clearEnemy()
	{
		ctxEnemy.clearRect(0,0,800,600);	
	}
//end of enemy functions

