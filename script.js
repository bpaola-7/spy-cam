const agentForm = document.getElementById('agentForm');
const nameInput = document.getElementById('agentName');
const accessLevelInput = document.getElementById('accessLevel');

if (agentForm) {
  agentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = (nameInput.value || '').trim();
    const level = accessLevelInput.value || 'Alpha';

    if (!name) {
      nameInput.focus();
      return;
    }

    localStorage.setItem('agentName', name);
    localStorage.setItem('accessLevel', level);
    window.location.href = 'mission.html';
  });
}

const video = document.getElementById('camera');
const canvas = document.getElementById('handCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const scanLabel = document.getElementById('scanLabel');
const activateBtn = document.getElementById('activateBtn');
const welcomeText = document.getElementById('welcomeText');

if (video && canvas && ctx) {
  const agentName = (localStorage.getItem('agentName') || 'Agent').trim();
  const accessLevel = localStorage.getItem('accessLevel') || 'Alpha';

  if (welcomeText) {
    welcomeText.textContent = `Welcome, ${agentName.toUpperCase()}`;
  }

  let cameraStarted = false;
  let handConfirmed = false;
  let validationCount = 0;

  function setStatus(message, success = false) {
    if (!scanLabel) return;
    scanLabel.textContent = message;
    const dot = document.querySelector('.status-dot');
    if (!dot) return;
    dot.style.background = success ? '#9ef7d7' : '#ffcc66';
    dot.style.boxShadow = success
      ? '0 0 12px rgba(158, 247, 215, 0.9)'
      : '0 0 12px rgba(255, 204, 102, 0.7)';
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function drawHandSkeleton(results) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) return;

    const landmarks = results.multiHandLandmarks[0];
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    const groups = [
      { color: '#f6d365', pairs: [[0, 1], [1, 2], [2, 3], [3, 4]] },
      { color: '#ffd166', pairs: [[0, 5], [5, 6], [6, 7], [7, 8]] },
      { color: '#7ae582', pairs: [[5, 9], [9, 10], [10, 11], [11, 12]] },
      { color: '#ff9f1c', pairs: [[9, 13], [13, 14], [14, 15], [15, 16]] },
      { color: '#ff5d8f', pairs: [[13, 17], [17, 18], [18, 19], [19, 20]] },
      { color: '#dfe5f5', pairs: [[0, 17], [5, 9], [9, 13], [13, 17]] }
    ];

    for (const group of groups) {
      ctx.strokeStyle = group.color;
      ctx.lineWidth = 3;
      for (const [from, to] of group.pairs) {
        const a = landmarks[from];
        const b = landmarks[to];
        ctx.beginPath();
        ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
        ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
        ctx.stroke();
      }
    }

    const pointColors = [
      '#f94144', '#f3722c', '#f9c74f', '#90be6d', '#4cc9f0', '#577590',
      '#ff5d8f', '#ffd166', '#7bdff2', '#06d6a0', '#c77dff', '#f4a261',
      '#00b4d8', '#84dcc6', '#f15bb5', '#ffbe0b', '#2ec4b6', '#3a86ff',
      '#00c2a8', '#a7c957'
    ];

    for (let i = 0; i < landmarks.length; i += 1) {
      const point = landmarks[i];
      ctx.beginPath();
      ctx.fillStyle = pointColors[i] || '#ffffff';
      ctx.arc(point.x * canvas.width, point.y * canvas.height, i === 0 ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function isOpenPalm(landmarks) {
    if (!landmarks || landmarks.length < 21) return false;

    const palmCenter = {
      x: (landmarks[0].x + landmarks[5].x + landmarks[9].x + landmarks[13].x + landmarks[17].x) / 5,
      y: (landmarks[0].y + landmarks[5].y + landmarks[9].y + landmarks[13].y + landmarks[17].y) / 5
    };

    const tipIndexes = [4, 8, 12, 16, 20];
    const baseIndexes = [2, 6, 10, 14, 18];

    const fingerTipsExtended = tipIndexes.every((tipIndex, index) => {
      const tip = landmarks[tipIndex];
      const base = landmarks[baseIndexes[index]];
      const fromCenter = distance(tip, palmCenter);
      const fromBase = distance(tip, base);
      return fromCenter > 0.045 && fromBase > 0.025 && tip.y < base.y;
    });

    const thumbOpen = landmarks[4].x > landmarks[3].x + 0.02;
    const handLifted = landmarks[9].y < landmarks[0].y + 0.18;
    const fingerSpread = Math.abs(landmarks[8].x - landmarks[12].x) > 0.02 && Math.abs(landmarks[12].x - landmarks[16].x) > 0.02;

    return fingerTipsExtended && thumbOpen && handLifted && fingerSpread;
  }

  function handleResults(results) {
    if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) {
      validationCount = 0;
      drawHandSkeleton(results);
      if (handConfirmed) {
        handConfirmed = false;
        setStatus('AWAITING HANDPRINT', false);
      }
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    drawHandSkeleton(results);

    if (!isOpenPalm(landmarks)) {
      validationCount = 0;
      setStatus('PALM REQUIRES OPEN POSITION', false);
      return;
    }

    validationCount += 1;

    if (validationCount >= 8) {
      if (!handConfirmed) {
        handConfirmed = true;
        setStatus('ACCESS GRANTED', true);

        setTimeout(() => {
          window.location.href = 'cipher.html';
        }, 1100);
      }
    } else {
      setStatus('SCANNING PALM...', false);
    }
  }

  async function startCamera() {
    if (cameraStarted) return;

    if (!window.Hands || !window.Camera) {
      setStatus('RELOAD PAGE', false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });

      video.srcObject = stream;
      await video.play();

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.55,
        minTrackingConfidence: 0.55
      });

      hands.onResults(handleResults);

      const cam = new window.Camera(video, {
        onFrame: async () => {
          await hands.send({ image: video });
        },
        width: canvas.width,
        height: canvas.height
      });

      cam.start();
      cameraStarted = true;
      activateBtn.textContent = 'Accessing';
      activateBtn.disabled = true;
      setStatus('SCANNING PALM...', false);
    } catch (error) {
      console.error(error);
      setStatus('ENABLE CAMERA ACCESS', false);
      activateBtn.disabled = false;
      activateBtn.textContent = 'Enable Camera';
    }
  }

  activateBtn.addEventListener('click', startCamera);
  setStatus('AWAITING HANDPRINT', false);
}
