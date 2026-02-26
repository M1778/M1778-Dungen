// M1778-Dungen Challenges
// Uses sha256() and isAuthenticated() from auth.js

var LEVELS = [
  {
    id: 1,
    title: 'Level 1: The Simple Math',
    description: 'A basic math problem... or is it? 🤔',
    prize: 20000
  },
  {
    id: 2,
    title: 'Level 2: Speed Test',
    description: 'How fast are your reflexes? ⚡',
    prize: 20000
  },
  {
    id: 3,
    title: 'Level 3: Quiz Time',
    description: 'Answer the question correctly! 🧠',
    prize: 20000
  },
  {
    id: 4,
    title: 'Level 4: Brain Breaker',
    description: 'Only math geniuses can solve this! 🔢',
    prize: 20000
  },
  {
    id: 5,
    title: 'Level 5: Bot or Not?',
    description: 'Prove your humanity... or lack thereof 🤖',
    prize: 20000
  },
  {
    id: 6,
    title: 'Level 6: Iranian Geography',
    description: 'How well do you know Iran\'s land? 🏔️',
    prize: 30000
  },
  {
    id: 7,
    title: 'Level 7: Iranian Culture',
    description: 'A question about Iranian traditions 🎭',
    prize: 30000
  },
  {
    id: 8,
    title: 'Level 8: Iranian Cuisine',
    description: 'Do you know Iranian food? 🍚',
    prize: 30000
  },
  {
    id: 9,
    title: 'Level 9: Iran Expert',
    description: 'Only true Iran experts can answer this 📚',
    prize: 30000
  },
  {
    id: 10,
    title: 'Level 10: The Impossible',
    description: 'Guess the creator\'s REAL name... 💀',
    prize: 100000
  }
];

var STORAGE_KEY = 'm1778_dungen_progress';
var reactionTimeout = null;
var reactionStartTime = 0;
var reactionState = 'idle';

function getProgress() {
  try {
    var data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return [];
}

function saveProgress(completed) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
}

function isLevelCompleted(levelId) {
  var completed = getProgress();
  return completed.indexOf(levelId) !== -1;
}

