// Level 7: Maze Runner
// Navigate a larger maze with checkpoints and time limit

function renderLevel7(container) {
  var ROWS = 21;
  var COLS = 21;
  var maze = [];
  var playerRow = 1;
  var playerCol = 1;
  var endRow = ROWS - 2;
  var endCol = COLS - 2;
  var won = false;
  var checkpoints = [];
  var checkpointsCollected = 0;
  var totalCheckpoints = 3;
  var timeLeft = 45;
  var timerInterval = null;
  var startTime = Date.now();

  for (var r = 0; r < ROWS; r++) {
    maze[r] = [];
    for (var c = 0; c < COLS; c++) {
      maze[r][c] = 0;
    }
  }

  function generateMaze() {
    var visited = [];
    for (var r = 0; r < ROWS; r++) {
      visited[r] = [];
      for (var c = 0; c < COLS; c++) {
        visited[r][c] = false;
      }
    }

    var stack = [];
    var startR = 1;
    var startC = 1;
    maze[startR][startC] = 1;
    visited[startR][startC] = true;
    stack.push([startR, startC]);

    var directions = [
      [-2, 0], [2, 0], [0, -2], [0, 2]
    ];

    while (stack.length > 0) {
      var current = stack[stack.length - 1];
      var cr = current[0];
      var cc = current[1];

      var neighbors = [];
      for (var d = 0; d < directions.length; d++) {
        var nr = cr + directions[d][0];
        var nc = cc + directions[d][1];
        if (nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1 && !visited[nr][nc]) {
          neighbors.push([nr, nc, directions[d][0], directions[d][1]]);
        }
      }

      if (neighbors.length === 0) {
        stack.pop();
      } else {
        var pick = neighbors[Math.floor(Math.random() * neighbors.length)];
        var nr = pick[0];
        var nc = pick[1];
        var dr = pick[2];
        var dc = pick[3];

        maze[cr + dr / 2][cc + dc / 2] = 1;
        maze[nr][nc] = 1;
        visited[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
  }

  generateMaze();

  maze[playerRow][playerCol] = 1;
  maze[endRow][endCol] = 1;

  function placeCheckpoints() {
    checkpoints = [];
    var attempts = 0;
    while (checkpoints.length < totalCheckpoints && attempts < 1000) {
      var r = Math.floor(Math.random() * (ROWS - 2)) + 1;
      var c = Math.floor(Math.random() * (COLS - 2)) + 1;
      if (maze[r][c] === 1 && !(r === playerRow && c === playerCol) && 
          !(r === endRow && c === endCol)) {
        var already = false;
        for (var i = 0; i < checkpoints.length; i++) {
          if (checkpoints[i].r === r && checkpoints[i].c === c) {
            already = true;
            break;
          }
        }
        if (!already) {
          checkpoints.push({r: r, c: c, collected: false});
        }
      }
      attempts++;
    }
  }
  placeCheckpoints();

  function solveMazeBFS() {
    var queue = [[playerRow, playerCol, []]];
    var visitedPos = {};
    visitedPos[playerRow + ',' + playerCol] = true;

    while (queue.length > 0) {
      var curr = queue.shift();
      var r = curr[0];
      var c = curr[1];
      var path = curr[2];

      if (r === endRow && c === endCol) {
        return path.length;
      }

      var dirs = [[-1,0], [1,0], [0,-1], [0,1]];
      for (var i = 0; i < dirs.length; i++) {
        var nr = r + dirs[i][0];
        var nc = c + dirs[i][1];
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && 
            maze[nr][nc] === 1 && !visitedPos[nr + ',' + nc]) {
          visitedPos[nr + ',' + nc] = true;
          queue.push([nr, nc, path.concat([{r: nr, c: nc}])]);
        }
      }
    }
    return -1;
  }
  var minMoves = solveMazeBFS();

  var html =
    '<h3>🏃 Level 7: Maze Runner</h3>' +
    '<p style="color:#aaa;">Use <strong style="color:#ffd700;">Arrow Keys</strong> to reach the 🏁!</p>' +
    '<p style="color:#e94560; font-size:0.9em;">Collect all <strong style="color:#ffd700;">⭐ checkpoints</strong> before exiting! Time: <span id="maze-timer" class="game-timer">⏱️ ' + timeLeft + 's</span></p>' +
    '<p style="color:#aaa; font-size:0.85em;">Minimum path: ~' + minMoves + ' moves | Your moves: <span id="maze-moves">0</span></p>' +
    '<p style="color:#ffd700; font-size:0.9em;">Checkpoints: <span id="maze-checkpoints">0</span> / ' + totalCheckpoints + ' ⭐</p>' +
    '<div id="maze-container" class="maze-grid" style="grid-template-columns: repeat(' + COLS + ', 24px);">';

  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      var cellClass = 'maze-cell ';
      var content = '';
      var isCheckpoint = false;
      for (var i = 0; i < checkpoints.length; i++) {
        if (checkpoints[i].r === r && checkpoints[i].c === c && !checkpoints[i].collected) {
          isCheckpoint = true;
          break;
        }
      }
      if (r === playerRow && c === playerCol) {
        cellClass += 'maze-path maze-player';
        content = '🏃';
      } else if (r === endRow && c === endCol) {
        cellClass += 'maze-path maze-end';
        content = '🏁';
      } else if (isCheckpoint) {
        cellClass += 'maze-path maze-checkpoint';
        content = '⭐';
      } else if (maze[r][c] === 1) {
        cellClass += 'maze-path';
      } else {
        cellClass += 'maze-wall';
      }
      html += '<div class="' + cellClass + '" data-row="' + r + '" data-col="' + c + '">' + content + '</div>';
    }
  }

  html += '</div>';
  html += '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;

  showFocusMode();
  playIntenseMode();

  timerInterval = setInterval(function() {
    if (won) return;
    timeLeft--;
    var timerEl = document.getElementById('maze-timer');
    if (timerEl) {
      timerEl.textContent = '⏱️ ' + timeLeft + 's';
      if (timeLeft <= 10) {
        timerEl.classList.add('timer-urgent');
        playSound('tick');
        emojiPop(1, ['⏰']);
      }
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      won = true;
      stopIntenseMode();
      hideFocusMode();
      playSound('fail');
      screenShake(500);
      showFeedback(container, false, '⏰ Time\'s up! You got lost in the maze...');
      var retryBtn = document.createElement('button');
      retryBtn.className = 'btn-submit';
      retryBtn.textContent = '🔄 Try Again';
      retryBtn.style.marginTop = '10px';
      retryBtn.onclick = function() { renderLevel7(container); };
      container.appendChild(retryBtn);
    }
  }, 1000);

  var moveCount = 0;

  function renderMaze() {
    var mazeContainer = document.getElementById('maze-container');
    if (!mazeContainer) return;
    mazeContainer.innerHTML = '';

    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var cell = document.createElement('div');
        var cellClass = 'maze-cell ';
        var content = '';
        var isCheckpoint = false;
        for (var i = 0; i < checkpoints.length; i++) {
          if (checkpoints[i].r === r && checkpoints[i].c === c && !checkpoints[i].collected) {
            isCheckpoint = true;
            break;
          }
        }
        if (r === playerRow && c === playerCol) {
          cellClass += 'maze-path maze-player';
          content = '🏃';
        } else if (r === endRow && c === endCol) {
          cellClass += 'maze-path maze-end';
          content = '🏁';
        } else if (isCheckpoint) {
          cellClass += 'maze-path maze-checkpoint';
          content = '⭐';
        } else if (maze[r][c] === 1) {
          cellClass += 'maze-path';
        } else {
          cellClass += 'maze-wall';
        }
        cell.className = cellClass;
        cell.textContent = content;
        mazeContainer.appendChild(cell);
      }
    }
  }

  function checkCheckpoint() {
    for (var i = 0; i < checkpoints.length; i++) {
      if (!checkpoints[i].collected && checkpoints[i].r === playerRow && checkpoints[i].c === playerCol) {
        checkpoints[i].collected = true;
        checkpointsCollected++;
        playSound('success');
        emojiPop(3, ['⭐','✨','💫']);
        var cpEl = document.getElementById('maze-checkpoints');
        if (cpEl) cpEl.textContent = checkpointsCollected;
        if (checkpointsCollected >= totalCheckpoints) {
          var cpStatus = document.getElementById('maze-checkpoints');
          if (cpStatus) cpStatus.style.color = '#2ecc71';
        }
      }
    }
  }

  function handleKeyDown(e) {
    if (won) return;

    var dr = 0;
    var dc = 0;

    if (e.key === 'ArrowUp' || e.key === 'Up') { dr = -1; }
    else if (e.key === 'ArrowDown' || e.key === 'Down') { dr = 1; }
    else if (e.key === 'ArrowLeft' || e.key === 'Left') { dc = -1; }
    else if (e.key === 'ArrowRight' || e.key === 'Right') { dc = 1; }
    else { return; }

    e.preventDefault();

    var newR = playerRow + dr;
    var newC = playerCol + dc;

    if (newR < 0 || newR >= ROWS || newC < 0 || newC >= COLS) return;
    if (maze[newR][newC] === 0) {
      playSound('fail');
      triggerWrongShake(container);
      return;
    }

    playerRow = newR;
    playerCol = newC;
    moveCount++;

    var movesEl = document.getElementById('maze-moves');
    if (movesEl) movesEl.textContent = moveCount;

    checkCheckpoint();
    renderMaze();

    if (playerRow === endRow && playerCol === endCol) {
      if (checkpointsCollected >= totalCheckpoints) {
        won = true;
        clearInterval(timerInterval);
        timerInterval = null;
        stopIntenseMode();
        hideFocusMode();
        
        var timeBonus = Math.max(0, timeLeft * 1000);
        playSound('win');
        emojiPop(8, ['🏃','🎉','💨','⭐','🏁']);
        
        showFeedback(container, true, '🎉 Escaped! Moves: ' + moveCount + ' | Time bonus: +' + timeBonus + ' $');
        setTimeout(function() {
          completeLevel(7);
        }, 1500);
      } else {
        playSound('fail');
        showFeedback(container, false, '❌ Collect all ' + totalCheckpoints + ' checkpoints first!');
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  registerLevelCleanup(function() {
    document.removeEventListener('keydown', handleKeyDown);
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    stopIntenseMode();
    hideFocusMode();
  });
}
