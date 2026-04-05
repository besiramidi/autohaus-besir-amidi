// === CONFIG ===
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');
const levelDisplay = document.getElementById('levelDisplay');
const enemyCountDisplay = document.getElementById('enemyCount');

const TILE = 32;
const PLAYER_SPEED = 3;
const BOOST_SPEED = 5;
const BOOST_DURATION = 3000;
const BASE_GHOST_SPEED = 2; // ghost mode speed, +0.5% per level
const GHOST_DURATION = 3000;

// 10% bigger maps, +1 boost per level
// All dimensions must be odd for the maze algorithm to work correctly
const LEVELS = [
  { cols: 15, rows: 11, enemies: 1, diamonds: 2, squares: 2, seed: 7710 },
  { cols: 17, rows: 11, enemies: 1, diamonds: 2, squares: 2, seed: 3347 },
  { cols: 17, rows: 13, enemies: 2, diamonds: 2, squares: 2, seed: 5523 },
  { cols: 19, rows: 13, enemies: 2, diamonds: 2, squares: 2, seed: 8891 },
  { cols: 19, rows: 15, enemies: 3, diamonds: 2, squares: 2, seed: 6274 },
  { cols: 21, rows: 15, enemies: 3, diamonds: 2, squares: 2, seed: 4156 },
  { cols: 21, rows: 17, enemies: 4, diamonds: 2, squares: 2, seed: 7823 },
  { cols: 23, rows: 17, enemies: 4, diamonds: 2, squares: 2, seed: 2190 },
  { cols: 23, rows: 19, enemies: 5, diamonds: 2, squares: 2, seed: 9412 },
  { cols: 25, rows: 19, enemies: 5, diamonds: 2, squares: 2, seed: 3678 },
];

let currentLevel = 0;
let maze = [];
let cols, rows;
let player = { x: 1, y: 1, drawX: 0, drawY: 0, speed: PLAYER_SPEED };
let exit = { x: 0, y: 0 };
let enemies = [];
let diamonds = [];     // ghost mode pickups
let speedSquares = []; // speed boost pickups
let won = false;
let lost = false;
let ghostMode = false;
let ghostTimer = null;
let speedBoosted = false;
let speedBoostTimer = null;
let keysDown = {};
let gameRunning = false;

// === SEEDED RNG (mulberry32) ===
let rngState = 0;
function seedRng(seed) {
  rngState = seed;
}
function rng() {
  rngState |= 0;
  rngState = rngState + 0x6D2B79F5 | 0;
  let t = Math.imul(rngState ^ rngState >>> 15, 1 | rngState);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

function seededShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// === SOUND (Web Audio API) ===
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  switch (type) {
    case 'move':
      osc.frequency.value = 220;
      osc.type = 'sine';
      gain.gain.value = 0.05;
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
      break;
    case 'boost':
      osc.frequency.value = 600;
      osc.type = 'triangle';
      gain.gain.value = 0.15;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.stop(audioCtx.currentTime + 0.3);
      break;
    case 'win':
      osc.frequency.value = 523;
      osc.type = 'square';
      gain.gain.value = 0.1;
      osc.start();
      osc.frequency.linearRampToValueAtTime(784, audioCtx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(1047, audioCtx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.stop(audioCtx.currentTime + 0.5);
      break;
    case 'lose':
      osc.frequency.value = 300;
      osc.type = 'sawtooth';
      gain.gain.value = 0.12;
      osc.start();
      osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.stop(audioCtx.currentTime + 0.5);
      break;
    case 'levelup':
      osc.frequency.value = 440;
      osc.type = 'sine';
      gain.gain.value = 0.1;
      osc.start();
      osc.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.stop(audioCtx.currentTime + 0.6);
      break;
  }
}

// === BFS PATHFINDING ===
function bfs(startX, startY, goalX, goalY) {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [{ x: startX, y: startY, path: [] }];
  visited[startY][startX] = true;

  while (queue.length > 0) {
    const { x, y, path } = queue.shift();
    if (x === goalX && y === goalY) return path;

    for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !visited[ny][nx] && maze[ny][nx] !== 1) {
        visited[ny][nx] = true;
        queue.push({ x: nx, y: ny, path: [...path, { x: nx, y: ny }] });
      }
    }
  }
  return [];
}

