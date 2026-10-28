const agentBadge = document.getElementById('agentBadge');
const missionTitle = document.getElementById('missionTitle');
const missionCopy = document.getElementById('missionCopy');
const codeInput = document.getElementById('codeInput');
const challengeForm = document.getElementById('challengeForm');
const successText = document.getElementById('successText');

const agentName = (localStorage.getItem('agentName') || 'AGENT').trim();
const accessLevel = localStorage.getItem('accessLevel') || 'Alpha';
const answer = 'LISTEN';

agentBadge.textContent = `AGENT ${agentName.toUpperCase()}`;
missionTitle.textContent = `Welcome, ${agentName.toUpperCase()}`;
missionCopy.textContent = `Level ${accessLevel} clearance accepted. Solve the cipher to confirm the signal.`;

challengeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = (codeInput.value || '').trim().toUpperCase();

  if (value === answer) {
    successText.classList.add('visible');
    successText.textContent = `ACCESS VERIFIED — CODE: ${answer}`;
    codeInput.value = '';
  } else {
    successText.classList.remove('visible');
    codeInput.value = '';
    codeInput.placeholder = 'Incorrect — try again';
  }
});