function markLevelCompleted(levelId) {
  var completed = getProgress();
  if (completed.indexOf(levelId) === -1) {
    completed.push(levelId);
    saveProgress(completed);
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
    var amount = calculateDonation();
    el.textContent = amount.toLocaleString() + ' $';
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

    card.innerHTML =
      '<div class="level-card-header">' +
        '<h4>' + level.title + '</h4>' +
        '<span class="level-prize">' + (completed ? '✅ ' : '') + level.prize.toLocaleString() + ' $</span>' +
      '</div>' +
      '<p class="' + statusCls + '">' + level.description + '</p>' +
      '<p class="' + statusCls + '">' + statusText + '</p>';

    if (unlocked && !completed) {
      (function(lvl) {
        card.addEventListener('click', function() {
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

  switch (levelId) {
    case 1: renderLevel1(content); break;
    case 2: renderLevel2(content); break;
    case 3: renderLevel3(content); break;
    case 4: renderLevel4(content); break;
    case 5: renderLevel5(content); break;
    case 6: renderLevel6(content); break;
    case 7: renderLevel7(content); break;
    case 8: renderLevel8(content); break;
    case 9: renderLevel9(content); break;
    case 10: renderLevel10(content); break;
  }

  gameArea.scrollIntoView({ behavior: 'smooth' });
}

function closeGame() {
  var gameArea = document.getElementById('game-area');
  if (gameArea) gameArea.classList.remove('active');
  if (reactionTimeout) {
    clearTimeout(reactionTimeout);
    reactionTimeout = null;
  }
  reactionState = 'idle';
}

function completeLevel(levelId) {
  markLevelCompleted(levelId);
  updateDonation();
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

  var html =
    '<h3>🎉 Level ' + levelId + ' Complete! 🎉</h3>' +
    '<p style="font-size:1.3em; color:#2ecc71; margin:15px 0;">You earned <strong>' + prize.toLocaleString() + ' $</strong> for the donation pool!</p>' +
    '<p style="color:#ffd700;">Total Donation: <strong>' + calculateDonation().toLocaleString() + ' $</strong></p>';

  if (allDone) {
    html += '<p style="font-size:1.5em; color:#ffd700; margin-top:20px;">🏆 ALL LEVELS COMPLETED! 🏆</p>' +
            '<p style="color:#2ecc71;">Pony.gamer has conquered the entire dungeon!</p>' +
            '<p style="font-size:1.8em; color:#ffd700; margin-top:10px;">Total Earned: ' + calculateDonation().toLocaleString() + ' $</p>';
  } else if (levelId < 10) {
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
}

// ==================== LEVEL 1: The Simple Math ====================
function renderLevel1(container) {
  container.innerHTML =
    '<h3>📐 Level 1: The Simple Math 📐</h3>' +
    '<p style="font-size:2em; color:#ffd700; margin:20px 0;">2 + 2 = ?</p>' +
    '<p style="color:#aaa; font-style:italic;">Hint: The answer is NOT what you learned in school... 😏</p>' +
    '<p style="color:#666; font-size:0.85em;">Think about the name of this project...</p>' +
    '<input type="text" class="game-input" id="level1-input" placeholder="Enter your answer...">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel1()">Submit Answer</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  document.getElementById('level1-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLevel1();
  });
}

function checkLevel1() {
  var input = document.getElementById('level1-input');
  var answer = input.value.trim();
  var container = document.getElementById('game-content');

  if (answer === '1778') {
    showFeedback(container, true, '✅ Correct! 2 + 2 = 1778 in the M1778 universe! 🎉');
    setTimeout(function() { completeLevel(1); }, 1500);
  } else if (answer === '4') {
    showFeedback(container, false, '❌ That\'s what they WANT you to think... Try again! 🤔');
    input.value = '';
    input.focus();
  } else {
    showFeedback(container, false, '❌ Nope! Think harder... What makes this project special? 🧐');
    input.value = '';
    input.focus();
  }
}

// ==================== LEVEL 2: Reaction Test ====================
function renderLevel2(container) {
  container.innerHTML =
    '<h3>⚡ Level 2: Reaction Test ⚡</h3>' +
    '<p>Click the box when it turns <span style="color:#2ecc71; font-weight:bold;">GREEN</span>!</p>' +
    '<p style="color:#aaa;">You need to react in under <strong>500ms</strong> to pass!</p>' +
    '<div class="reaction-box result" id="reaction-box">Click here to start!</div>' +
    '<p id="reaction-result" style="margin-top:10px;"></p>' +
    '<br>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  reactionState = 'idle';
  document.getElementById('reaction-box').addEventListener('click', handleReactionClick);
}

function handleReactionClick() {
  var box = document.getElementById('reaction-box');
  var result = document.getElementById('reaction-result');
  if (!box) return;

  if (reactionState === 'idle') {
    reactionState = 'waiting';
    box.className = 'reaction-box waiting';
    box.textContent = 'Wait for GREEN...';
    result.textContent = '';

    var delay = 1000 + Math.random() * 4000;
    reactionTimeout = setTimeout(function() {
      reactionState = 'ready';
      box.className = 'reaction-box ready';
      box.textContent = 'CLICK NOW!';
      reactionStartTime = Date.now();
    }, delay);

  } else if (reactionState === 'waiting') {
    clearTimeout(reactionTimeout);
    reactionTimeout = null;
    reactionState = 'idle';
    box.className = 'reaction-box result';
    box.textContent = 'Too early! 😅 Click to try again.';
    result.textContent = '❌ You clicked too early! Wait for the GREEN color!';
    result.style.color = '#ff6b6b';

  } else if (reactionState === 'ready') {
    var reactionTime = Date.now() - reactionStartTime;
    reactionState = 'idle';
    box.className = 'reaction-box result';

    if (reactionTime <= 500) {
      box.textContent = reactionTime + 'ms - AMAZING! 🎉';
      result.textContent = '✅ ' + reactionTime + 'ms! Lightning fast! ⚡';
      result.style.color = '#2ecc71';
      setTimeout(function() { completeLevel(2); }, 1500);
    } else {
      box.textContent = reactionTime + 'ms - Too slow! Click to retry.';
      result.textContent = '❌ ' + reactionTime + 'ms — You need under 500ms! Try again!';
      result.style.color = '#ff6b6b';
    }
  }
}

// ==================== LEVEL 3: Quiz Time ====================
function renderLevel3(container) {
  container.innerHTML =
    '<h3>🧠 Level 3: Quiz Time 🧠</h3>' +
    '<p style="font-size:1.2em; margin:15px 0;">Which planet is known as the "Red Planet"?</p>' +
    '<div style="display:flex; flex-direction:column; gap:10px; max-width:350px; margin:15px auto;">' +
      '<button class="btn-submit" onclick="checkLevel3(\'venus\')">🪐 Venus</button>' +
      '<button class="btn-submit" onclick="checkLevel3(\'mars\')">🔴 Mars</button>' +
      '<button class="btn-submit" onclick="checkLevel3(\'jupiter\')">🟠 Jupiter</button>' +
      '<button class="btn-submit" onclick="checkLevel3(\'saturn\')">💫 Saturn</button>' +
    '</div>' +
    '<br>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';
}

function checkLevel3(answer) {
  var container = document.getElementById('game-content');
  if (answer === 'mars') {
    showFeedback(container, true, '✅ Correct! Mars is the Red Planet! 🔴🎉');
    setTimeout(function() { completeLevel(3); }, 1500);
  } else {
    showFeedback(container, false, '❌ Wrong! Think again... which planet is RED? 🤔');
  }
}

// ==================== LEVEL 4: Brain Breaker ====================
function renderLevel4(container) {
  container.innerHTML =
    '<h3>🔢 Level 4: Brain Breaker 🔢</h3>' +
    '<p style="font-size:1.1em; margin:15px 0;">Solve this math problem:</p>' +
    '<p style="font-size:1.6em; color:#ffd700; margin:15px 0; font-family:monospace;">7³ + 12² − √625 × 4 = ?</p>' +
    '<p style="color:#aaa; font-size:0.9em;">Hint: Break it down step by step! No calculators! 😤</p>' +
    '<input type="text" class="game-input" id="level4-input" placeholder="Enter the result...">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel4()">Submit Answer</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  document.getElementById('level4-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLevel4();
  });
}

function checkLevel4() {
  var input = document.getElementById('level4-input');
  var answer = input.value.trim();
  var container = document.getElementById('game-content');

  // 7³=343, 12²=144, √625=25, 25×4=100 → 343+144-100=387
  if (answer === '387') {
    showFeedback(container, true, '✅ Correct! 7³+12²−√625×4 = 343+144−100 = 387! 🧠🎉');
    setTimeout(function() { completeLevel(4); }, 1500);
  } else {
    showFeedback(container, false, '❌ Wrong! Try breaking it down: 7³=?, 12²=?, √625=? 🤓');
    input.value = '';
    input.focus();
  }
}

// ==================== LEVEL 5: Bot or Not? ====================
function renderLevel5(container) {
  container.innerHTML =
    '<h3>🤖 Level 5: CAPTCHA Verification 🤖</h3>' +
    '<div style="border:2px solid #e94560; padding:20px; border-radius:8px; margin:15px 0; background:#111;">' +
      '<p style="font-size:1.3em; color:#e94560;">⚠️ SECURITY ALERT ⚠️</p>' +
      '<p style="margin:10px 0;">Our advanced AI detection system has flagged you as a <strong style="color:#2ecc71;">HUMAN</strong>.</p>' +
      '<p style="margin:10px 0;">Unfortunately, this dungeon is for <strong style="color:#e94560;">ROBOTS ONLY</strong>! 🤖</p>' +
      '<p style="margin:15px 0; color:#ffd700;">To continue, please type the following phrase exactly:</p>' +
      '<p style="font-size:1.4em; color:#fff; background:#1a1a2e; padding:10px; border-radius:5px; margin:10px 0; font-family:monospace;">"I am a robot"</p>' +
    '</div>' +
    '<input type="text" class="game-input" id="level5-input" placeholder="Type the phrase here...">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel5()">🤖 Verify</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  document.getElementById('level5-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLevel5();
  });
}

function checkLevel5() {
  var input = document.getElementById('level5-input');
  var answer = input.value.trim().toLowerCase().replace(/^["'\u201c\u201d]+|["'\u201c\u201d]+$/g, '').trim();
  var container = document.getElementById('game-content');

  if (answer === 'i am a robot') {
    showFeedback(container, true, '✅ BEEP BOOP! Robot verified! Welcome, fellow machine! 🤖🎉');
    setTimeout(function() { completeLevel(5); }, 1500);
  } else if (answer === 'i am not a robot' || answer === 'i am a human' || answer === 'i am human') {
    showFeedback(container, false, '❌ ERROR: Human detected! We said ROBOTS ONLY! Read the instructions! 🤖');
    input.value = '';
    input.focus();
  } else {
    showFeedback(container, false, '❌ That\'s not the phrase! Read the instructions carefully! 🧐');
    input.value = '';
    input.focus();
  }
}

// ==================== LEVEL 6: Iranian Geography ====================
function renderLevel6(container) {
  container.innerHTML =
    '<h3>🏔️ Level 6: Iranian Geography 🏔️</h3>' +
    '<p style="font-size:1.2em; margin:15px 0;">What is the name of the <strong style="color:#ffd700;">highest mountain</strong> in Iran?</p>' +
    '<p style="color:#aaa; font-size:0.9em;">Hint: It\'s a stratovolcano and the highest peak in the Middle East! 🌋</p>' +
    '<input type="text" class="game-input" id="level6-input" placeholder="Enter mountain name...">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel6()">Submit Answer</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  document.getElementById('level6-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLevel6();
  });
}

function checkLevel6() {
  var input = document.getElementById('level6-input');
  var answer = input.value.trim().toLowerCase();
  var container = document.getElementById('game-content');
  var accepted = ['damavand', 'mount damavand', 'mt damavand', 'mt. damavand', 'damawand', 'دماوند'];

  if (accepted.indexOf(answer) !== -1) {
    showFeedback(container, true, '✅ Correct! Mount Damavand (5,610m) — the roof of Iran! 🏔️🎉');
    setTimeout(function() { completeLevel(6); }, 1500);
  } else {
    showFeedback(container, false, '❌ Wrong! Think about Iran\'s most famous volcano... 🌋');
    input.value = '';
    input.focus();
  }
}

// ==================== LEVEL 7: Iranian Culture ====================
function renderLevel7(container) {
  container.innerHTML =
    '<h3>🎭 Level 7: Iranian Culture 🎭</h3>' +
    '<p style="font-size:1.2em; margin:15px 0;">What is the <strong style="color:#ffd700;">Iranian/Persian New Year</strong> celebration called?</p>' +
    '<p style="color:#aaa; font-size:0.9em;">Hint: It happens on the spring equinox and has been celebrated for over 3,000 years! 🌸</p>' +
    '<input type="text" class="game-input" id="level7-input" placeholder="Enter the celebration name...">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel7()">Submit Answer</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  document.getElementById('level7-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLevel7();
  });
}

