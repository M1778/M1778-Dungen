// Level 8: Speed Typer
// Type 2 words BACKWARDS within 15 seconds

function renderLevel8(container) {
  var words = ['DUNGEON', 'DRAGON', 'WIZARD', 'CASTLE', 'KNIGHT', 'TREASURE', 'MONSTER', 'EMPIRE', 'SHADOW', 'PHOENIX'];
  var wordPool = words.slice();
  var currentWordIndex = 0;
  var totalWords = 2;
  var currentWords = [];
  
  for (var i = 0; i < totalWords; i++) {
    var idx = Math.floor(Math.random() * wordPool.length);
    currentWords.push(wordPool[idx]);
    wordPool.splice(idx, 1);
  }
  
  var timeLeft = 15;
  var timerInterval = null;
  var finished = false;
  var currentWord = currentWords[0];
  var reversed = currentWord.split('').reverse().join('');

  function renderWord() {
    var wordEl = document.getElementById('typer-word');
    var hintEl = document.getElementById('typer-hint');
    var inputEl = document.getElementById('typer-input');
    var progressEl = document.getElementById('typer-progress');
    
    if (wordEl) wordEl.textContent = currentWord;
    if (hintEl) hintEl.innerHTML = '⚡ Word ' + (currentWordIndex + 1) + '/' + totalWords + ' — type backwards! (<strong>' + currentWord + '</strong> → <strong>' + reversed + '</strong>)';
    if (inputEl) {
      inputEl.value = '';
      inputEl.maxLength = currentWord.length;
      inputEl.disabled = false;
      inputEl.focus();
    }
    if (progressEl) progressEl.textContent = 'Words: ' + currentWordIndex + ' / ' + totalWords;
  }

  var html =
    '<h3>⌨️ Level 8: Speed Typer</h3>' +
    '<p style="color:#aaa;">Type <strong style="color:#ffd700;">2 words</strong> <strong style="color:#e94560;">BACKWARDS</strong> in 15 seconds!</p>' +
    '<p id="typer-progress" style="color:#ffd700; font-size:1.1em;">Words: 0 / ' + totalWords + '</p>' +
    '<div class="typer-display" id="typer-word">' + currentWord + '</div>' +
    '<p class="typer-hint" id="typer-hint">⚡ Word 1/' + totalWords + ' — type backwards! (<strong>' + currentWord + '</strong> → <strong>' + reversed + '</strong>)</p>' +
    '<div class="game-timer" id="typer-timer">⏱️ ' + timeLeft + 's</div>' +
    '<input type="text" id="typer-input" class="game-input" placeholder="Type the word backwards..." autocomplete="off" maxlength="' + currentWord.length + '">' +
    '<br>' +
    '<button class="btn-submit" id="typer-submit-btn" onclick="submitLevel8()">Submit</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;

  showFocusMode();
  playIntenseMode();

  var input = document.getElementById('typer-input');
  if (input) {
    input.focus();
    input.addEventListener('keydown', function(e) {
      playSound('tick');
      if (e.key === 'Enter') {
        submitLevel8();
      }
    });
  }

  window._level8Words = currentWords;
  window._level8CurrentIndex = currentWordIndex;
  window._level8Reversed = reversed;

  timerInterval = setInterval(function() {
    if (finished) return;
    timeLeft--;
    var timerEl = document.getElementById('typer-timer');
    if (timerEl) {
      timerEl.textContent = '⏱️ ' + timeLeft + 's';
      if (timeLeft <= 5) {
        timerEl.style.color = '#e74c3c';
        timerEl.classList.add('timer-urgent');
        playSound('tick');
        emojiPop(1, ['⏰']);
      }
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      finished = true;
      stopIntenseMode();
      hideFocusMode();
      if (input) input.disabled = true;
      var submitBtn = document.getElementById('typer-submit-btn');
      if (submitBtn) submitBtn.disabled = true;
      playSound('fail');
      screenShake(400);
      showFeedback(container, false, '⏰ Time\'s up! Completed ' + currentWordIndex + '/' + totalWords + ' words. Try again!');

      var retryBtn = document.createElement('button');
      retryBtn.className = 'btn-submit';
      retryBtn.textContent = '🔄 Retry';
      retryBtn.style.marginTop = '10px';
      retryBtn.onclick = function() {
        renderLevel8(container);
      };
      container.appendChild(retryBtn);
    }
  }, 1000);

  window._level8Finished = function() { return finished; };
  window._level8SetFinished = function() { finished = true; };
  window._level8ClearTimer = function() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };
  window._level8NextWord = function() {
    currentWordIndex++;
    if (currentWordIndex >= totalWords) {
      return false;
    }
    currentWord = currentWords[currentWordIndex];
    reversed = currentWord.split('').reverse().join('');
    window._level8CurrentIndex = currentWordIndex;
    window._level8Reversed = reversed;
    renderWord();
    return true;
  };

  registerLevelCleanup(function() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    finished = true;
    stopIntenseMode();
    hideFocusMode();
    window._level8Words = null;
    window._level8CurrentIndex = null;
    window._level8Reversed = null;
    window._level8Finished = null;
    window._level8SetFinished = null;
    window._level8ClearTimer = null;
    window._level8NextWord = null;
  });
}

function submitLevel8() {
  if (window._level8Finished && window._level8Finished()) return;

  var input = document.getElementById('typer-input');
  var content = document.getElementById('game-content');
  if (!input || !content) return;

  var answer = input.value.trim().toUpperCase();
  var reversed = window._level8Reversed;

  if (!reversed) return;

  if (answer === '') {
    showFeedback(content, false, '❌ Please type something!');
    input.focus();
    return;
  }

  if (answer === reversed) {
    playSound('success');
    emojiPop(3, ['✨','💫','⭐']);
    
    if (window._level8NextWord && window._level8NextWord()) {
      showFeedback(content, true, '✅ Correct! Next word!');
    } else {
      if (window._level8SetFinished) window._level8SetFinished();
      if (window._level8ClearTimer) window._level8ClearTimer();
      input.disabled = true;
      var submitBtn = document.getElementById('typer-submit-btn');
      if (submitBtn) submitBtn.disabled = true;
      stopIntenseMode();
      hideFocusMode();
      playSound('win');
      emojiPop(8, ['⌨️','💨','⚡','🎉']);
      showFeedback(content, true, '🎉 Both words completed! You\'re a typing master!');
      setTimeout(function() {
        completeLevel(8);
      }, 1500);
    }
  } else {
    playSound('fail');
    triggerWrongShake(input);
    showFeedback(content, false, '❌ Wrong! "' + answer + '" is not correct. Try again!');
    input.value = '';
    input.focus();
  }
}
