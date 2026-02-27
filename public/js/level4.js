// Level 4: Aim Trainer
// Click 10 targets as fast as possible. Targets appear one at a time in random positions.

var _level4 = {
  targetsHit: 0,
  totalTargets: 10,
  startTime: 0,
  targetTimeout: null
};

function renderLevel4(container) {
  _level4.targetsHit = 0;
  _level4.totalTargets = 10;
  _level4.startTime = 0;
  _level4.targetTimeout = null;

  var html =
    '<h3>🎯 Level 4: Aim Trainer</h3>' +
    '<p style="color:#aaa;">Click the <strong style="color:#e94560;">red targets</strong> as fast as you can!</p>' +
    '<p style="color:#ffd700; font-size:1.1em;">Targets hit: <span id="level4-count">0</span> / ' + _level4.totalTargets + '</p>' +
    '<p id="level4-timer" style="color:#aaa; font-size:1.1em; min-height:1.5em;"></p>' +
    '<div id="level4-arena" class="aim-arena"></div>' +
    '<br>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;

  showFocusMode();
  playIntenseMode();

  _level4.spawnTarget();
  _level4.startTime = Date.now();

  registerLevelCleanup(function() {
    if (_level4.targetTimeout) {
      clearTimeout(_level4.targetTimeout);
      _level4.targetTimeout = null;
    }
    stopIntenseMode();
    hideFocusMode();
  });
}

_level4.spawnTarget = function() {
  var arena = document.getElementById('level4-arena');
  if (!arena) return;

  arena.innerHTML = '';

  var target = document.createElement('div');
  target.className = 'aim-target';
  
  var arenaRect = arena.getBoundingClientRect();
  var maxX = 360;
  var maxY = 360;
  
  target.style.left = Math.floor(Math.random() * maxX) + 'px';
  target.style.top = Math.floor(Math.random() * maxY) + 'px';

  target.onmousedown = function(e) {
    e.preventDefault();
    playSound('tick');
    screenShake(100);
    _level4.hitTarget();
  };

  arena.appendChild(target);
};

_level4.hitTarget = function() {
  _level4.targetsHit++;
  
  var countEl = document.getElementById('level4-count');
  if (countEl) {
    countEl.textContent = _level4.targetsHit;
    addGlowEffect(countEl, '#2ecc71');
  }

  if (_level4.targetsHit >= _level4.totalTargets) {
    var elapsed = Date.now() - _level4.startTime;
    var timerEl = document.getElementById('level4-timer');
    if (timerEl) {
      timerEl.textContent = elapsed + 'ms — INCREDIBLE! 🎯';
      timerEl.style.color = '#2ecc71';
    }
    
    stopIntenseMode();
    hideFocusMode();
    
    var arena = document.getElementById('level4-arena');
    if (arena) arena.innerHTML = '';
    
    playSound('win');
    emojiPop(10, ['🎯','💎','🔥','⚡','🌟']);
    comboPopup('SHARP SHOOTER!');
    
    var content = document.getElementById('game-content');
    if (content) {
      showFeedback(content, true, '🎉 All ' + _level4.totalTargets + ' targets hit in ' + elapsed + 'ms!');
    }
    
    setTimeout(function() {
      completeLevel(4);
    }, 1500);
  } else {
    _level4.spawnTarget();
  }
};
