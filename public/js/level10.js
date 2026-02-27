// Level 10: Color Mixer
// Mix RGB sliders to match a random target color. Each channel must be within 20.

var _level10Target = null;

function renderLevel10(container) {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  _level10Target = { r: r, g: g, b: b };

  var html =
    '<h3>🎨 Level 10: Color Mixer</h3>' +
    '<p style="color:#aaa;">Adjust the RGB sliders to match the target color!</p>' +
    '<p style="color:#e94560; font-size:0.95em;">Each channel must be within <strong>20</strong> of the target.</p>' +
    '<div class="color-mixer">' +
      '<div style="text-align:center;">' +
        '<p style="color:#ffd700; margin-bottom:6px; font-weight:bold;">Target</p>' +
        '<div id="level10-target" class="color-preview" style="background:rgb(' + r + ',' + g + ',' + b + ');">' +
        '</div>' +
      '</div>' +
      '<div style="text-align:center;">' +
        '<p style="color:#ffd700; margin-bottom:6px; font-weight:bold;">Your Mix</p>' +
        '<div id="level10-mix" class="color-preview" style="background:rgb(128,128,128);">' +
        '</div>' +
      '</div>' +
      '<div class="color-sliders">' +
        '<div class="color-slider-group">' +
          '<label style="color:#e74c3c;">R</label>' +
          '<input type="range" id="level10-r" class="slider-r" min="0" max="255" value="128" oninput="updateLevel10Mix()">' +
          '<span id="level10-r-val" class="color-val">128</span>' +
        '</div>' +
        '<div class="color-slider-group">' +
          '<label style="color:#2ecc71;">G</label>' +
          '<input type="range" id="level10-g" class="slider-g" min="0" max="255" value="128" oninput="updateLevel10Mix()">' +
          '<span id="level10-g-val" class="color-val">128</span>' +
        '</div>' +
        '<div class="color-slider-group">' +
          '<label style="color:#3498db;">B</label>' +
          '<input type="range" id="level10-b" class="slider-b" min="0" max="255" value="128" oninput="updateLevel10Mix()">' +
          '<span id="level10-b-val" class="color-val">128</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<br>' +
    '<button class="btn-submit" onclick="submitLevel10()">Submit Color</button>' +
    '<button class="btn-close" onclick="closeGame()">Close</button>';

  container.innerHTML = html;
}

function updateLevel10Mix() {
  var rSlider = document.getElementById('level10-r');
  var gSlider = document.getElementById('level10-g');
  var bSlider = document.getElementById('level10-b');
  var rVal = document.getElementById('level10-r-val');
  var gVal = document.getElementById('level10-g-val');
  var bVal = document.getElementById('level10-b-val');
  var mixBox = document.getElementById('level10-mix');

  if (!rSlider || !gSlider || !bSlider || !mixBox) return;

  var r = parseInt(rSlider.value, 10);
  var g = parseInt(gSlider.value, 10);
  var b = parseInt(bSlider.value, 10);

  if (rVal) rVal.textContent = r;
  if (gVal) gVal.textContent = g;
  if (bVal) bVal.textContent = b;

  mixBox.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
}

function submitLevel10() {
  var rSlider = document.getElementById('level10-r');
  var gSlider = document.getElementById('level10-g');
  var bSlider = document.getElementById('level10-b');
  var content = document.getElementById('game-content');

  if (!rSlider || !gSlider || !bSlider || !content || !_level10Target) return;

  var r = parseInt(rSlider.value, 10);
  var g = parseInt(gSlider.value, 10);
  var b = parseInt(bSlider.value, 10);

  var dr = Math.abs(r - _level10Target.r);
  var dg = Math.abs(g - _level10Target.g);
  var db = Math.abs(b - _level10Target.b);

  if (dr <= 20 && dg <= 20 && db <= 20) {
    showFeedback(content, true, '🎉 Perfect match! You nailed the color!');
    setTimeout(function() {
      completeLevel(10);
    }, 1500);
  } else {
    var hint = '';
    if (dr > 20) hint += ' R is off by ' + dr + '.';
    if (dg > 20) hint += ' G is off by ' + dg + '.';
    if (db > 20) hint += ' B is off by ' + db + '.';
    showFeedback(content, false, '❌ Not quite!' + hint + ' Keep adjusting!');
  }
}