// === MAZE GENERATION — classic maze with many open corridors ===
function generateMaze() {
  const level = LEVELS[currentLevel];
  cols = level.cols;
  rows = level.rows;
  canvas.width = cols * TILE;
  canvas.height = rows * TILE;

  seedRng(level.seed);

  // Fill with walls
  maze = Array.from({ length: rows }, () => Array(cols).fill(1));

  // Exit on odd coords so carver reaches it
  exit = {
    x: (cols - 2) % 2 === 1 ? cols - 2 : cols - 3,
    y: (rows - 2) % 2 === 1 ? rows - 2 : rows - 3,
  };

  // Iterative recursive backtracker — creates a perfect maze (every cell reachable)
  const stack = [{ x: 1, y: 1 }];
  maze[1][1] = 0;

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const dirs = seededShuffle([[0, -2], [0, 2], [-2, 0], [2, 0]]);
    let carved = false;

    for (const [dx, dy] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (ny > 0 && ny < rows - 1 && nx > 0 && nx < cols - 1 && maze[ny][nx] === 1) {
        maze[current.y + dy / 2][current.x + dx / 2] = 0;
        maze[ny][nx] = 0;
        stack.push({ x: nx, y: ny });
        carved = true;
        break;
      }
    }

    if (!carved) stack.pop();
  }

  // Open some extra walls to create alternate corridors
  const extraPaths = Math.floor((cols * rows) / 10);
  for (let i = 0; i < extraPaths; i++) {
    const rx = 1 + Math.floor(rng() * (cols - 2));
    const ry = 1 + Math.floor(rng() * (rows - 2));
    if (maze[ry][rx] === 1 && rx > 0 && rx < cols - 1 && ry > 0 && ry < rows - 1) {
      const neighbors = [
        maze[ry - 1][rx],
        maze[ry + 1][rx],
        maze[ry][rx - 1],
        maze[ry][rx + 1],
      ];
      const openCount = neighbors.filter(n => n === 0).length;
      if (openCount === 2) {
        maze[ry][rx] = 0;
      }
    }
  }

  maze[exit.y][exit.x] = 0;
  maze[1][1] = 0;

  // Find the original path from start to exit
  function bfsPath(sx, sy, gx, gy) {
    const v = Array.from({ length: rows }, () => Array(cols).fill(false));
    const q = [{ x: sx, y: sy, path: [{ x: sx, y: sy }] }];
    v[sy][sx] = true;
    while (q.length > 0) {
      const { x, y, path } = q.shift();
      if (x === gx && y === gy) return path;
      for (const [dx, dy] of [[0,-1],[0,1],[-1,0],[1,0]]) {
        const nx = x+dx, ny = y+dy;
        if (nx>=0 && nx<cols && ny>=0 && ny<rows && !v[ny][nx] && maze[ny][nx] !== 1) {
          v[ny][nx] = true;
          q.push({ x: nx, y: ny, path: [...path, { x: nx, y: ny }] });
        }
      }
    }
    return [];
  }

  // Iteratively eliminate dangerous bridge cells (chokepoints enemies can block).
  // A "bridge" is a path cell whose removal disconnects start from exit.
  // We fix each one by opening the nearest wall that creates a loop (both sides already open).
  function isBridge(cell) {
    const blocked = new Set([cell.y * cols + cell.x]);
    const v = Array.from({ length: rows }, () => Array(cols).fill(false));
    const q = [{ x: 1, y: 1 }]; v[1][1] = true;
    while (q.length > 0) {
      const { x, y } = q.shift();
      if (x === exit.x && y === exit.y) return false;
      for (const [dx, dy] of [[0,-1],[0,1],[-1,0],[1,0]]) {
        const nx = x+dx, ny = y+dy;
        if (nx>=0 && nx<cols && ny>=0 && ny<rows && !v[ny][nx] &&
            maze[ny][nx] !== 1 && !blocked.has(ny * cols + nx)) {
          v[ny][nx] = true;
          q.push({ x: nx, y: ny });
        }
      }
    }
    return true;
  }

  function fixBridge(bridgeCell) {
    // BFS outward from bridgeCell; find the nearest wall where both opposite sides are open
    const visited = new Set([bridgeCell.y * cols + bridgeCell.x]);
    const queue = [bridgeCell];
    let depth = 0;
    while (queue.length > 0 && depth < 8) {
      const next = [];
      for (const { x, y } of queue) {
        for (const [dx, dy] of [[0,-1],[0,1],[-1,0],[1,0]]) {
          const wx = x+dx, wy = y+dy;
          const key = wy * cols + wx;
          if (wx <= 0 || wx >= cols-1 || wy <= 0 || wy >= rows-1) continue;
          if (maze[wy][wx] === 1) {
            // Check if both sides of this wall (in all axis directions) are open
            for (const [ddx, ddy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
              const ax = wx+ddx, ay = wy+ddy;
              const bx = wx-ddx, by = wy-ddy;
              if (ax >= 0 && ax < cols && bx >= 0 && bx < cols &&
                  ay >= 0 && ay < rows && by >= 0 && by < rows &&
                  maze[ay][ax] === 0 && maze[by][bx] === 0) {
                maze[wy][wx] = 0;
                return true;
              }
            }
          } else if (!visited.has(key)) {
            visited.add(key);
            next.push({ x: wx, y: wy });
          }
        }
      }
      queue.length = 0;
      queue.push(...next);
      depth++;
    }
    return false;
  }

  // Fix all dangerous bridges (far from start and exit so enemies can block them)
  for (let iter = 0; iter < 10; iter++) {
    const path = bfsPath(1, 1, exit.x, exit.y);
    const dangerZone = path.slice(5, path.length - 5);
    const bridge = dangerZone.find(cell => isBridge(cell));
    if (!bridge) break;
    if (!fixBridge(bridge)) break;
  }
}

