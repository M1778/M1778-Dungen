// Level 12: Spot the Difference
// Two 16x16 grids of colored cells. Grid B has differences from Grid A.
// Player clicks the differing cells in Grid B. Find all to win.

var _level12GridA = [];
var _level12GridB = [];
var _level12DiffIndices = [];
var _level12Found = [];
var _level12GridSize = 16;
var _level12TotalDiffs = 5;

function renderLevel12(container) {
  var colorPool = [
    '#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6',
    '#e67e22', '#1abc9c', '#ec7063', '#5dade2', '#58d68d',
    '#f4d03f', '#af7ac5', '#eb984e', '#48c9b0', '#e94560',
    '#884ea0', '#d35400', '#27ae60', '#2980b9', '#c0392b'
  ];

  _level12GridA = [];
  _level12GridB = [];
  _level12DiffIndices = [];
  _level12Found = [];

  var totalCells = _level12GridSize * _level12GridSize;

  for (var i = 0; i < totalCells; i++) {
    _level12GridA.push(colorPool[Math.floor(Math.random() * colorPool.length)]);
  }

  for (var j = 0; j < totalCells; j++) {
    _level12GridB.push(_level12GridA[j]);
  }

  var indices = [];
  while (indices.length < _level12TotalDiffs) {
    var idx = Math.floor(Math.random() * totalCells);
    if (indices.indexOf(idx) === -1) {
      indices.push(idx);
    }
  }
  _level12DiffIndices = indices;

  for (var k = 0; k < indices.length; k++) {
    var cellIdx = indices[k];
    var originalColor = _level12GridA[cellIdx];
    var newColor = originalColor;
    var attempts = 0;
    while (newColor === originalColor && attempts < 50) {
      newColor = colorPool[Math.floor(Math.random() * colorPool.length)];
      attempts++;
    }
    _level12GridB[cellIdx] = newColor;
  }

  var html =
    '<h3>🔍 Level 12: Spot the Difference</h3>' +
    '<p style="color:#aaa;">Find the <strong style="color:#ffd700;">' + _level12TotalDiffs + ' cells</strong> that differ between Grid A and Grid B.</p>' +
    '<p style="color:#e94560; font-size:0.95em;">Click the different cells in <strong>Grid B</strong>.</p>' +
    '<p style="color:#ffd700; font-size:1.1em;">Found: <span id="level12-found">0</span> / ' + _level12TotalDiffs + '</p>' +
    '<div class="spot-container">' +
      '<div class="spot-grid-wrapper">' +
        '<h4>Grid A</h4>' +
        '<div id="level12-gridA" class="spot-grid" style="grid-template-columns: repeat(' + _level12GridSize + ', 18px);"></div>' +
      '</div>' +
      '<div class="spot-grid-wrapper">' +
        '<h4>Grid B (click here)</h4>' +
        '<div id="level12-gridB" class="spot-grid" style="grid-template-columns: repeat(' + _level12GridSize + ', 18px);"></div>' +
      '</div>' +
    '</div>' +
    '<br>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;
  _level12RenderGrids();

  showFocusMode();
}

function _level12RenderGrids() {
  var gridAEl = document.getElementById('level12-gridA');
  var gridBEl = document.getElementById('level12-gridB');
  if (!gridAEl || !gridBEl) return;

  gridAEl.innerHTML = '';
  gridBEl.innerHTML = '';

  var totalCells = _level12GridSize * _level12GridSize;

  for (var i = 0; i < totalCells; i++) {
    var cellA = document.createElement('div');
    cellA.className = 'spot-cell';
    cellA.style.background = _level12GridA[i];
    gridAEl.appendChild(cellA);

    var cellB = document.createElement('div');
    var isDiff = _level12DiffIndices.indexOf(i) !== -1;
    var isFound = _level12Found.indexOf(i) !== -1;

    if (isFound) {
      cellB.className = 'spot-cell found';
    } else if (isDiff) {
      cellB.className = 'spot-cell clickable-spot';
    } else {
      cellB.className = 'spot-cell';
    }
    cellB.style.background = _level12GridB[i];

    if (isDiff && !isFound) {
      (function(idx) {
        cellB.addEventListener('mousedown', function(e) {
          e.preventDefault();
          _level12ClickCell(idx);
        });
      })(i);
    }

    gridBEl.appendChild(cellB);
  }
}

function _level12ClickCell(idx) {
  if (_level12Found.indexOf(idx) !== -1) return;
  if (_level12DiffIndices.indexOf(idx) === -1) {
    playSound('fail');
    screenShake(200);
    var content = document.getElementById('game-content');
    if (content) {
      showFeedback(content, false, '❌ Wrong! Keep looking...');
    }
    return;
  }

  _level12Found.push(idx);
  playSound('success');

  var foundEl = document.getElementById('level12-found');
  if (foundEl) foundEl.textContent = _level12Found.length;

  _level12RenderGrids();

  if (_level12Found.length >= _level12TotalDiffs) {
    hideFocusMode();
    var content = document.getElementById('game-content');
    if (content) {
      playSound('win');
      emojiPop(8, ['🔍','🎉','💎','🏆']);
      showFeedback(content, true, '🎉 You found all ' + _level12TotalDiffs + ' differences! Eagle eyes!');
    }
    setTimeout(function() {
      completeLevel(12);
    }, 1500);
  }
}
