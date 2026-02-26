// M1778-Dungen Authentication
// Password hash (SHA256 of the secret password)
var PASSWORD_HASH = '0b6750af4ed8ddae40b61f4ae1d57590cfee52ca473c5e140edaeda31e21204c';
var COOKIE_NAME = 'm1778_dungen_auth';
var COOKIE_VALUE = 'pony_gamer_verified';

async function sha256(message) {
  var msgBuffer = new TextEncoder().encode(message);
  var hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  var hashArray = Array.from(new Uint8Array(hashBuffer));
  var hashHex = hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  return hashHex;
}

function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length);
    }
  }
  return null;
}

function isAuthenticated() {
  return getCookie(COOKIE_NAME) === COOKIE_VALUE;
}

async function checkPassword() {
  var passwordInput = document.getElementById('password');
  var errorMsg = document.getElementById('error-msg');
  var password = passwordInput.value;

  if (!password) {
    errorMsg.style.display = 'block';
    errorMsg.textContent = '❌ Please enter a password! ❌';
    return;
  }

  var hash = await sha256(password);

  if (hash === PASSWORD_HASH) {
    setCookie(COOKIE_NAME, COOKIE_VALUE, 30);
    errorMsg.style.display = 'none';
    window.location.href = 'challenges.html';
  } else {
    errorMsg.style.display = 'block';
    errorMsg.textContent = '❌ Wrong password! Only Pony.gamer knows the secret! ❌';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

// Allow pressing Enter to submit password
document.addEventListener('DOMContentLoaded', function() {
  var passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        checkPassword();
      }
    });
  }
});