// === GET OPEN CELLS (seeded) ===
function getOpenCells() {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 0 && !(c === 1 && r === 1) && !(c === exit.x && r === exit.y)) {
        cells.push({ x: c, y: r });
      }
    }
  }
  return seededShuffle(cells);
}

// === PLACE ENEMIES — 50% away, but NEVER block all routes to exit ===
function placeEnemies() {
  const level = LEVELS[currentLevel];
  enemies = [];

  const maxDist = (cols - 2) + (rows - 2);
  const halfDist = Math.floor(maxDist * 0.5);

  // Get candidate cells: at least 50% away from player, not on exit
  const candidates = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 0) {
        const distPlayer = Math.abs(c - 1) + Math.abs(r - 1);
        if (distPlayer >= halfDist && !(c === exit.x && r === exit.y)) {
          candidates.push({ x: c, y: r });
        }
      }
    }
  }

  // BFS that treats enemy positions as walls
  function pathExistsAvoiding(blockedCells) {
    const blocked = new Set(blockedCells.map(c => c.y * cols + c.x));
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue = [{ x: 1, y: 1 }];
    visited[1][1] = true;
    while (queue.length > 0) {
      const { x, y } = queue.shift();
      if (x === exit.x && y === exit.y) return true;
      for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows &&
            !visited[ny][nx] && maze[ny][nx] !== 1 && !blocked.has(ny * cols + nx)) {
          visited[ny][nx] = true;
          queue.push({ x: nx, y: ny });
        }
      }
    }
    return false;
  }

  // Place enemies one by one, only if they don't block all paths
  const step = Math.max(1, Math.floor(candidates.length / (level.enemies + 1)));
  const placed = [];

  for (let i = 0; i < level.enemies; i++) {
    let didPlace = false;
    // Try candidates starting from the evenly spaced position
    const startIdx = Math.min(i * step, candidates.length - 1);
    for (let attempt = 0; attempt < candidates.length; attempt++) {
      const idx = (startIdx + attempt) % candidates.length;
      const cell = candidates[idx];
      // Skip if already used
      if (placed.some(p => p.x === cell.x && p.y === cell.y)) continue;

      // Test: if we place here, is there still a path?
      const testPlaced = [...placed, cell];
      if (pathExistsAvoiding(testPlaced)) {
        placed.push(cell);
        didPlace = true;
        break;
      }
    }
    // If no valid position found (shouldn't happen), skip this enemy
    if (!didPlace && candidates.length > 0) {
      placed.push(candidates[0]);
    }
  }

  for (let i = 0; i < placed.length; i++) {
    const cell = placed[i];
    enemies.push({
      x: cell.x,
      y: cell.y,
      drawX: cell.x * TILE,
      drawY: cell.y * TILE,
      // First enemy = hunter (BFS), rest = patrollers (wander back and forth)
      type: i === 0 ? 'hunter' : 'patrol',
      patrolDir: null, // patrol enemies pick a direction and go until hitting a wall
    });
  }
}