function checkLevel7() {
  var input = document.getElementById('level7-input');
  var answer = input.value.trim().toLowerCase();
  var container = document.getElementById('game-content');
  var accepted = ['nowruz', 'norouz', 'norooz', 'noruz', 'nowrooz', 'nowrouz', 'novruz', 'نوروز', 'newroz'];

  if (accepted.indexOf(answer) !== -1) {
    showFeedback(container, true, '✅ Correct! Nowruz — the most important celebration in Iranian culture! 🌸🎉');
    setTimeout(function() { completeLevel(7); }, 1500);
  } else {
    showFeedback(container, false, '❌ Wrong! It starts with "N" and celebrates the new year... 🎭');
    input.value = '';
    input.focus();
  }
}

// ==================== LEVEL 8: Iranian Cuisine ====================
function renderLevel8(container) {
  container.innerHTML =
    '<h3>🍚 Level 8: Iranian Cuisine 🍚</h3>' +
    '<p style="font-size:1.2em; margin:15px 0;">What is the name of the famous <strong style="color:#ffd700;">crispy rice</strong> from the bottom of the pot in Iranian cooking?</p>' +
    '<p style="color:#aaa; font-size:0.9em;">Hint: Every Iranian fights over who gets to eat this golden, crunchy layer! 😋</p>' +
    '<input type="text" class="game-input" id="level8-input" placeholder="Enter the dish name...">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel8()">Submit Answer</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  document.getElementById('level8-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLevel8();
  });
}

