// Level 9: Pattern Lock
// Memorize a pattern on a 4x4 grid and reproduce it by clicking

function renderLevel9(container) {
  var GRID_SIZE = 4;
  var TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
  var PATTERN_LENGTH = 5 + Math.floor(Math.random() * 2); // 5 or 6 cells
  var DISPLAY_TIME = 3000; // 3 seconds to memorize
  var pattern = [];
  var playerSelection = [];
  var phase = 'memorize'; // 'memorize', 'input', 'done'
  var displayTimeout = null;

  // Generate random pattern (unique cell indices)
  function generatePattern() {
    var indices = [];
    while (indices.length < PATTERN_LENGTH) {
      var idx = Math.floor(Math.random() * TOTAL_CELLS);
      if (indices.indexOf(idx) === -1) {
        indices.push(idx);
      }
    }
    return indices;
  }

  function buildGrid() {
    var html =
      '<h3>🔐 Level 9: Pattern Lock</h3>' +
      '<p id="pattern-message" style="color:#ffd700; font-size:1.2em; margin:10px 0;">🧠 Memorize the pattern!</p>' +
      '<p id="pattern-count" style="color:#aaa; font-size:0.9em; margin-bottom:10px;">' + PATTERN_LENGTH + ' cells to remember</p>' +
      '<div class="pattern-grid" id="pattern-grid">';

    for (var i = 0; i < TOTAL_CELLS; i++) {
      html += '<div class="pattern-cell" data-index="' + i + '"></div>';
    }

    html += '</div>';
    html += '<p id="pattern-selected-count" style="color:#aaa; margin-top:10px;"></p>';
    html += '<div id="pattern-actions" style="margin-top:10px; display:none;">' +
      '<button class="btn-submit" id="pattern-check-btn" onclick="checkLevel9()">✅ Check Pattern</button>' +
      '<button class="btn-close" style="margin-left:8px;" id="pattern-clear-btn" onclick="clearLevel9()">🗑️ Clear</button>' +
      '</div>';
    html += '<br><button class="btn-close" onclick="closeGame()">Close</button>';

    container.innerHTML = html;
  }

  function getCells() {
    var grid = document.getElementById('pattern-grid');
    if (!grid) return [];
    return grid.querySelectorAll('.pattern-cell');
  }

  function showPattern() {
    var cells = getCells();
    for (var i = 0; i < pattern.length; i++) {
      if (cells[pattern[i]]) {
        cells[pattern[i]].classList.add('active');
      }
    }
  }

  function hidePattern() {
    var cells = getCells();
    for (var i = 0; i < cells.length; i++) {
      cells[i].classList.remove('active');
    }
  }

  function startInputPhase() {
    phase = 'input';
    playerSelection = [];
    hidePattern();

    var msg = document.getElementById('pattern-message');
    if (msg) {
      msg.textContent = '👆 Now click the cells you memorized!';
      msg.style.color = '#3498db';
    }

    var actions = document.getElementById('pattern-actions');
    if (actions) actions.style.display = 'block';

    updateSelectedCount();

    // Attach click listeners
    var cells = getCells();
    for (var i = 0; i < cells.length; i++) {
      (function(cell, index) {
        cell.addEventListener('click', function() {
          if (phase !== 'input') return;
          toggleCell(index);
        });
      })(cells[i], i);
    }
  }

  function toggleCell(index) {
    var pos = playerSelection.indexOf(index);
    var cells = getCells();
    var cell = cells[index];
    if (!cell) return;

    if (pos !== -1) {
      // Deselect
      playerSelection.splice(pos, 1);
      cell.classList.remove('selected');
    } else {
      // Select (only allow up to PATTERN_LENGTH)
      if (playerSelection.length >= PATTERN_LENGTH) {
        showFeedback(container, false, '❌ You can only select ' + PATTERN_LENGTH + ' cells! Deselect one first.');
        return;
      }
      playerSelection.push(index);
      cell.classList.add('selected');
    }

    updateSelectedCount();
  }

  function updateSelectedCount() {
    var el = document.getElementById('pattern-selected-count');
    if (el) {
      el.textContent = 'Selected: ' + playerSelection.length + ' / ' + PATTERN_LENGTH;
    }
  }

  function startRound() {
    pattern = generatePattern();
    playerSelection = [];
    phase = 'memorize';

    buildGrid();
    showPattern();

    var msg = document.getElementById('pattern-message');
    if (msg) {
      msg.textContent = '🧠 Memorize the pattern!';
      msg.style.color = '#ffd700';
    }

    var actions = document.getElementById('pattern-actions');
    if (actions) actions.style.display = 'none';

    // After display time, switch to input phase
    displayTimeout = setTimeout(function() {
      displayTimeout = null;
      startInputPhase();
    }, DISPLAY_TIME);
  }

  // Expose check and clear as global functions
  window.checkLevel9 = function() {
    if (phase !== 'input') return;

    if (playerSelection.length !== PATTERN_LENGTH) {
      showFeedback(container, false, '❌ Select exactly ' + PATTERN_LENGTH + ' cells before checking!');
      return;
    }

    // Check if all selected cells match the pattern
    var sortedPattern = pattern.slice().sort(function(a, b) { return a - b; });
    var sortedSelection = playerSelection.slice().sort(function(a, b) { return a - b; });

    var correct = true;
    for (var i = 0; i < sortedPattern.length; i++) {
      if (sortedPattern[i] !== sortedSelection[i]) {
        correct = false;
        break;
      }
    }

    var cells = getCells();

    if (correct) {
      phase = 'done';
      // Highlight all as correct
      for (var i = 0; i < playerSelection.length; i++) {
        if (cells[playerSelection[i]]) {
          cells[playerSelection[i]].classList.remove('selected');
          cells[playerSelection[i]].classList.add('correct');
        }
      }
      showFeedback(container, true, '🎉 Perfect! You matched the pattern!');
      setTimeout(function() {
        completeLevel(9);
      }, 1500);
    } else {
      // Show wrong cells with shake
      for (var i = 0; i < playerSelection.length; i++) {
        if (cells[playerSelection[i]]) {
          cells[playerSelection[i]].classList.remove('selected');
          cells[playerSelection[i]].classList.add('wrong');
        }
      }
      // Also briefly show the correct pattern
      for (var i = 0; i < pattern.length; i++) {
        if (cells[pattern[i]]) {
          cells[pattern[i]].classList.add('correct');
        }
      }

      phase = 'done'; // prevent clicks during transition
      showFeedback(container, false, '❌ Wrong pattern! Watch carefully this time...');

      // Retry with a new pattern after a delay
      setTimeout(function() {
        startRound();
      }, 2000);
    }
  };

  window.clearLevel9 = function() {
    if (phase !== 'input') return;
    var cells = getCells();
    for (var i = 0; i < cells.length; i++) {
      cells[i].classList.remove('selected');
    }
    playerSelection = [];
    updateSelectedCount();
  };

  // Start the first round
  startRound();

  // Register cleanup
  registerLevelCleanup(function() {
    if (displayTimeout) {
      clearTimeout(displayTimeout);
      displayTimeout = null;
    }
    phase = 'done';
    window.checkLevel9 = null;
    window.clearLevel9 = null;
  });
}