// === PLACE ITEMS (diamonds=ghost, squares=speed) spread across zones ===
function placeItems() {
  const level = LEVELS[currentLevel];
  diamonds = [];
  speedSquares = [];

  function getZoneCells(numItems) {
    const items = [];
    const zoneWidth = Math.floor(cols / numItems);
    for (let i = 0; i < numItems; i++) {
      const zoneStart = 1 + i * zoneWidth;
      const zoneEnd = Math.min(cols - 2, zoneStart + zoneWidth - 1);
      const zoneCells = [];
      for (let r = 1; r < rows - 1; r++) {
        for (let c = zoneStart; c <= zoneEnd; c++) {
          if (maze[r][c] === 0 && !(c === 1 && r === 1) && !(c === exit.x && r === exit.y)) {
            zoneCells.push({ x: c, y: r });
          }
        }
      }
      if (zoneCells.length > 0) {
        items.push(zoneCells[Math.floor(zoneCells.length / 2)]);
      }
    }
    return items;
  }

  // Place diamonds (ghost mode) — spread left/right
  const diamondCells = getZoneCells(level.diamonds);
  for (const cell of diamondCells) {
    diamonds.push({ x: cell.x, y: cell.y, active: true });
  }

  // Place speed squares — use top/bottom halves to avoid overlapping diamonds
  const sqCells = [];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (maze[r][c] === 0 && !(c === 1 && r === 1) && !(c === exit.x && r === exit.y)) {
        // Don't overlap with diamonds
        const onDiamond = diamonds.some(d => d.x === c && d.y === r);
        if (!onDiamond) sqCells.push({ x: c, y: r });
      }
    }
  }
  const sqStep = Math.max(1, Math.floor(sqCells.length / (level.squares + 1)));
  for (let i = 0; i < level.squares && i < sqCells.length; i++) {
    const cell = sqCells[Math.floor((i + 1) * sqStep)];
    if (cell) speedSquares.push({ x: cell.x, y: cell.y, active: true });
  }
}

// === INIT LEVEL ===
function initLevel() {
  generateMaze();
  player.x = 1;
  player.y = 1;
  player.drawX = 1 * TILE;
  player.drawY = 1 * TILE;
  player.speed = PLAYER_SPEED;
  won = false;
  lost = false;
  ghostMode = false;
  speedBoosted = false;
  if (ghostTimer) clearTimeout(ghostTimer);
  if (speedBoostTimer) clearTimeout(speedBoostTimer);
  ghostTimer = null;
  speedBoostTimer = null;
  enemyMoveInterval = 0;

  placeEnemies();
  placeItems();

  levelDisplay.textContent = currentLevel + 1;
  enemyCountDisplay.textContent = LEVELS[currentLevel].enemies;
  message.textContent = 'Diamonds = ghost mode | Squares = speed boost';
  message.className = '';
  gameRunning = true;
}

// === MONSTER SPRITE ===
// Pre-render monster to offscreen canvas for performance
const monsterCanvas = document.createElement('canvas');
monsterCanvas.width = TILE;
monsterCanvas.height = TILE;
const mctx = monsterCanvas.getContext('2d');

