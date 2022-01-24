const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.height = 700;
canvas.width = 500;
let engine;
window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
};

class Player {
  constructor() {
    this.x = canvas.width / 2 - 20;
    this.y = canvas.height - 100;
    this.w = 20;
    this.h = 40;
    this.score = 0;
  }
  move(direction) {
    switch (direction) {
      case "left":
        if (this.x <= 0) {
          this.x = 0;
        } else {
          this.x -= 20;
        }
        break;
      case "right":
        if (this.x + this.w >= canvas.width - this.w - 25) {
          this.x = canvas.width - this.w - 25;
        }
        this.x += 20;
        break;
    }
  }
}

class Obst {
  constructor() {
    this.x = Math.random() * 450;
    this.y = 0;
    this.w = Math.random() * (75 - 25) + 25;
    this.h = 10;
    this.color = this.generateRandomColor();
  }

  generateRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  obstMove() {
    this.y = this.y + 0.75;
  }
}

let obstArr = [];
function createObst() {
  obstArr.push(new Obst());
  // for (i = 0; i < 300; i++) {
  //   let i = new Obst();
  //   obstArr.push(i);
  // }
}
setInterval(createObst, 200);

// let obst1 = new Obst(Math.floor(Math.random() * 250), 250);
// let obst2 = new Obst(Math.floor(Math.random() * 350), 150);
// let obst3 = new Obst(Math.floor(Math.random() * 300), 200);
// let obst4 = new Obst(Math.floor(Math.random() * 400), 100);

// obstArr.push(obst1);
// obstArr.push(obst2);
// obstArr.push(obst3);
// obstArr.push(obst4);

const img = new Image();
img.src = "../images/car.png";
img.onload = () => {
  ctx.drawImage(img, canvas.width / 2 - 20, canvas.height - 100, 40, 80);
};

const driver = new Player();

function startGame() {
  setInterval(scoreCounter, 100);
  document.addEventListener("keydown", function (e) {
    switch (e.code) {
      case "ArrowLeft":
        driver.move("left");
        break;
      case "ArrowRight":
        driver.move("right");
        break;
    }
  });
  animate();
}

let score = 0;
function scoreCounter() {
  score += 1;
  console.log(score);
}

function animate() {
  engine = window.requestAnimationFrame(animate);
  console.log("Animating!");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, driver.x, driver.y, driver.w, driver.h);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";

  ctx.fillText("Score:" + score, 40, 30);

  for (let i = 0; i < obstArr.length; i++) {
    ctx.fillStyle = obstArr[i].color;
    ctx.fillRect(obstArr[i].x, obstArr[i].y, obstArr[i].w, obstArr[i].h);
    obstArr[i].obstMove();
    didCollide = detectCollision(driver, obstArr[i]);
    if (didCollide) {
      gameOver();
    }
  }
}

function detectCollision(player, obj) {
  if (
    player.x < obj.x + obj.w &&
    player.x + player.w > obj.x &&
    player.y < obj.y + obj.h &&
    player.y + player.h > obj.y
  ) {
    return true;
  } else {
    return false;
  }
}

function gameOver() {
  obstArr = [];
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.font = 50;
  ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2 - 30);
  ctx.fillText("Score:" + score, canvas.width / 2 - 80, canvas.height / 2);

  window.cancelAnimationFrame(engine);
}
