const agentBadge = document.getElementById('agentBadge');
const missionTitle = document.getElementById('missionTitle');
const missionCopy = document.getElementById('missionCopy');
const codeInput = document.getElementById('codeInput');
const challengeForm = document.getElementById('cipherForm');
const successText = document.getElementById('successText');
const missionLayout = document.getElementById('missionLayout');
const scanLabel = document.getElementById('scanLabel');

const agentName = (localStorage.getItem('agentName') || 'Agent').trim();
const accessLevel = localStorage.getItem('accessLevel') || 'Alpha';
const answer = 'LISTEN';

if (agentBadge) {
  agentBadge.textContent = `AGENT ${agentName.toUpperCase()}`;
}

if (missionTitle) {
  missionTitle.textContent = `Welcome, ${agentName.toUpperCase()}`;
}

if (missionCopy) {
  missionCopy.textContent = `Level ${accessLevel} clearance accepted. Solve the cipher to confirm the signal.`;
}

if (scanLabel) {
  scanLabel.textContent = 'ACCESS CHECK';
}

challengeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = (codeInput.value || '').trim().toUpperCase();

  if (value === answer) {
    successText.classList.add('visible');
    successText.textContent = `ACCESS VERIFIED — CODE: ${answer}`;
    codeInput.value = '';

    if (missionLayout) {
      missionLayout.classList.add('is-solved');
    }

    if (scanLabel) {
      scanLabel.textContent = 'MISSION LOCKED';
    }
  } else {
    successText.classList.remove('visible');
    codeInput.value = '';
    codeInput.placeholder = 'Incorrect — try again';
  }
});
