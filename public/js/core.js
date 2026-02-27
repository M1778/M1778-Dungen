// M1778-Dungen Core Game System
// Uses sha256() and isAuthenticated() from auth.js

var GAME_VERSION = 3;
var LEVELS = [
  { id: 1, title: 'Level 1: The Simple Math', description: 'A basic math problem... or is it? 🤔', prize: 20000 },
  { id: 2, title: 'Level 2: Reaction Test', description: 'How fast are your reflexes? ⚡', prize: 20000 },
  { id: 3, title: 'Level 3: Simon Says', description: 'Remember the color sequence! 🎨', prize: 20000 },
  { id: 4, title: 'Level 4: Aim Trainer', description: 'Click 10 targets as fast as you can! 🎯', prize: 20000 },
  { id: 5, title: 'Level 5: Bot or Not?', description: 'Prove your humanity... or lack thereof 🤖', prize: 20000 },
  { id: 6, title: 'Level 6: Memory Cards', description: 'Match all 6 card pairs! 🃏', prize: 30000 },
  { id: 7, title: 'Level 7: Maze Runner', description: 'Navigate the maze with arrow keys! 🏃', prize: 30000 },
  { id: 8, title: 'Level 8: Speed Typer', description: 'Type the string... backwards! ⌨️', prize: 30000 },
  { id: 9, title: 'Level 9: Pattern Lock', description: 'Reproduce the grid pattern! 🔐', prize: 30000 },
  { id: 10, title: 'Level 10: Color Mixer', description: 'Mix RGB to match the target color! 🎨', prize: 30000 },
  { id: 11, title: 'Level 11: Sliding Puzzle', description: 'Solve the 3×3 tile puzzle! 🧩', prize: 40000 },
  { id: 12, title: 'Level 12: Spot the Difference', description: 'Find the differences in the grids! 🔍', prize: 40000 },
  { id: 13, title: 'Level 13: Rhythm Sequence', description: 'Repeat the timed button presses! 🥁', prize: 40000 },
  { id: 14, title: 'Level 14: Tower of Hanoi', description: 'Solve the 4-disc classic puzzle! 🗼', prize: 40000 },
  { id: 15, title: 'Level 15: The Impossible', description: 'The final question... if you dare 💀', prize: 100000 }
];

var STORAGE_KEY = 'm1778_dungen_progress';
var VERSION_KEY = 'm1778_dungen_version';
var TIMESTAMPS_KEY = 'm1778_dungen_timestamps';

// Audio Context for sound effects
var _audioCtx = null;
function getAudioContext() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _audioCtx;
}

function playSound(type) {
  try {
    var ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    switch(type) {
      case 'success':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        break;
      case 'fail':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        break;
      case 'tick':
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
        break;
      case 'intense':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.setValueAtTime(120, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(80, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        break;
      case 'win':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.3);
        osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
        break;
    }
  } catch(e) {}
}

// Animation helpers
function screenShake(intensity) {
  document.body.classList.add('screen-shake');
  setTimeout(function() { document.body.classList.remove('screen-shake'); }, intensity || 500);
}

function emojiPop(count, emojis) {
  if (!emojis) emojis = ['🔥','💥','⚡','🎯','💎','🌟','⭐','✨','💫','🎪'];
  for (var i = 0; i < (count || 5); i++) {
    setTimeout(function() {
      var pop = document.createElement('div');
      pop.className = 'emoji-pop';
      pop.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      pop.style.top = (Math.random() * 60 + 20) + '%';
      pop.style.animationDuration = (1.5 + Math.random()) + 's';
      document.body.appendChild(pop);
      setTimeout(function() { pop.remove(); }, 2000);
    }, i * 150);
  }
}

function flashScreen(color) {
  var flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:' + (color || 'rgba(255,0,0,0.3)') + ';z-index:99999;pointer-events:none;';
  document.body.appendChild(flash);
  setTimeout(function() { flash.remove(); }, 300);
}

function playIntenseMode() {
  document.body.classList.add('intense-mode');
}

function stopIntenseMode() {
  document.body.classList.remove('intense-mode');
}

function addGlowEffect(element, color) {
  if (element) {
    element.style.animation = 'glowText 1s ease-in-out';
    element.style.color = color || '#ffd700';
  }
}

function comboPopup(text) {
  var combo = document.createElement('div');
  combo.className = 'combo-display';
  combo.textContent = text || 'COMBO!';
  document.body.appendChild(combo);
  setTimeout(function() { combo.remove(); }, 600);
}

function triggerWrongShake(element) {
  if (element) {
    element.classList.add('wrong-shake');
    setTimeout(function() { element.classList.remove('wrong-shake'); }, 400);
  }
}

function showFocusMode() {
  document.body.classList.add('focus-mode');
}

function hideFocusMode() {
  document.body.classList.remove('focus-mode');
}

function checkVersion() {
  try {
    var savedVersion = localStorage.getItem(VERSION_KEY);
    if (!savedVersion) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify({}));
      localStorage.setItem(VERSION_KEY, GAME_VERSION.toString());
      console.log('[M1778-Dungen] New game started.');
    } else {
      console.log('[M1778-Dungen] Continuing game. Version:', savedVersion);
    }
  } catch (e) {
    console.error('[M1778-Dungen] Version check error:', e);
  }
}