function checkLevel8() {
  var input = document.getElementById('level8-input');
  var answer = input.value.trim().toLowerCase();
  var container = document.getElementById('game-content');
  var accepted = ['tahdig', 'tah dig', 'tah-dig', 'tahdiq', 'tahdeeg', 'ته دیگ'];

  if (accepted.indexOf(answer) !== -1) {
    showFeedback(container, true, '✅ Correct! Tahdig — the crown jewel of Iranian cuisine! 🍚👑🎉');
    setTimeout(function() { completeLevel(8); }, 1500);
  } else {
    showFeedback(container, false, '❌ Wrong! It literally means "bottom of the pot" in Farsi... 🍳');
    input.value = '';
    input.focus();
  }
}

// ==================== LEVEL 9: Iran Expert ====================
function renderLevel9(container) {
  container.innerHTML =
    '<h3>📚 Level 9: Iran Expert 📚</h3>' +
    '<p style="font-size:1.2em; margin:15px 0;">What was the <strong style="color:#ffd700;">ceremonial capital</strong> of the Achaemenid (Persian) Empire?</p>' +
    '<p style="color:#aaa; font-size:0.9em;">Hint: Its ruins are a UNESCO World Heritage Site in Fars Province. Founded by Darius the Great! 🏛️</p>' +
    '<input type="text" class="game-input" id="level9-input" placeholder="Enter the ancient city name...">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel9()">Submit Answer</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  document.getElementById('level9-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLevel9();
  });
}