function buildMonsterSprite() {
  const s = TILE / 16; // pixel size (each "pixel" of the sprite)
  mctx.clearRect(0, 0, TILE, TILE);

  function px(x, y, color) {
    mctx.fillStyle = color;
    mctx.fillRect(x * s, y * s, s, s);
  }

  const P = '#7B5EA7'; // purple body
  const D = '#5C3D8F'; // dark purple shadow
  const B = '#000000'; // black outline
  const Y = '#F5C518'; // yellow eye
  const E = '#111111'; // eye pupil
  const G = '#6BCB3A'; // green antenna
  const W = '#FFFFFF'; // teeth white
  const R = '#8B2252'; // mouth red
  const T = 'transparent';

  // Row by row pixel art (16x16 grid)
  const sprite = [
    [T,T,T,T,T,G,T,T,T,T,G,T,T,T,T,T],
    [T,T,T,T,T,G,T,T,T,T,G,T,T,T,T,T],
    [T,T,T,T,B,B,B,B,B,B,B,B,T,T,T,T],
    [T,T,T,B,P,P,P,P,P,P,P,P,B,T,T,T],
    [T,T,B,P,P,B,Y,Y,Y,Y,B,P,P,B,T,T],
    [T,T,B,P,P,B,Y,Y,E,Y,B,P,P,B,T,T],
    [T,T,B,P,P,B,Y,Y,Y,Y,B,P,P,B,T,T],
    [T,B,D,P,P,P,B,B,B,B,P,P,P,D,B,T],
    [T,B,D,P,B,W,B,R,R,B,W,B,P,D,B,T],
    [T,B,D,P,P,B,W,R,R,W,B,P,P,D,B,T],
    [T,T,B,P,P,P,B,B,B,B,P,P,P,B,T,T],
    [T,T,B,D,P,P,P,P,P,P,P,P,D,B,T,T],
    [T,T,B,D,P,P,B,T,B,P,P,D,B,T,T,T],
    [T,T,T,B,D,P,B,T,B,P,D,B,T,T,T,T],
    [T,T,T,B,B,B,B,T,B,B,B,B,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  ];

  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      if (sprite[row][col] !== T) {
        px(col, row, sprite[row][col]);
      }
    }
  }
}
buildMonsterSprite();

function drawMonster(x, y) {
  ctx.drawImage(monsterCanvas, x, y, TILE, TILE);
}

// === PLAYER SPRITE (pink ghost) ===
const playerCanvas = document.createElement('canvas');
playerCanvas.width = TILE;
playerCanvas.height = TILE;
const pctx = playerCanvas.getContext('2d');

const playerBoostCanvas = document.createElement('canvas');
playerBoostCanvas.width = TILE;
playerBoostCanvas.height = TILE;
const pbctx = playerBoostCanvas.getContext('2d');

function buildPlayerSprite(targetCtx, pink, darkPink) {
  const s = TILE / 16;
  targetCtx.clearRect(0, 0, TILE, TILE);

  function px(x, y, color) {
    targetCtx.fillStyle = color;
    targetCtx.fillRect(x * s, y * s, s, s);
  }

  const P = pink;       // body
  const D = darkPink;   // darker shade
  const B = '#000000';  // outline
  const W = '#FFFFFF';  // eye white
  const K = '#111111';  // pupil
  const R = '#FF6B6B';  // blush
  const T = 'transparent';

  const sprite = [
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,B,B,B,B,B,B,T,T,T,T,T],
    [T,T,T,T,B,P,P,P,P,P,P,B,T,T,T,T],
    [T,T,T,B,P,P,D,P,P,D,P,P,B,T,T,T],
    [T,T,B,P,P,P,D,P,P,D,P,P,P,B,T,T],
    [T,T,B,P,P,P,P,P,P,P,P,P,P,B,T,T],
    [T,T,B,P,W,W,P,P,P,W,W,P,P,B,T,T],
    [T,T,B,P,W,K,P,P,P,W,K,P,P,B,T,T],
    [T,T,B,P,P,P,R,P,R,P,P,P,P,B,T,T],
    [T,T,B,P,P,P,P,B,P,P,P,P,P,B,T,T],
    [T,T,B,P,P,P,P,P,P,P,P,P,P,B,T,T],
    [T,T,B,P,P,P,P,P,P,P,P,P,P,B,T,T],
    [T,T,B,P,P,P,P,P,P,P,P,P,P,B,T,T],
    [T,T,B,P,P,B,P,P,P,B,P,P,B,T,T,T],
    [T,T,T,B,B,T,B,B,B,T,B,B,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  ];

  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      if (sprite[row][col] !== T) {
        px(col, row, sprite[row][col]);
      }
    }
  }
}
buildPlayerSprite(pctx, '#FF87B2', '#E0608A');
buildPlayerSprite(pbctx, '#FFD700', '#DAA520');