function getTimestamps() {
  try {
    var data = localStorage.getItem(TIMESTAMPS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return {};
}

function saveTimestamp(levelId, timestamp) {
  var ts = getTimestamps();
  ts[levelId.toString()] = timestamp;
  localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify(ts));
}

function getTimestamp(levelId) {
  var ts = getTimestamps();
  return ts[levelId.toString()] || 0;
}

function detectCheating() {
  var ts = getTimestamps();
  var levelIds = Object.keys(ts).map(function(k) { return parseInt(k, 10); }).sort(function(a,b){return a-b;});
  
  if (levelIds.length < 3) return false;
  
  var firstTime = ts[levelIds[0]];
  var lastTime = ts[levelIds[levelIds.length - 1]];
  var elapsedMs = lastTime - firstTime;
  var elapsedMinutes = elapsedMs / 60000;
  
  var completedCount = levelIds.length;
  var avgTimePerLevel = elapsedMs / completedCount;
  
  if (completedCount >= 10 && elapsedMinutes < 5) {
    console.log('[M1778-Dungen] Cheat detected: completed ' + completedCount + ' levels in ' + elapsedMinutes.toFixed(1) + ' minutes');
    return true;
  }
  
  if (avgTimePerLevel < 5000 && completedCount >= 8) {
    console.log('[M1778-Dungen] Cheat detected: avg ' + (avgTimePerLevel/1000).toFixed(1) + 's per level');
    return true;
  }
  
  return false;
}

function showCheatWarning() {
  if (!detectCheating()) return;
  
  var warning = document.createElement('div');
  warning.id = 'cheat-warning';
  warning.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#e74c3c;color:#fff;padding:15px;text-align:center;z-index:99999;font-weight:bold;';
  warning.textContent = '⚠️ SUSPICIOUS ACTIVITY DETECTED! Your progress has been flagged for review. ⚠️';
  document.body.appendChild(warning);
  
  setTimeout(function() {
    if (warning.parentNode) warning.parentNode.removeChild(warning);
  }, 5000);
}

function rebirth() {
  if (!confirm('⚠️ REBIRTH WARNING ⚠️\n\nThis will COMPLETELY reset all your progress:\n• All completed levels\n• Total donation money\n\nThis cannot be undone! Are you sure?')) return;
  
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TIMESTAMPS_KEY);
  localStorage.removeItem(VERSION_KEY);
  
  alert('🔥 REBIRTH COMPLETE! 🔥\n\nYour journey starts over. Good luck!');
  
  checkVersion();
  renderLevels();
  updateDonation();
}

function getProgress() {
  try {
    var data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('[M1778-Dungen] getProgress error:', e);
  }
  return [];
}

function saveProgress(completed) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  console.log('[M1778-Dungen] Progress saved:', completed);
}

function isLevelCompleted(levelId) {
  return getProgress().indexOf(levelId) !== -1;
}

function markLevelCompleted(levelId) {
  var completed = getProgress();
  if (completed.indexOf(levelId) === -1) {
    completed.push(levelId);
    saveProgress(completed);
    saveTimestamp(levelId, Date.now());
  }
}

