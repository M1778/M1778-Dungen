// Level 6: Memory Cards
// Match 6 card pairs (12 cards total). Click to flip, match all pairs to win.

var _level6 = {
  cards: [],
  flipped: [],
  matched: 0,
  totalPairs: 6,
  canFlip: true,
  timeouts: []
};

function renderLevel6(container) {
  _level6.flipped = [];
  _level6.matched = 0;
  _level6.canFlip = true;
  _level6.timeouts = [];

  var symbols = ['🔥', '💎', '⚡', '🎮', '🎯', '🌟'];
  var cards = [];
  
  for (var i = 0; i < symbols.length; i++) {
    cards.push(symbols[i]);
    cards.push(symbols[i]);
  }
  
  for (var j = cards.length - 1; j > 0; j--) {
    var k = Math.floor(Math.random() * (j + 1));
    var temp = cards[j];
    cards[j] = cards[k];
    cards[k] = temp;
  }
  
  _level6.cards = cards;

  var html =
    '<h3>🃏 Level 6: Memory Cards</h3>' +
    '<p style="color:#aaa;">Match all <strong style="color:#ffd700;">6 pairs</strong> of cards!</p>' +
    '<p style="color:#e94560; font-size:0.95em;">Click a card to flip it, then click its match.</p>' +
    '<p style="color:#ffd700; font-size:1.1em;">Pairs matched: <span id="level6-count">0</span> / ' + _level6.totalPairs + '</p>' +
    '<div id="level6-grid" class="memory-grid"></div>' +
    '<br>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;

  var grid = document.getElementById('level6-grid');
  if (!grid) return;

  for (var idx = 0; idx < cards.length; idx++) {
    (function(cardIndex) {
      var card = document.createElement('div');
      card.className = 'memory-card';
      card.setAttribute('data-index', cardIndex);
      
      var front = document.createElement('div');
      front.className = 'memory-card-front';
      front.textContent = cards[cardIndex];
      
      var back = document.createElement('div');
      back.className = 'memory-card-back';
      back.textContent = '?';
      
      card.appendChild(front);
      card.appendChild(back);
      
      card.addEventListener('click', function() {
        _level6FlipCard(cardIndex);
      });
      
      grid.appendChild(card);
    })(idx);
  }

  registerLevelCleanup(function() {
    for (var t = 0; t < _level6.timeouts.length; t++) {
      clearTimeout(_level6.timeouts[t]);
    }
    _level6.timeouts = [];
  });
}

function _level6FlipCard(index) {
  if (!_level6.canFlip) return;
  
  var cards = document.querySelectorAll('.memory-card');
  var card = cards[index];
  
  if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  
  card.classList.add('flipped');
  _level6.flipped.push(index);
  
  if (_level6.flipped.length === 2) {
    _level6.canFlip = false;
    
    var idx1 = _level6.flipped[0];
    var idx2 = _level6.flipped[1];
    
    if (_level6.cards[idx1] === _level6.cards[idx2]) {
      cards[idx1].classList.add('matched');
      cards[idx2].classList.add('matched');
      
      _level6.matched++;
      var countEl = document.getElementById('level6-count');
      if (countEl) countEl.textContent = _level6.matched;
      
      _level6.flipped = [];
      _level6.canFlip = true;
      
      if (_level6.matched >= _level6.totalPairs) {
        var content = document.getElementById('game-content');
        if (content) {
          showFeedback(content, true, '🎉 All pairs matched! You have a great memory!');
        }
        setTimeout(function() {
          completeLevel(6);
        }, 1500);
      }
    } else {
      var t1 = setTimeout(function() {
        cards[idx1].classList.remove('flipped');
        cards[idx2].classList.remove('flipped');
        _level6.flipped = [];
        _level6.canFlip = true;
      }, 1000);
      _level6.timeouts.push(t1);
    }
  }
}
