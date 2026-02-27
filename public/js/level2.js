// Level 2: Reaction Test
// Click the box when it turns green. React under 200ms to pass.

var _level2TimeoutId = null;
var _level2StartTime = 0;
var _level2State = 'idle'; // idle, waiting, ready

function renderLevel2(container) {
  _level2State = 'idle';
  _level2StartTime = 0;

  var html =
    '<h3>⚡ Level 2: Reaction Test</h3>' +
    '<p style="color:#aaa;">Click the box when it turns <strong style="color:#2ecc71;">GREEN</strong>.</p>' +
    '<p style="color:#e94560; font-size:0.95em;">You must react in under <strong>200ms</strong> to pass!</p>' +
    '<div id="reaction-box" class="reaction-box" onclick="handleReactionClick()">' +
      'Click here to start' +
    '</div>' +
    '<p id="reaction-result" style="font-size:1.1em; min-height:1.5em;"></p>' +
    '<br>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;

  registerLevelCleanup(function() {
    if (_level2TimeoutId !== null) {
      clearTimeout(_level2TimeoutId);
      _level2TimeoutId = null;
    }
    _level2State = 'idle';
    stopIntenseMode();
    hideFocusMode();
  });
}

function handleReactionClick() {
  var box = document.getElementById('reaction-box');
  var result = document.getElementById('reaction-result');
  if (!box || !result) return;

  if (_level2State === 'idle') {
    _level2State = 'waiting';
    box.className = 'reaction-box waiting pulse-border';
    box.textContent = 'Wait for green...';
    result.textContent = '';
    result.style.color = '';
    playIntenseMode();
    showFocusMode();

    var delay = Math.floor(Math.random() * 4000) + 1000;
    _level2TimeoutId = setTimeout(function() {
      if (_level2State !== 'waiting') return;
      _level2State = 'ready';
      _level2StartTime = Date.now();
      box.className = 'reaction-box ready';
      box.textContent = 'CLICK NOW!';
      playSound('intense');
      emojiPop(3, ['⚡','🔥','💥']);
      _level2TimeoutId = null;
    }, delay);

  } else if (_level2State === 'waiting') {
    if (_level2TimeoutId !== null) {
      clearTimeout(_level2TimeoutId);
      _level2TimeoutId = null;
    }
    _level2State = 'idle';
    box.className = 'reaction-box result';
    box.textContent = 'Click here to try again';
    result.textContent = '🚫 Too early! Wait for the box to turn green.';
    result.style.color = '#ff6b6b';
    stopIntenseMode();
    hideFocusMode();
    playSound('fail');
    triggerWrongShake(box);

  } else if (_level2State === 'ready') {
    var reactionTime = Date.now() - _level2StartTime;
    _level2State = 'idle';
    box.className = 'reaction-box result';
    stopIntenseMode();
    hideFocusMode();

    if (reactionTime <= 200) {
      box.textContent = reactionTime + 'ms — INCREDIBLE! 🎉';
      result.textContent = '✅ ' + reactionTime + 'ms! You passed!';
      result.style.color = '#2ecc71';
      playSound('win');
      emojiPop(8, ['⚡','🎉','💎','🌟','🔥']);
      comboPopup('SUPER FAST!');
      setTimeout(function() {
        completeLevel(2);
      }, 1500);
    } else {
      box.textContent = reactionTime + 'ms — Click to retry';
      result.textContent = '❌ ' + reactionTime + 'ms — Too slow! Need under 200ms.';
      result.style.color = '#ff6b6b';
      playSound('fail');
      triggerWrongShake(box);
    }
  }
}
