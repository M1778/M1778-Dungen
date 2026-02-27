// Level 13: Rhythm Sequence
// Repeat the timed button presses. 4 colored buttons flash in sequence.

var _level13 = {
  sequence: [],
  playerIndex: 0,
  round: 0,
  totalRounds: 5,
  isShowingSequence: false,
  timeouts: [],
  intervalId: null
};

function _level13ClearTimers() {
  for (var i = 0; i < _level13.timeouts.length; i++) {
    clearTimeout(_level13.timeouts[i]);
  }
  _level13.timeouts = [];
  if (_level13.intervalId !== null) {
    clearInterval(_level13.intervalId);
    _level13.intervalId = null;
  }
}

function renderLevel13(container) {
  _level13ClearTimers();
  _level13.sequence = [];
  _level13.playerIndex = 0;
  _level13.round = 0;
  _level13.isShowingSequence = false;

  var html =
    '<h3>🥁 Level 13: Rhythm Sequence</h3>' +
    '<p style="color:#aaa;">Watch the pattern, then repeat it in the same rhythm!</p>' +
    '<p id="level13-status" style="color:#ffd700; font-size:1.1em; min-height:1.5em;">Round 1 of ' + _level13.totalRounds + '</p>' +
    '<div id="level13-buttons" class="rhythm-display">' +
      '<div class="rhythm-btn rhythm-red" data-color="0" onclick="level13PlayerClick(0)"></div>' +
      '<div class="rhythm-btn rhythm-blue" data-color="1" onclick="level13PlayerClick(1)"></div>' +
      '<div class="rhythm-btn rhythm-green" data-color="2" onclick="level13PlayerClick(2)"></div>' +
      '<div class="rhythm-btn rhythm-yellow" data-color="3" onclick="level13PlayerClick(3)"></div>' +
    '</div>' +
    '<p id="level13-feedback" class="game-feedback" style="min-height:1.5em;"></p>' +
    '<br>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;

  var btns = document.querySelectorAll('.rhythm-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.add('disabled');
  }

  registerLevelCleanup(function() {
    _level13ClearTimers();
    _level13.isShowingSequence = false;
  });

  setTimeout(function() {
    level13NextRound();
  }, 800);
}

function level13NextRound() {
  _level13.round++;
  _level13.playerIndex = 0;

  var status = document.getElementById('level13-status');
  if (status) {
    status.textContent = 'Round ' + _level13.round + ' of ' + _level13.totalRounds + ' — Watch the rhythm!';
  }

  _level13.sequence.push(Math.floor(Math.random() * 4));

  level13ShowSequence();
}

function level13ShowSequence() {
  _level13.isShowingSequence = true;
  var idx = 0;
  var seqLen = _level13.sequence.length;
  var btns = document.querySelectorAll('.rhythm-btn');

  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.add('disabled');
  }

  function showNext() {
    if (idx >= seqLen) {
      _level13.isShowingSequence = false;
      _level13.playerIndex = 0;

      for (var j = 0; j < btns.length; j++) {
        btns[j].classList.remove('disabled');
      }

      var status = document.getElementById('level13-status');
      if (status) {
        status.textContent = 'Round ' + _level13.round + ' of ' + _level13.totalRounds + ' — Your turn!';
      }
      return;
    }

    var btnIdx = _level13.sequence[idx];
    var btn = btns[btnIdx];
    if (btn) {
      btn.classList.add('flash');
      var t = setTimeout(function() {
        btn.classList.remove('flash');
      }, 300);
      _level13.timeouts.push(t);
    }

    idx++;
    var nextT = setTimeout(showNext, 500);
    _level13.timeouts.push(nextT);
  }

  var startT = setTimeout(showNext, 500);
  _level13.timeouts.push(startT);
}

function level13PlayerClick(btnIdx) {
  if (_level13.isShowingSequence) return;

  var btns = document.querySelectorAll('.rhythm-btn');
  var btn = btns[btnIdx];
  if (btn) {
    btn.classList.add('pressed');
    setTimeout(function() {
      btn.classList.remove('pressed');
    }, 150);
  }

  var expected = _level13.sequence[_level13.playerIndex];
  var feedback = document.getElementById('level13-feedback');

  if (btnIdx !== expected) {
    if (feedback) {
      feedback.className = 'game-feedback wrong';
      feedback.textContent = '❌ Wrong! Expected button ' + (expected + 1) + '. Restarting...';
    }
    _level13.round = 0;
    _level13.sequence = [];

    var t = setTimeout(function() {
      if (feedback) feedback.textContent = '';
      level13NextRound();
    }, 1500);
    _level13.timeouts.push(t);
    return;
  }

  _level13.playerIndex++;

  if (_level13.playerIndex >= _level13.sequence.length) {
    if (_level13.round >= _level13.totalRounds) {
      for (var j = 0; j < btns.length; j++) {
        btns[j].classList.add('disabled');
      }
      if (feedback) {
        feedback.className = 'game-feedback correct';
        feedback.textContent = '🎉 Perfect rhythm! All ' + _level13.totalRounds + ' rounds completed!';
      }
      var winT = setTimeout(function() {
        completeLevel(13);
      }, 1500);
      _level13.timeouts.push(winT);
    } else {
      if (feedback) {
        feedback.className = 'game-feedback correct';
        feedback.textContent = '✅ Round ' + _level13.round + ' complete!';
      }
      for (var k = 0; k < btns.length; k++) {
        btns[k].classList.add('disabled');
      }

      var nextT = setTimeout(function() {
        if (feedback) feedback.textContent = '';
        level13NextRound();
      }, 1200);
      _level13.timeouts.push(nextT);
    }
  }
}