function isLevelUnlocked(levelId) {
  if (levelId === 1) return true;
  return isLevelCompleted(levelId - 1);
}

function calculateDonation() {
  var total = 0;
  var completed = getProgress();
  for (var i = 0; i < LEVELS.length; i++) {
    if (completed.indexOf(LEVELS[i].id) !== -1) {
      total += LEVELS[i].prize;
    }
  }
  return total;
}

function updateDonation() {
  var el = document.getElementById('donation-amount');
  if (el) {
    el.textContent = calculateDonation().toLocaleString() + ' $';
  }
}

function renderLevels() {
  var grid = document.getElementById('levels-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (var i = 0; i < LEVELS.length; i++) {
    var level = LEVELS[i];
    var completed = isLevelCompleted(level.id);
    var unlocked = isLevelUnlocked(level.id);
    var statusClass = completed ? 'completed' : (unlocked ? 'unlocked' : 'locked');

    var card = document.createElement('div');
    card.className = 'level-card ' + statusClass;
    card.setAttribute('data-level', level.id);

    var statusText = completed ? '✅ COMPLETED' : (unlocked ? '🔓 Click to Play' : '🔒 Locked');
    var statusCls = completed ? 'level-status completed-text' : 'level-status';

    var actionsHtml = '';
    if (completed) {
      actionsHtml = '<div class="level-actions">' +
        '<button class="btn-submit" onclick="retryLevel(' + level.id + ')">🔄 Retry</button>' +
        '</div>';
    } else if (unlocked) {
      actionsHtml = '<div class="level-actions">' +
        '<button class="btn-submit" onclick="openLevel(' + level.id + ')">▶ Play</button>' +
        '</div>';
    }

    card.innerHTML =
      '<div class="level-card-header">' +
        '<h4>' + level.title + '</h4>' +
        '<span class="level-prize">' + (completed ? '✅ ' : '') + level.prize.toLocaleString() + ' $</span>' +
      '</div>' +
      '<p class="' + statusCls + '">' + level.description + '</p>' +
      '<p class="' + statusCls + '">' + statusText + '</p>' +
      actionsHtml;

    if (completed) {
      (function(lvl) {
        card.addEventListener('click', function(e) {
          if (e.target.tagName === 'BUTTON') return;
          retryLevel(lvl.id);
        });
      })(level);
    } else if (unlocked && !completed) {
      (function(lvl) {
        card.addEventListener('click', function(e) {
          if (e.target.tagName === 'BUTTON') return;
          openLevel(lvl.id);
        });
      })(level);
    }

    grid.appendChild(card);
  }
}

function openLevel(levelId) {
  var gameArea = document.getElementById('game-area');
  var content = document.getElementById('game-content');
  if (!gameArea || !content) return;

  content.innerHTML = '';
  gameArea.classList.add('active');

  var renderFn = window['renderLevel' + levelId];
  if (renderFn) {
    renderFn(content);
  } else {
    content.innerHTML = '<h3>Level ' + levelId + '</h3><p>Coming soon...</p>' +
      '<button class="btn-close" onclick="closeGame()">Close</button>';
  }

  gameArea.scrollIntoView({ behavior: 'smooth' });
}

function retryLevel(levelId) {
  window._isRetryMode = true;
  var gameArea = document.getElementById('game-area');
  var content = document.getElementById('game-content');
  if (!gameArea || !content) return;

  content.innerHTML = '';
  gameArea.classList.add('active');

  var html = '<div style="text-align:center; padding:20px;">';
  html += '<h3 style="color:#ffd700; margin-bottom:10px;">🔄 Retry: Level ' + levelId + '</h3>';
  html += '<p style="color:#e94560; margin-bottom:20px;">⛔ No prize - just for practice!</p>';
  html += '</div>';
  content.innerHTML = html;

  var renderFn = window['renderLevel' + levelId];
  if (renderFn) {
    setTimeout(function() {
      renderFn(content);
    }, 500);
  }

  gameArea.scrollIntoView({ behavior: 'smooth' });
}

function closeGame() {
  var gameArea = document.getElementById('game-area');
  if (gameArea) gameArea.classList.remove('active');
  if (typeof cleanupCurrentLevel === 'function') cleanupCurrentLevel();
  window._isRetryMode = false;
}