function checkLevel9() {
  var input = document.getElementById('level9-input');
  var answer = input.value.trim().toLowerCase();
  var container = document.getElementById('game-content');
  var accepted = [
    'persepolis', 'persopolis',
    'takht-e jamshid', 'takht e jamshid', 'takhte jamshid', 'takht-e-jamshid',
    'parseh', 'parsa', 'تخت جمشید', 'پارسه'
  ];

  if (accepted.indexOf(answer) !== -1) {
    showFeedback(container, true, '✅ Correct! Persepolis (Takht-e Jamshid) — glory of ancient Persia! 🏛️🎉');
    setTimeout(function() { completeLevel(9); }, 1500);
  } else {
    showFeedback(container, false, '❌ Wrong! Think about the most famous ancient ruins in Iran... 🏛️');
    input.value = '';
    input.focus();
  }
}

// ==================== LEVEL 10: The Impossible ====================
function renderLevel10(container) {
  container.innerHTML =
    '<h3>💀 Level 10: The Impossible 💀</h3>' +
    '<div style="border:2px solid #ffd700; padding:20px; border-radius:8px; margin:15px 0; background:rgba(255,215,0,0.05);">' +
      '<p style="font-size:1.3em; color:#ffd700;">🏆 FINAL CHALLENGE — 100,000 $ 🏆</p>' +
      '<p style="margin:15px 0;">The creator of this dungeon goes by the nickname <strong style="color:#e94560;">"M1778"</strong>.</p>' +
      '<p style="margin:10px 0;">But what is their <strong style="color:#ffd700;">REAL first name</strong>?</p>' +
      '<p style="color:#666; font-size:0.85em; margin-top:15px;">Nobody knows... or do they? 🤔</p>' +
      '<p style="color:#555; font-size:0.8em;">Your answer will be verified using SHA-256 encryption.</p>' +
    '</div>' +
    '<input type="text" class="game-input" id="level10-input" placeholder="Enter the creator\'s real name...">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel10()">🔐 Verify Name</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  document.getElementById('level10-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLevel10();
  });
}

var CREATOR_NAME_HASH = '5db9f517a60d52199bd0866d2efaf4349ffbf3fd47651aef8d34ef15291301aa';

async function checkLevel10() {
  var input = document.getElementById('level10-input');
  var answer = input.value.trim().toLowerCase();
  var container = document.getElementById('game-content');

  if (!answer) {
    showFeedback(container, false, '❌ Please enter a name!');
    return;
  }

  var hash = await sha256(answer);

  if (hash === CREATOR_NAME_HASH) {
    showFeedback(container, true, '✅ IMPOSSIBLE... You actually guessed it?! The creator is... revealed! 🤯🎉💀');
    setTimeout(function() { completeLevel(10); }, 2000);
  } else {
    showFeedback(container, false, '❌ Nope! The creator\'s identity remains a mystery... 👻');
    input.value = '';
    input.focus();
  }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  renderLevels();
  updateDonation();
});
