// Level 3: Simon Says
// Memory color sequence game. 4 buttons, starts at 3-length sequence,
// adds one per round, 5 rounds total to win.

var _simon = {
  colors: ['red', 'blue', 'green', 'yellow'],
  sequence: [],
  playerIndex: 0,
  round: 0,
  totalRounds: 5,
  startLength: 3,
  isShowingSequence: false,
  timeouts: [],
  intervalId: null
};

function _simonClearTimers() {
  for (var i = 0; i < _simon.timeouts.length; i++) {
    clearTimeout(_simon.timeouts[i]);
  }
  _simon.timeouts = [];
  if (_simon.intervalId !== null) {
    clearInterval(_simon.intervalId);
    _simon.intervalId = null;
  }
}

function renderLevel3(container) {
  _simonClearTimers();
  _simon.sequence = [];
  _simon.playerIndex = 0;
  _simon.round = 0;
  _simon.isShowingSequence = false;

  var html =
    '<h3>🎨 Level 3: Simon Says</h3>' +
    '<p style="color:#aaa;">Watch the sequence, then repeat it!</p>' +
    '<p id="simon-status" style="color:#ffd700; font-size:1.1em; min-height:1.5em;">Round 1 of ' + _simon.totalRounds + '</p>' +
    '<div id="simon-board" class="simon-board">' +
      '<div class="simon-btn simon-red disabled" data-color="red" onclick="simonPlayerClick(\'red\')"></div>' +
      '<div class="simon-btn simon-blue disabled" data-color="blue" onclick="simonPlayerClick(\'blue\')"></div>' +
      '<div class="simon-btn simon-green disabled" data-color="green" onclick="simonPlayerClick(\'green\')"></div>' +
      '<div class="simon-btn simon-yellow disabled" data-color="yellow" onclick="simonPlayerClick(\'yellow\')"></div>' +
    '</div>' +
    '<p id="simon-feedback" class="game-feedback" style="min-height:1.5em;"></p>' +
    '<br>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;

  registerLevelCleanup(function() {
    _simonClearTimers();
    _simon.isShowingSequence = false;
  });

  // Start first round after a short delay
  var t = setTimeout(function() {
    simonNextRound();
  }, 800);
  _simon.timeouts.push(t);
}

function simonNextRound() {
  _simon.round++;
  _simon.playerIndex = 0;

  var status = document.getElementById('simon-status');
  if (status) {
    status.textContent = 'Round ' + _simon.round + ' of ' + _simon.totalRounds + ' — Watch carefully!';
  }

  // On round 1, generate initial sequence of startLength
  // On subsequent rounds, add one more color
  if (_simon.round === 1) {
    _simon.sequence = [];
    for (var i = 0; i < _simon.startLength; i++) {
      _simon.sequence.push(_simon.colors[Math.floor(Math.random() * 4)]);
    }
  } else {
    _simon.sequence.push(_simon.colors[Math.floor(Math.random() * 4)]);
  }

  simonSetButtons(false);
  simonShowSequence();
}

function simonSetButtons(enabled) {
  var btns = document.querySelectorAll('.simon-btn');
  for (var i = 0; i < btns.length; i++) {
    if (enabled) {
      btns[i].classList.remove('disabled');
    } else {
      btns[i].classList.add('disabled');
    }
  }
}

function simonShowSequence() {
  _simon.isShowingSequence = true;
  var idx = 0;
  var seqLen = _simon.sequence.length;

  function showNext() {
    if (idx >= seqLen) {
      // Done showing — enable player input
      _simon.isShowingSequence = false;
      _simon.playerIndex = 0;
      simonSetButtons(true);

      var status = document.getElementById('simon-status');
      if (status) {
        status.textContent = 'Round ' + _simon.round + ' of ' + _simon.totalRounds + ' — Your turn! (' + seqLen + ' colors)';
      }
      return;
    }

    var color = _simon.sequence[idx];
    simonFlashButton(color, 400);

    idx++;
    var t = setTimeout(showNext, 700);
    _simon.timeouts.push(t);
  }

  var startT = setTimeout(showNext, 500);
  _simon.timeouts.push(startT);
}

function simonFlashButton(color, duration) {
  var btn = document.querySelector('.simon-btn.simon-' + color);
  if (!btn) return;

  btn.classList.add('flash');
  var t = setTimeout(function() {
    btn.classList.remove('flash');
  }, duration || 400);
  _simon.timeouts.push(t);
}

function simonPlayerClick(color) {
  if (_simon.isShowingSequence) return;

  var content = document.getElementById('game-content');
  var feedback = document.getElementById('simon-feedback');

  // Flash the clicked button briefly
  simonFlashButton(color, 200);

  var expected = _simon.sequence[_simon.playerIndex];

  if (color !== expected) {
    // Wrong — restart from round 1
    if (feedback) {
      feedback.className = 'game-feedback wrong';
      feedback.textContent = '❌ Wrong! Expected ' + expected + '. Restarting...';
    }
    simonSetButtons(false);
    _simon.round = 0;
    _simon.sequence = [];

    var t = setTimeout(function() {
      if (feedback) feedback.textContent = '';
      simonNextRound();
    }, 1500);
    _simon.timeouts.push(t);
    return;
  }

  // Correct color
  _simon.playerIndex++;

  if (_simon.playerIndex >= _simon.sequence.length) {
    // Completed this round's sequence
    if (_simon.round >= _simon.totalRounds) {
      // Won the whole game!
      simonSetButtons(false);
      if (feedback) {
        feedback.className = 'game-feedback correct';
        feedback.textContent = '🎉 Perfect memory! All ' + _simon.totalRounds + ' rounds completed!';
      }
      var winT = setTimeout(function() {
        completeLevel(3);
      }, 1500);
      _simon.timeouts.push(winT);
    } else {
      // Move to next round
      if (feedback) {
        feedback.className = 'game-feedback correct';
        feedback.textContent = '✅ Round ' + _simon.round + ' complete!';
      }
      simonSetButtons(false);

      var nextT = setTimeout(function() {
        if (feedback) feedback.textContent = '';
        simonNextRound();
      }, 1200);
      _simon.timeouts.push(nextT);
    }
  }
}
