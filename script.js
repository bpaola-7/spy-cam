const video = document.getElementById('camera');
const canvas = document.getElementById('handCanvas');
const ctx = canvas.getContext('2d');
const scanLabel = document.getElementById('scanLabel');
const welcomeText = document.getElementById('welcomeText');
const activateBtn = document.getElementById('activateBtn');

const agentNames = [
  'MIRA',
  'NOVA',
  'SABLE',
  'VANTA',
  'KITE',
  'DAHLIA',
  'ORION',
  'QUILL'
];

let cameraStarted = false;
let handConfirmed = false;
let selectedAgent = 'MIRA';
let detectedHand = null;

function setStatus(message, success = false) {
  scanLabel.textContent = message;
  const dot = document.querySelector('.status-dot');
  dot.style.background = success ? '#9ef7d7' : '#ffcc66';
  dot.style.boxShadow = success
    ? '0 0 12px rgba(158, 247, 215, 0.9)'
    : '0 0 12px rgba(255, 204, 102, 0.7)';
}

function redirectToMission(agent) {
  localStorage.setItem('agentName', agent);
  window.location.href = 'mission.html';
}

function drawHandSkeleton(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) {
    detectedHand = null;
    return;
  }

  const landmarks = results.multiHandLandmarks[0];
  detectedHand = landmarks;

  const fingerColors = {
    thumb: '#f4d35e',
    index: '#39d0ff',
    middle: '#20c997',
    ring: '#ff9f1c',
    pinky: '#ff5d8f'
  };

  const connectionGroups = [
    { color: fingerColors.thumb, pairs: [[0, 1], [1, 2], [2, 3], [3, 4]] },
    { color: fingerColors.index, pairs: [[0, 5], [5, 6], [6, 7], [7, 8]] },
    { color: fingerColors.middle, pairs: [[5, 9], [9, 10], [10, 11], [11, 12]] },
    { color: fingerColors.ring, pairs: [[9, 13], [13, 14], [14, 15], [15, 16]] },
    { color: fingerColors.pinky, pairs: [[13, 17], [17, 18], [18, 19], [19, 20]] },
    { color: '#dfe5f5', pairs: [[0, 17], [5, 9], [9, 13], [13, 17]] }
  ];

  ctx.lineWidth = 3;
  for (const group of connectionGroups) {
    ctx.strokeStyle = group.color;
    for (const [from, to] of group.pairs) {
      const p1 = landmarks[from];
      const p2 = landmarks[to];
      ctx.beginPath();
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
      ctx.stroke();
    }
  }

  const pointColors = [
    '#ff3b30', '#ff9f1c', '#ffd60a', '#32d74b', '#00c2ff',
    '#7c4dff', '#ff4db8', '#00e5ff', '#7ae582', '#ff7f50',
    '#ffb703', '#f72585', '#4cc9f0', '#90be6d', '#f6bd60',
    '#9d4edd', '#48cae4', '#80ed99', '#f9c74f', '#ff8fab'
  ];

  for (let i = 0; i < landmarks.length; i += 1) {
    const point = landmarks[i];
    ctx.beginPath();
    ctx.fillStyle = pointColors[i] || '#ffffff';
    ctx.arc(point.x * canvas.width, point.y * canvas.height, i === 0 ? 7 : 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function isOpenPalm(landmarks) {
  if (!landmarks || landmarks.length < 21) return false;

  const fingerTipIndices = [4, 8, 12, 16, 20];
  const fingerBaseIndices = [2, 6, 10, 14, 18];

  const hasSpread = landmarks[4].x > landmarks[2].x - 0.08 && landmarks[4].x < landmarks[2].x + 0.18;

  const tipsAboveBases = fingerTipIndices.every((tipIndex, index) => {
    const baseIndex = fingerBaseIndices[index];
    return landmarks[tipIndex].y < landmarks[baseIndex].y;
  });

  const thumbOpen = landmarks[4].x > landmarks[3].x;
  const handUp = landmarks[9].y < landmarks[0].y + 0.2;

  return hasSpread && tipsAboveBases && thumbOpen && handUp;
}

function handlePalmScan(results) {
  if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) {
    if (handConfirmed) {
      handConfirmed = false;
      welcomeText.textContent = 'Awaiting palm verification';
      setStatus('PALM SCAN STANDBY', false);
    }
    drawHandSkeleton(results);
    return;
  }

  const landmarks = results.multiHandLandmarks[0];
  drawHandSkeleton(results);

  if (!isOpenPalm(landmarks)) {
    setStatus('PALM REQUIRES OPEN POSITION', false);
    return;
  }

  if (!handConfirmed) {
    handConfirmed = true;
    selectedAgent = agentNames[Math.floor(Math.random() * agentNames.length)];
    welcomeText.textContent = `Welcome, Agent ${selectedAgent}`;
    setStatus('ACCESS GRANTED', true);

    setTimeout(() => {
      redirectToMission(selectedAgent);
    }, 1200);
  }
}

async function startCamera() {
  if (cameraStarted) return;

  if (!window.Hands || !window.Camera) {
    welcomeText.textContent = 'MediaPipe failed to load';
    setStatus('RELOAD PAGE', false);
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    });

    video.srcObject = stream;
    await video.play();

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults(handlePalmScan);

    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: canvas.width,
      height: canvas.height
    });

    camera.start();
    cameraStarted = true;
    activateBtn.textContent = 'Camera Online';
    activateBtn.disabled = true;
    setStatus('PALM SCAN STANDBY', false);
  } catch (error) {
    console.error(error);
    welcomeText.textContent = 'Camera access denied';
    setStatus('ENABLE CAMERA ACCESS', false);
  }
}

activateBtn.addEventListener('click', startCamera);
setStatus('PALM SCAN STANDBY', false);
