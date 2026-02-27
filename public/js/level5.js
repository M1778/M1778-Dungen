// Level 5: Bot or Not
// Type the phrase "I am a robot" but too fast = detected as bot, too slow = detected as human
// After completion, show "I know what you did there..." message

var _level5StartTime = 0;
var _level5BotDetected = false;

function renderLevel5(container) {
  _level5StartTime = 0;
  _level5BotDetected = false;

  var html =
    '<h3>🤖 Level 5: Bot or Not</h3>' +
    '<div style="border:2px solid #e94560; padding:20px; border-radius:8px; margin:15px 0; background:#111;">' +
      '<p style="font-size:1.3em; color:#e94560;">⚠️ SECURITY ALERT ⚠️</p>' +
      '<p style="margin:10px 0;">Our advanced AI detection system has flagged you as a <strong style="color:#2ecc71;">HUMAN</strong>.</p>' +
      '<p style="margin:10px 0;">Unfortunately, this dungeon is for <strong style="color:#e94560;">ROBOTS ONLY</strong>! 🤖</p>' +
      '<p style="margin:15px 0; color:#ffd700;">To continue, please type the following phrase exactly:</p>' +
      '<p style="font-size:1.4em; color:#fff; background:#1a1a2e; padding:10px; border-radius:5px; margin:10px 0; font-family:monospace;">"I am a robot"</p>' +
      '<p style="color:#aaa; font-size:0.9em; margin-top:10px;">⚠️ Type naturally... not too fast (bot) and not too slow (human)!</p>' +
    '</div>' +
    '<input type="text" class="game-input" id="level5-input" placeholder="Type the phrase here..." autocomplete="off">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel5()">🤖 Verify</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>' +
    '<div id="level5-message"></div>';

  container.innerHTML = html;

  var input = document.getElementById('level5-input');
  if (input) {
    input.addEventListener('focus', function() {
      if (_level5StartTime === 0) {
        _level5StartTime = Date.now();
      }
    });
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') checkLevel5();
    });
  }
}

function checkLevel5() {
  var input = document.getElementById('level5-input');
  var answer = input.value.trim().toLowerCase().replace(/^["'\u201c\u201d]+|["'\u201c\u201d]+$/g, '').trim();
  var container = document.getElementById('game-content');
  var messageEl = document.getElementById('level5-message');

  if (!answer) {
    showFeedback(container, false, '❌ Please type something!');
    return;
  }

  var elapsed = 0;
  if (_level5StartTime > 0) {
    elapsed = Date.now() - _level5StartTime;
  }

  if (answer === 'i am a robot') {
    var speedWarning = '';
    if (elapsed < 800) {
      _level5BotDetected = true;
      speedWarning = ' (bot detected: too fast!)';
    } else if (elapsed > 3000) {
      speedWarning = ' (human detected: too slow!)';
    }

    if (messageEl) {
      var botPopup = document.createElement('div');
      botPopup.className = 'bot-popup';
      botPopup.innerHTML = 
        '<div class="bot-popup-content">' +
          '<h3>🤖 VERIFICATION COMPLETE</h3>' +
          '<p>Your typing speed: ' + elapsed + 'ms' + speedWarning + '</p>' +
          '<p style="color:#2ecc71; margin-top:10px;">✅ Robot verified! Welcome, fellow machine!</p>' +
          '<p style="color:#e94560; font-size:0.9em; margin-top:15px; font-style:italic;">I know what you did there...</p>' +
        '</div>';
      
      setTimeout(function() {
        document.body.appendChild(botPopup);
        setTimeout(function() {
          if (botPopup.parentNode) {
            botPopup.parentNode.removeChild(botPopup);
          }
          showFeedback(container, true, '✅ BEEP BOOP! Robot verified! 🤖🎉');
          setTimeout(function() { completeLevel(5); }, 1500);
        }, 2500);
      }, 100);
    } else {
      showFeedback(container, true, '✅ BEEP BOOP! Robot verified! 🤖🎉');
      setTimeout(function() { completeLevel(5); }, 1500);
    }
  } else if (answer === 'i am not a robot' || answer === 'i am a human' || answer === 'i am human') {
    showFeedback(container, false, '❌ ERROR: Human detected! We said ROBOTS ONLY! Read the instructions! 🤖');
    input.value = '';
    input.focus();
    _level5StartTime = Date.now();
  } else {
    showFeedback(container, false, '❌ That\'s not the phrase! Read the instructions carefully! 🧐');
    input.value = '';
    input.focus();
    _level5StartTime = Date.now();
  }
}
