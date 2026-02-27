// Level 1: The Simple Math (2+2=17780)

function renderLevel1(container) {
  container.innerHTML =
    '<h3>📐 Level 1: The Simple Math 📐</h3>' +
    '<p style="font-size:2.5em; color:#ffd700; margin:20px 0; text-shadow:0 0 15px rgba(255,215,0,0.5);">2 + 2 = ?</p>' +
    '<p style="color:#aaa; font-style:italic;">Hint: The answer is NOT what you learned in school... 😏</p>' +
    '<p style="color:#666; font-size:0.85em;">Think about the name of this project... and then some.</p>' +
    '<input type="text" class="game-input" id="level1-input" placeholder="Enter your answer...">' +
    '<br>' +
    '<button class="btn-submit" onclick="checkLevel1()">Submit Answer</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  var input = document.getElementById('level1-input');
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLevel1();
  });
  
  setTimeout(function() {
    input.classList.add('blur-in');
  }, 100);
}

function checkLevel1() {
  var input = document.getElementById('level1-input');
  var answer = input.value.trim();
  var container = document.getElementById('game-content');

  if (answer === '17780') {
    playSound('success');
    showFeedback(container, true, '✅ Correct! 2 + 2 = 17780 in the M1778 universe! 🎉');
    emojiPop(5, ['🎉','✨','💫','🌟']);
    setTimeout(function() { completeLevel(1); }, 1500);
  } else if (answer === '4') {
    playSound('fail');
    triggerWrongShake(input);
    showFeedback(container, false, "❌ That's what they WANT you to think! This is M1778-Dungen, not math class! 🤔");
    input.value = '';
    input.focus();
  } else if (answer === '1778') {
    playSound('fail');
    triggerWrongShake(input);
    showFeedback(container, false, "❌ Close, but not quite! You're on the right track though... think bigger! 🧐");
    input.value = '';
    input.focus();
  } else {
    playSound('fail');
    triggerWrongShake(input);
    showFeedback(container, false, '❌ Nope! Think harder... What makes this project special? 🧐');
    input.value = '';
    input.focus();
  }
}
