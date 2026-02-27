// Level 15: The Impossible
// Final question with SHA256 encrypted answer. On correct answer, trigger jumpscare.

var ENEMY_HASH = '701de3b28670d78e3bad9aa62acd5158462e1715f39808ac64af6f5a37b877a5';

function renderLevel15(container) {
  var html =
    '<h3>💀 Level 15: The Impossible 💀</h3>' +
    '<div style="border:2px solid #ffd700; padding:20px; border-radius:8px; margin:15px 0; background:rgba(255,215,0,0.05);">' +
      '<p style="font-size:1.3em; color:#ffd700;">🏆 FINAL CHALLENGE — 100,000 $ 🏆</p>' +
      '<p style="margin:15px 0;">This is the final question... if you dare 💀</p>' +
      '<p style="margin:10px 0; font-size:1.2em;">Who is <strong style="color:#e94560;">M1778\'s enemy</strong>?</p>' +
      '<p style="color:#aaa; font-size:0.85em; margin-top:15px;">Answer will be verified using SHA-256 encryption.</p>' +
      '<p style="color:#666; font-size:0.8em; margin-top:10px;">Hint: The answer is in Persian/Farsi. Think about who "دشمن" means!</p>' +
    '</div>' +
    '<input type="text" class="game-input" id="level15-input" placeholder="Enter the answer...">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel15()">🔐 Verify Answer</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;

  var input = document.getElementById('level15-input');
  if (input) {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') checkLevel15();
    });
  }
}

async function checkLevel15() {
  var input = document.getElementById('level15-input');
  var answer = input.value.trim();
  var container = document.getElementById('game-content');

  if (!answer) {
    showFeedback(container, false, '❌ Please enter an answer!');
    return;
  }

  var hash = await sha256(answer);

  if (hash === ENEMY_HASH) {
    showFeedback(container, true, '✅ Correct! The enemy has been revealed...');
    
    setTimeout(function() {
      triggerJumpscare(function() {
        setTimeout(function() {
          completeLevel(15);
        }, 500);
      });
    }, 1000);
  } else {
    showFeedback(container, false, '❌ Wrong! Think about the hint... who is the enemy? 💀');
    input.value = '';
    input.focus();
  }
}
