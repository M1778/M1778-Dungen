// Level 14: Tower of Hanoi
// Classic 4-disc Tower of Hanoi puzzle. Move all discs from peg 1 to peg 3.

var _level14 = {
  pegs: [[], [], []],
  selectedPeg: -1,
  moves: 0,
  timeouts: []
};

function renderLevel14(container) {
  _level14.pegs = [[4, 3, 2, 1], [], []];
  _level14.selectedPeg = -1;
  _level14.moves = 0;
  _level14.timeouts = [];

  var html =
    '<h3>🗼 Level 14: Tower of Hanoi</h3>' +
    '<p style="color:#aaa;">Move all discs from the <strong style="color:#e94560;">left peg</strong> to the <strong style="color:#ffd700;">right peg</strong>.</p>' +
    '<p style="color:#aaa; font-size:0.9em;">Rules: Move one disc at a time. Never place a larger disc on a smaller one.</p>' +
    '<p style="color:#ffd700; font-size:1.1em;">Moves: <span id="level14-moves">0</span></p>' +
    '<div id="level14-container" class="hanoi-container">' +
      '<div class="hanoi-peg" id="peg0" onclick="level14ClickPeg(0)"></div>' +
      '<div class="hanoi-peg" id="peg1" onclick="level14ClickPeg(1)"></div>' +
      '<div class="hanoi-peg" id="peg2" onclick="level14ClickPeg(2)"></div>' +
    '</div>' +
    '<button class="btn-submit" onclick="level14Reset()">🔄 Reset</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;

  _level14Render();

  registerLevelCleanup(function() {
    for (var t = 0; t < _level14.timeouts.length; t++) {
      clearTimeout(_level14.timeouts[t]);
    }
    _level14.timeouts = [];
  });
}

_level14Render = function() {
  for (var p = 0; p < 3; p++) {
    var pegEl = document.getElementById('peg' + p);
    if (!pegEl) continue;

    if (p === _level14.selectedPeg) {
      pegEl.classList.add('selected');
    } else {
      pegEl.classList.remove('selected');
    }

    var existingDiscs = pegEl.querySelectorAll('.hanoi-disc');
    for (var d = 0; d < existingDiscs.length; d++) {
      existingDiscs[d].remove();
    }

    var peg = _level14.pegs[p];
    for (var i = 0; i < peg.length; i++) {
      var disc = document.createElement('div');
      disc.className = 'hanoi-disc hanoi-disc-' + peg[i];
      pegEl.appendChild(disc);
    }
  }

  var movesEl = document.getElementById('level14-moves');
  if (movesEl) movesEl.textContent = _level14.moves;
};

level14ClickPeg = function(pegIndex) {
  var content = document.getElementById('game-content');
  if (!content) return;

  if (_level14.selectedPeg === -1) {
    if (_level14.pegs[pegIndex].length === 0) {
      showFeedback(content, false, '❌ No disc on this peg! Select a peg with discs.');
      return;
    }
    _level14.selectedPeg = pegIndex;
    _level14Render();
  } else {
    if (_level14.selectedPeg === pegIndex) {
      _level14.selectedPeg = -1;
      _level14Render();
      return;
    }

    var fromPeg = _level14.pegs[_level14.selectedPeg];
    var toPeg = _level14.pegs[pegIndex];

    var disc = fromPeg[fromPeg.length - 1];
    var topOnTarget = toPeg.length > 0 ? toPeg[toPeg.length - 1] : 999;

    if (disc < topOnTarget) {
      fromPeg.pop();
      toPeg.push(disc);
      _level14.moves++;

      _level14.selectedPeg = -1;
      _level14Render();

      if (_level14.pegs[2].length === 4) {
        showFeedback(content, true, '🎉 Tower complete! Solved in ' + _level14.moves + ' moves!');
        var winT = setTimeout(function() {
          completeLevel(14);
        }, 1500);
        _level14.timeouts.push(winT);
      }
    } else {
      showFeedback(content, false, '❌ Cannot place larger disc on smaller one!');
      _level14.selectedPeg = -1;
      _level14Render();
    }
  }
};

level14Reset = function() {
  _level14.pegs = [[4, 3, 2, 1], [], []];
  _level14.selectedPeg = -1;
  _level14.moves = 0;
  _level14Render();
};
