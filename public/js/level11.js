// Level 11: Sliding Puzzle
// 3x3 sliding tile puzzle with ANNOYING BUNNY干扰

var _level11Tiles = [];
var _level11Moves = 0;
var _level11BunnyTimer = null;
var _level11Won = false;

var _bunnyMessages = [
  "🐰 HOP! You're doing it wrong!",
  "🐰 Hmm... I could show you... but I'm lazy!",
  "🐰 *bounces impatiently*",
  "🐰 Have you tried... NOT doing that?",
  "🐰 I'm bored! entertain me!",
  "🐰 Ooh ooh! Do it THIS way! (just kidding)",
  "🐰 *bunny noises*",
  "🐰 You're thinking too much!",
  "🐰 HOP HOP HOP!",
  "🐰 I could solve this in my sleep!",
  "🐰 Wait, let me count... 1, 2, uh... 3!",
  "🐰 *stares at you judgmentally*",
  "🐰 This is EXCITING! ...for me!",
  "🐰 My cousin solved this faster!",
  "🐰 Time flies when you're having fun! ...for me!"
];

var _bunnyHelpMessages = [
  "🐰 Let me help you! *shuffles tiles*",
  "🐰 HERE! Let me assist! *moves wrong tile*",
  "🐰 I got this! *does nothing useful*",
  "🐰 Quick fix! *makes it worse*",
  "🐰 Let me show you! *confuses you more*",
  "🐰 HOP! Let me rearrange this for you! *tiles move randomly*"
];

function renderLevel11(container) {
  _level11Moves = 0;
  _level11Won = false;
  _level11Tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  var shuffleMoves = 80 + Math.floor(Math.random() * 40);
  for (var i = 0; i < shuffleMoves; i++) {
    var emptyIdx = _level11Tiles.indexOf(0);
    var neighbors = _level11GetNeighbors(emptyIdx);
    var pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    _level11Tiles[emptyIdx] = _level11Tiles[pick];
    _level11Tiles[pick] = 0;
  }

  var html =
    '<h3>🧩 Level 11: Sliding Puzzle</h3>' +
    '<p style="color:#aaa;">Click a tile next to the empty space to slide it.</p>' +
    '<p style="color:#e94560; font-size:0.95em;">Arrange tiles in order: <strong>1-8</strong>, empty in bottom-right.</p>' +
    '<p style="color:#ffd700; font-size:1.1em;">Moves: <span id="level11-moves">0</span></p>' +
    '<div id="level11-bunny" class="bunny-overlay" style="display:none;"></div>' +
    '<div id="level11-grid" class="sliding-grid"></div>' +
    '<div id="level11-message" class="bunny-message" style="display:none;"></div>' +
    '<br>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;
  _level11Render();
  _level11StartBunny();

  showFocusMode();
}

function _level11GetNeighbors(idx) {
  var row = Math.floor(idx / 3);
  var col = idx % 3;
  var neighbors = [];
  if (row > 0) neighbors.push(idx - 3);
  if (row < 2) neighbors.push(idx + 3);
  if (col > 0) neighbors.push(idx - 1);
  if (col < 2) neighbors.push(idx + 1);
  return neighbors;
}

function _level11Render() {
  var grid = document.getElementById('level11-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (var i = 0; i < 9; i++) {
    var tile = document.createElement('div');
    if (_level11Tiles[i] === 0) {
      tile.className = 'sliding-tile empty';
      tile.textContent = '';
    } else {
      tile.className = 'sliding-tile';
      tile.textContent = _level11Tiles[i];
      (function(idx) {
        tile.addEventListener('click', function() {
          _level11ClickTile(idx);
        });
      })(i);
    }
    grid.appendChild(tile);
  }
}

function _level11CountTilesInPlace() {
  var correct = 0;
  var goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  for (var i = 0; i < 9; i++) {
    if (_level11Tiles[i] === goal[i]) correct++;
  }
  return correct;
}