function completeLevel(levelId) {
  var isRetry = window._isRetryMode === true;
  window._isRetryMode = false;
  
  if (!isRetry) {
    markLevelCompleted(levelId);
    updateDonation();
  }
  renderLevels();

  var content = document.getElementById('game-content');
  if (!content) return;

  var prize = 0;
  for (var i = 0; i < LEVELS.length; i++) {
    if (LEVELS[i].id === levelId) { prize = LEVELS[i].prize; break; }
  }

  var allDone = true;
  for (var j = 0; j < LEVELS.length; j++) {
    if (!isLevelCompleted(LEVELS[j].id)) { allDone = false; break; }
  }

  if (allDone && !isRetry) {
    closeGame();
    showCompletion();
    return;
  }

  var html = '';
  if (isRetry) {
    html = '<h3>🎯 Practice Complete! 🎯</h3>' +
      '<p style="font-size:1.2em; color:#e94560; margin:15px 0;">⛔ No prize awarded - just practicing!</p>' +
      '<p style="color:#aaa;">Keep practicing to master this level!</p>';
  } else {
    html = '<h3>🎉 Level ' + levelId + ' Complete! 🎉</h3>' +
      '<p style="font-size:1.3em; color:#2ecc71; margin:15px 0;">You earned <strong>' + prize.toLocaleString() + ' $</strong>!</p>' +
      '<p style="color:#ffd700;">Total Donation: <strong>' + calculateDonation().toLocaleString() + ' $</strong></p>';
  }

  if (levelId < 15 && !isRetry) {
    html += '<p style="margin-top:10px;">Level ' + (levelId + 1) + ' is now unlocked! 🔓</p>';
  }

  html += '<br><button class="btn-close" onclick="closeGame()">Close</button>';
  content.innerHTML = html;
}

function showFeedback(container, correct, message) {
  var fb = container.querySelector('.game-feedback');
  if (!fb) {
    fb = document.createElement('p');
    fb.className = 'game-feedback';
    container.appendChild(fb);
  }
  fb.className = 'game-feedback ' + (correct ? 'correct' : 'wrong');
  fb.textContent = message;
  
  if (correct) {
    playSound('success');
  } else {
    playSound('fail');
  }
}

function triggerJumpscare(callback) {
  var overlay = document.getElementById('jumpscare-overlay');
  if (!overlay) { if (callback) callback(); return; }
  overlay.classList.add('active');

  var audio = new AudioContext();
  var osc = audio.createOscillator();
  var gain = audio.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 200;
  osc.frequency.linearRampToValueAtTime(800, audio.currentTime + 0.5);
  gain.gain.value = 0.5;
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();

  setTimeout(function() {
    osc.stop();
    audio.close();
    overlay.classList.remove('active');
    if (callback) callback();
  }, 2000);
}

function showCompletion() {
  var overlay = document.getElementById('completion-overlay');
  var totalEl = document.getElementById('completion-total');
  if (!overlay) return;

  if (totalEl) {
    totalEl.textContent = 'Await the donation of ' + calculateDonation().toLocaleString() + ' $';
  }

  overlay.classList.add('active');
  playSound('win');
  emojiPop(15, ['🏆','🎉','💰','🌟','💎','🔥','⚡']);
  spawnConfetti();
}

function closeCompletion() {
  var overlay = document.getElementById('completion-overlay');
  if (overlay) overlay.classList.remove('active');
}

function spawnConfetti() {
  var container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  var colors = ['#ffd700', '#e94560', '#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6', '#1abc9c'];
  for (var i = 0; i < 80; i++) {
    var piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 3) + 's';
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    container.appendChild(piece);
  }
}

// Cleanup hook for levels that need it (keyboard listeners, intervals, etc.)
var _levelCleanups = [];
function registerLevelCleanup(fn) {
  _levelCleanups.push(fn);
}
function cleanupCurrentLevel() {
  for (var i = 0; i < _levelCleanups.length; i++) {
    try { _levelCleanups[i](); } catch (e) {}
  }
  _levelCleanups = [];
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  checkVersion();
  showCheatWarning();
  renderLevels();
  updateDonation();
});
