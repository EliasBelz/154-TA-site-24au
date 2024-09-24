import { qs, id, API_ROOT, gen, statusCheck } from './helpers.js';
'use strict';
(function() {
  const TERMINAL_GREEN = '#4cd711';
  const SCALE = 40;
  const BOUND = 800;
  // Free tiles. Lucky you.
  let snake = [{x: SCALE * 5, y: SCALE}, {x: SCALE * 4, y: SCALE} ,{ x: SCALE * 3, y: SCALE }, { x: SCALE * 2, y: SCALE }, { x: SCALE * 1, y: SCALE }, { x: SCALE * 0, y: SCALE }];
  let direction = { x: 0, y: 0 };
  let score = 0;
  let ctx;
  let gameLoopId;
  let apple = { x: 400, y: 400 };


  window.addEventListener('load', init);

  async function init() {
    id("play-again").addEventListener('click', () => {
      window.location.reload();
    });
    qs('nav button').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
    window.addEventListener('keydown', updateDirection);
    qs('#high-score span').textContent = getHighScore();
    const canvas = qs('canvas');
    ctx = canvas.getContext('2d');
    setAppleLocation();
    gameLoopId = setInterval(gameLoop, 1000 / 13); // 15 frames per second
    qs('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await addScore(id('initials').value, score);
        id('initials').value = "";
        await displayScores();
      } catch (e) {
        handleError(e);
      }
    });
    await displayScores();
  }


  function gameLoop() {
    ctx.clearRect(0, 0, BOUND, BOUND);
    drawApple();
    if (direction.x !== 0 || direction.y !== 0) {
      const {x, y} = snake[0];
      const newX = x + direction.x * SCALE;
      const newY = y + direction.y * SCALE;
      snake.unshift({x: newX, y: newY});
      if (newX === apple.x && newY === apple.y) {
        updateScore();
        setAppleLocation();
      } else {
        snake.pop();
      }
    }
    snake.forEach(({x, y}) => drawSquare(x, y));
    if (isOutOfBounds() || isEatingItself()) {
      gameOver();
    }
  }

  function isOutOfBounds() {
    return (snake[0].x < 0 || snake[0].x >= BOUND || snake[0].y < 0 || snake[0].y >= BOUND);
  }

  // ouroboros vibe check
  function isEatingItself() {
    return snake.slice(1).some(({x, y}) => x === snake[0].x && y === snake[0].y);
  }


  function updateDirection(e) {
    const key = e.key;
    const { x, y } = direction;
    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (y !== 1) {
          direction = { x: 0, y: -1 };
        }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (y !== -1) {
          direction = { x: 0, y: 1 };
        }
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (x !== 1 && !(x === 0 && y === 0)) {
          direction = { x: -1, y: 0 };
        }
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (x !== -1) {
          direction = { x: 1, y: 0 };
        }
        break;
    }
  }

  function drawSquare(x, y, color = TERMINAL_GREEN) {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.fillRect(x, y, SCALE, SCALE);
    ctx.strokeRect(x, y, SCALE, SCALE);
  }

  function setAppleLocation() {
    while (snake.some(({x, y}) => x === apple.x && y === apple.y)) {
      apple = {
        x: Math.floor(Math.random() * (BOUND / SCALE)) * SCALE,
        y: Math.floor(Math.random() * (BOUND / SCALE)) * SCALE
      };
    }
    drawApple();
  }

  function drawApple(color = 'red') {
    drawSquare(apple.x, apple.y, color);
  }

  async function gameOver() {
    clearInterval(gameLoopId);
    drawApple('black');
    setHighScore();
    displayAddScore();
    const delay = 75;
    snake.forEach(({x, y}, i) => setTimeout(() => drawSquare(x, y, 'orange'), i * delay));
    await new Promise(resolve => setTimeout(resolve, (snake.length + 1) * delay));
    snake.slice().reverse().forEach(({x, y}, i) => {
      setTimeout(() => drawSquare(x, y, 'black'), i * delay);
    });
    await new Promise(resolve => setTimeout(resolve, (snake.length) * delay));
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over', 300, 300);
  }

  function updateScore() {
    score++;
    qs('#score span').textContent = score;
    setHighScore();
  }

  function getHighScore() {
    return localStorage.getItem('highScore') || "0";
  }

  function setHighScore() {
    const highScore = getHighScore();
    if (score > highScore) {
      localStorage.setItem('highScore', score);
      qs('#high-score span').textContent = score;
    }
  }

  async function displayScores() {
    try {
      const scores = await getScores();
      const ol = gen('ol');
      scores.forEach(({name, score}) => {
        const li = gen('li');
        li.textContent = `${name}: ${score}`;
        ol.appendChild(li);
      });
      const container = qs('#high-scores');
      container.innerHTML = "";
      container.classList.remove('hidden');
      id('add').classList.add('hidden');
      const h1 = gen('h1');
      h1.textContent = 'High Scores';
      container.appendChild(h1);
      container.appendChild(ol);
    } catch (e) {
      handleError(e);
    }
  }

  function displayAddScore() {
    id('add').classList.remove('hidden');
    id('high-scores').classList.add('hidden');
  }

  async function addScore(name, score) {
    const n = name.slice(0,3);
    // Very secure endpoint. Do not abuse.
    const res = await fetch(`${API_ROOT}/addScore?name=${n}&score=${score}`);
    await statusCheck(res);
  }

  async function getScores(limit = 15) {
    const res = await fetch(`${API_ROOT}/getScores`);
    await statusCheck(res);
    const scores = await res.json();
    return scores.slice(0, limit);
  }

  function handleError(e) {
    console.error(e);
    id('scores').innerHTML = "";
    const p = gen('p');
    p.textContent = e.message;
    id('scores').appendChild(p);
    setTimeout(() => p.remove(), 3000);
  }
})();