function _level11StartBunny() {
  function scheduleBunny() {
    if (_level11Won) return;
    
    var tilesInPlace = _level11CountTilesInPlace();
    var delay;
    
    if (tilesInPlace >= 7) {
      delay = 1500 + Math.random() * 2000;
    } else if (tilesInPlace >= 5) {
      delay = 3000 + Math.random() * 3000;
    } else {
      delay = 5000 + Math.random() * 5000;
    }
    
    _level11BunnyTimer = setTimeout(function() {
      _level11ShowBunny();
      scheduleBunny();
    }, delay);
  }
  
  scheduleBunny();
}

function _level11ShowBunny() {
  if (_level11Won) return;
  
  var bunny = document.getElementById('level11-bunny');
  var msgEl = document.getElementById('level11-message');
  if (!bunny || !msgEl) return;
  
  var tilesInPlace = _level11CountTilesInPlace();
  var isHelpBunny = tilesInPlace >= 6 && Math.random() > 0.5;
  
  var message;
  if (isHelpBunny) {
    message = _bunnyHelpMessages[Math.floor(Math.random() * _bunnyHelpMessages.length)];
    _level11BunnyMessUp();
  } else {
    message = _bunnyMessages[Math.floor(Math.random() * _bunnyMessages.length)];
  }
  
  bunny.innerHTML = '🐰';
  bunny.style.display = 'flex';
  bunny.style.left = (10 + Math.random() * 60) + '%';
  bunny.style.top = (10 + Math.random() * 40) + '%';
  bunny.className = 'bunny-overlay zoom-in';
  
  msgEl.textContent = message;
  msgEl.style.display = 'block';
  msgEl.style.left = bunny.style.left;
  msgEl.style.top = 'calc(' + bunny.style.top + ' + 60px)';
  msgEl.className = 'bunny-message slide-in-bottom';
  
  playSound('intense');
  emojiPop(2, ['🐰','🥕']);
  
  setTimeout(function() {
    bunny.style.display = 'none';
    msgEl.style.display = 'none';
  }, 2500);
}

function _level11BunnyMessUp() {
  var emptyIdx = _level11Tiles.indexOf(0);
  var neighbors = _level11GetNeighbors(emptyIdx);
  
  var messUpMoves = 2 + Math.floor(Math.random() * 3);
  for (var m = 0; m < messUpMoves; m++) {
    var pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    _level11Tiles[emptyIdx] = _level11Tiles[pick];
    _level11Tiles[pick] = 0;
    emptyIdx = pick;
    neighbors = _level11GetNeighbors(emptyIdx);
  }
  
  screenShake(300);
  _level11Render();
}

function _level11ClickTile(idx) {
  if (_level11Won) return;
  
  var emptyIdx = _level11Tiles.indexOf(0);
  var neighbors = _level11GetNeighbors(emptyIdx);

  if (neighbors.indexOf(idx) === -1) return;

  _level11Tiles[emptyIdx] = _level11Tiles[idx];
  _level11Tiles[idx] = 0;
  _level11Moves++;

  var movesEl = document.getElementById('level11-moves');
  if (movesEl) movesEl.textContent = _level11Moves;

  _level11Render();

  if (_level11IsSolved()) {
    _level11Won = true;
    if (_level11BunnyTimer) {
      clearTimeout(_level11BunnyTimer);
      _level11BunnyTimer = null;
    }
    
    var bunny = document.getElementById('level11-bunny');
    var msgEl = document.getElementById('level11-message');
    if (bunny) bunny.style.display = 'none';
    if (msgEl) msgEl.style.display = 'none';
    
    hideFocusMode();
    
    var content = document.getElementById('game-content');
    if (content) {
      playSound('win');
      emojiPop(8, ['🧩','🎉','💎','🏆']);
      showFeedback(content, true, '🎉 Puzzle solved in ' + _level11Moves + ' moves! (Despite the bunny!)');
    }
    setTimeout(function() {
      completeLevel(11);
    }, 1500);
  }
}

function _level11IsSolved() {
  var goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  for (var i = 0; i < 9; i++) {
    if (_level11Tiles[i] !== goal[i]) return false;
  }
  return true;
}

registerLevelCleanup(function() {
  if (_level11BunnyTimer) {
    clearTimeout(_level11BunnyTimer);
    _level11BunnyTimer = null;
  }
  _level11Won = true;
  hideFocusMode();
});