function drawPlayer(x, y) {
  ctx.drawImage(playerCanvas, x, y, TILE, TILE);
}

// === DRAWING ===
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw maze
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * TILE;
      const y = r * TILE;
      if (maze[r][c] === 1) {
        ctx.fillStyle = '#0f3460';
        ctx.fillRect(x, y, TILE, TILE);
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, TILE, TILE);
      }
    }
  }

  // Draw exit with pulsing glow
  const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 300);
  ctx.shadowColor = '#53d769';
  ctx.shadowBlur = 8 + pulse * 8;
  ctx.fillStyle = '#53d769';
  ctx.fillRect(exit.x * TILE + 2, exit.y * TILE + 2, TILE - 4, TILE - 4);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#16213e';
  ctx.font = `bold ${TILE * 0.5}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EXIT', exit.x * TILE + TILE / 2, exit.y * TILE + TILE / 2);

  // Draw diamonds (ghost mode)
  for (const d of diamonds) {
    if (!d.active) continue;
    const dx = d.x * TILE + TILE / 2;
    const dy = d.y * TILE + TILE / 2;
    const bobble = Math.sin(Date.now() / 200 + d.x) * 2;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(dx, dy - TILE * 0.35 + bobble);
    ctx.lineTo(dx + TILE * 0.25, dy + bobble);
    ctx.lineTo(dx, dy + TILE * 0.35 + bobble);
    ctx.lineTo(dx - TILE * 0.25, dy + bobble);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Draw speed squares
  for (const s of speedSquares) {
    if (!s.active) continue;
    const sx = s.x * TILE + TILE * 0.2;
    const sy = s.y * TILE + TILE * 0.2;
    const bobble = Math.sin(Date.now() / 250 + s.x + s.y) * 2;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(sx, sy + bobble, TILE * 0.6, TILE * 0.6);
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy + bobble, TILE * 0.6, TILE * 0.6);
    ctx.shadowBlur = 0;
  }

  // Draw enemies (pixel art purple monster)
  for (const e of enemies) {
    drawMonster(e.drawX, e.drawY);
  }

  // Draw player (pink ghost — flickers transparent in ghost mode)
  if (ghostMode) {
    ctx.globalAlpha = 0.3 + 0.3 * Math.sin(Date.now() / 100);
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 12;
  }
  drawPlayer(player.drawX, player.drawY);
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  // Ghost mode indicator bar
  if (ghostMode) {
    ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
    ctx.fillRect(0, 0, canvas.width, 4);
  }
}

// === SMOOTH MOVEMENT ===
function canMove(fromX, fromY, dx, dy) {
  const nx = fromX + dx;
  const ny = fromY + dy;
  return nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] !== 1;
}

// Track the most recently pressed direction key
let nextDir = { mx: 0, my: 0 };
let lastKeyTime = { up: 0, down: 0, left: 0, right: 0 };

document.addEventListener('keydown', (e) => {
  const now = performance.now();
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') lastKeyTime.up = now;
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') lastKeyTime.down = now;
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') lastKeyTime.left = now;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') lastKeyTime.right = now;
});

function updatePlayer() {
  if (!gameRunning) return;

  // Find which held key was pressed most recently
  let best = null;
  let bestTime = 0;
  if (keysDown['ArrowUp'] || keysDown['w'] || keysDown['W']) {
    if (lastKeyTime.up > bestTime) { best = { mx: 0, my: -1 }; bestTime = lastKeyTime.up; }
  }
  if (keysDown['ArrowDown'] || keysDown['s'] || keysDown['S']) {
    if (lastKeyTime.down > bestTime) { best = { mx: 0, my: 1 }; bestTime = lastKeyTime.down; }
  }
  if (keysDown['ArrowLeft'] || keysDown['a'] || keysDown['A']) {
    if (lastKeyTime.left > bestTime) { best = { mx: -1, my: 0 }; bestTime = lastKeyTime.left; }
  }
  if (keysDown['ArrowRight'] || keysDown['d'] || keysDown['D']) {
    if (lastKeyTime.right > bestTime) { best = { mx: 1, my: 0 }; bestTime = lastKeyTime.right; }
  }
  if (best) nextDir = best;

  const speed = player.speed;
  const targetX = player.x * TILE;
  const targetY = player.y * TILE;
  const dx = targetX - player.drawX;
  const dy = targetY - player.drawY;
  const sliding = Math.abs(dx) > 1 || Math.abs(dy) > 1;

  // Determine which direction we're currently sliding in
  const slidingH = Math.abs(dx) > 1; // sliding horizontally
  const slidingV = Math.abs(dy) > 1; // sliding vertically

  // If sliding but player wants a DIFFERENT axis, snap to nearest tile and change
  if (sliding && nextDir.mx !== 0 && nextDir.my === 0 && slidingV && !slidingH) {
    // Was going vertical, wants horizontal — snap Y to current tile
    const nearestY = Math.round(player.drawY / TILE);
    const nearestTileY = Math.max(1, Math.min(rows - 2, nearestY));
    if (maze[nearestTileY][player.x] !== 1 && canMove(player.x, nearestTileY, nextDir.mx, 0)) {
      player.y = nearestTileY;
      player.drawY = nearestTileY * TILE;
      player.x += nextDir.mx;
      playSound('move');
      return;
    }
  }
  if (sliding && nextDir.my !== 0 && nextDir.mx === 0 && slidingH && !slidingV) {
    // Was going horizontal, wants vertical — snap X to current tile
    const nearestX = Math.round(player.drawX / TILE);
    const nearestTileX = Math.max(1, Math.min(cols - 2, nearestX));
    if (maze[player.y][nearestTileX] !== 1 && canMove(nearestTileX, player.y, 0, nextDir.my)) {
      player.x = nearestTileX;
      player.drawX = nearestTileX * TILE;
      player.y += nextDir.my;
      playSound('move');
      return;
    }
  }

  // Normal sliding toward target
  if (sliding) {
    if (Math.abs(dx) > 1) player.drawX += Math.sign(dx) * Math.min(speed, Math.abs(dx));
    else player.drawX = targetX;
    if (Math.abs(dy) > 1) player.drawY += Math.sign(dy) * Math.min(speed, Math.abs(dy));
    else player.drawY = targetY;
    return;
  }

  // Arrived on tile — snap exactly
  player.drawX = targetX;
  player.drawY = targetY;

  // Try to move in the queued direction
  if ((nextDir.mx !== 0 || nextDir.my !== 0) && canMove(player.x, player.y, nextDir.mx, nextDir.my)) {
    player.x += nextDir.mx;
    player.y += nextDir.my;
    playSound('move');
  }

  // Check win
  if (player.x === exit.x && player.y === exit.y) {
    gameRunning = false;
    won = true;
    playSound('win');
    if (currentLevel < LEVELS.length - 1) {
      message.textContent = `Level ${currentLevel + 1} complete! Press SPACE for next level.`;
      message.className = 'win';
    } else {
      message.textContent = 'You beat all 10 levels! You escaped! Press R to restart.';
      message.className = 'win';
      playSound('levelup');
    }
  }
}

// === ENEMY AI ===
let frameCount = 0;
const ENEMY_MOVE_RATE = 20;

function getRandomMove(ex, ey) {
  const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  const valid = dirs.filter(([dx, dy]) => {
    const nx = ex + dx, ny = ey + dy;
    return nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] !== 1;
  });
  return valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : null;
}

function updateEnemies() {
  if (!gameRunning) return;

  frameCount++;

  // Smooth interpolation every frame
  for (const e of enemies) {
    const tx = e.x * TILE;
    const ty = e.y * TILE;
    e.drawX += (tx - e.drawX) * 0.25;
    e.drawY += (ty - e.drawY) * 0.25;
  }

  if (frameCount % ENEMY_MOVE_RATE !== 0) return;

  const px = player.x;
  const py = player.y;

  for (const e of enemies) {
    // Ghost mode: enemies wander randomly, ignore player
    if (ghostMode) {
      const rm = getRandomMove(e.x, e.y);
      if (rm) { e.x += rm[0]; e.y += rm[1]; }
      continue;
    }

    // BFS perfect pathfinding toward player
    const path = bfs(e.x, e.y, px, py);
    if (path.length > 0) {
      e.x = path[0].x;
      e.y = path[0].y;
    }

    // Can't be caught in ghost mode
    if (!ghostMode && e.x === player.x && e.y === player.y) {
      gameRunning = false;
      lost = true;
      playSound('lose');
      message.textContent = 'Caught! Press R to retry this level.';
      message.className = 'lose';
    }
  }
}

// === CHECK COLLISION ===
function checkCollision() {
  if (ghostMode) return; // invincible in ghost mode
  for (const e of enemies) {
    const dx = Math.abs(player.drawX - e.drawX);
    const dy = Math.abs(player.drawY - e.drawY);
    if (dx < TILE * 0.5 && dy < TILE * 0.5) {
      if (!lost && gameRunning) {
        gameRunning = false;
        lost = true;
        playSound('lose');
        message.textContent = 'Caught! Press R to retry this level.';
        message.className = 'lose';
      }
    }
  }
}

// === INPUT ===
document.addEventListener('keydown', (e) => {
  keysDown[e.key] = true;

  if (e.key === 'r' || e.key === 'R') {
    if (lost) {
      initLevel();
    } else if (won && currentLevel >= LEVELS.length - 1) {
      currentLevel = 0;
      initLevel();
    }
  }

  if (e.key === ' ' && won && currentLevel < LEVELS.length - 1) {
    currentLevel++;
    playSound('levelup');
    initLevel();
  }

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
  }
});

document.addEventListener('keyup', (e) => {
  keysDown[e.key] = false;
});

// === CHECK PICKUPS (runs every frame) ===
function checkPickups() {
  if (!gameRunning) return;

  // Diamonds — ghost mode
  for (const d of diamonds) {
    if (d.active && player.x === d.x && player.y === d.y) {
      d.active = false;
      ghostMode = true;
      player.speed = BASE_GHOST_SPEED * (1 + currentLevel * 0.005);
      playSound('boost');
      if (ghostTimer) clearTimeout(ghostTimer);
      ghostTimer = setTimeout(() => {
        ghostMode = false;
        if (!speedBoosted) player.speed = PLAYER_SPEED;
      }, GHOST_DURATION);
    }
  }

  // Speed squares — speed boost
  for (const s of speedSquares) {
    if (s.active && player.x === s.x && player.y === s.y) {
      s.active = false;
      speedBoosted = true;
      if (!ghostMode) player.speed = BOOST_SPEED;
      playSound('boost');
      if (speedBoostTimer) clearTimeout(speedBoostTimer);
      speedBoostTimer = setTimeout(() => {
        speedBoosted = false;
        if (!ghostMode) player.speed = PLAYER_SPEED;
      }, BOOST_DURATION);
    }
  }
}

// === GAME LOOP ===
function gameLoop() {
  updatePlayer();
  checkPickups();
  updateEnemies();
  checkCollision();
  draw();
  requestAnimationFrame(gameLoop);
}

// === START ===
initLevel();
gameLoop();
