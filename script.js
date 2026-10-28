:root {
  --sky: #7cd2ff;
  --sky-deep: #4db9eb;
  --shell-main: #d4a0d6;
  --shell-light: #f0c9f3;
  --shell-shadow: #b666b4;
  --shell-dark: #8a4e98;
  --powder-pink: #ef9dc8;
  --powder-coral: #ff7a57;
  --metal: #b681be;
  --metal-dark: #3d254d;
  --text: #f7f3ff;
  --accent: #9ef7d7;
  --shadow: rgba(33, 13, 41, 0.38);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  height: 100%;
  font-family: "Inter", sans-serif;
  background: linear-gradient(180deg, var(--sky) 0%, var(--sky-deep) 100%);
  color: var(--text);
}

body {
  display: grid;
  place-items: center;
  overflow: hidden;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.17) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px);
  background-size: 30px 30px;
}

.scene {
  position: relative;
  width: min(90vw, 980px);
  height: min(90vh, 760px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.compact-shell {
  position: relative;
  width: min(72vw, 640px);
  height: min(60vw, 600px);
  max-height: 600px;
  border-radius: 50% 50% 52% 48% / 50% 50% 45% 45%;
  background: linear-gradient(135deg, var(--shell-light) 0%, var(--shell-main) 25%, var(--shell-shadow) 60%, var(--shell-dark) 100%);
  box-shadow:
    0 24px 60px rgba(65, 18, 72, 0.42),
    inset 0 0 0 10px rgba(255,255,255,0.15),
    inset 0 -16px 24px rgba(89, 39, 102, 0.3);
  transform: rotate(-10deg);
}

.compact-shell::before,
.compact-shell::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  inset: 18px;
  border: 10px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.compact-top {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
}

.hinge {
  position: absolute;
  width: 90px;
  height: 18px;
  border-radius: 20px;
  background: linear-gradient(90deg, rgba(34,17,36,.8), rgba(255,255,255,.2), rgba(34,17,36,.8));
  top: 22%;
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.18);
}

.hinge.left { left: 12%; transform: rotate(-12deg); }
.hinge.right { right: 12%; transform: rotate(12deg); }

.gem {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #d6ffde, #2b7b6d 30%, #11412f 70%, #0e2f2a);
  top: 6%;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 18px rgba(39, 180, 142, 0.9), inset 0 0 14px rgba(255,255,255,0.4);
}

.compact-face {
  position: absolute;
  inset: 18% 9% 30% 9%;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(39,24,51,0.18));
  box-shadow:
    inset 0 0 0 10px rgba(255,255,255,0.16),
    inset 0 -16px 18px rgba(45, 16, 61, 0.22);
  overflow: hidden;
}

.mirror-frame {
  position: relative;
  width: 82%;
  height: 72%;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(64, 169, 230, 0.14), rgba(19, 42, 68, 0.3));
  border: 10px solid rgba(198, 123, 221, 0.8);
  box-shadow: inset 0 0 0 10px rgba(255,255,255,0.1), 0 0 24px rgba(255,255,255,0.08);
  overflow: hidden;
}

#camera,
#handCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background: rgba(0,0,0,0.08);
}

#camera {
  filter: saturate(1.2) contrast(1.1) brightness(0.9);
  transform: scaleX(-1);
}

#handCanvas {
  z-index: 2;
  pointer-events: none;
}

.scan-ring {
  position: absolute;
  inset: 10% 14%;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.4);
  box-shadow: inset 0 0 0 5px rgba(255,255,255,0.08);
  z-index: 3;
  pointer-events: none;
}

.status-strip {
  position: absolute;
  left: 50%;
  bottom: 14%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(5, 16, 24, 0.4);
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 0 18px rgba(120, 241, 204, 0.25);
  z-index: 3;
  font-size: 0.72rem;
  letter-spacing: 0.16rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px rgba(151, 255, 207, 0.8);
}

.compact-lid {
  position: absolute;
  inset: 11% 14% 36% 14%;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(232, 160, 255, 0.25), rgba(118, 61, 130, 0.3));
  border: 2px solid rgba(124, 71, 122, 0.5);
  z-index: 1;
  pointer-events: none;
}

.powder-pan {
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: 11%;
  height: 30%;
  border-radius: 50% 50% 46% 46% / 63% 63% 34% 34%;
  background: linear-gradient(180deg, rgba(226, 163, 208, 0.95), rgba(194, 99, 171, 0.95));
  border: 8px solid rgba(135, 54, 126, 0.45);
  box-shadow: inset 0 0 0 8px rgba(255,255,255,0.08);
  display: flex;
  overflow: hidden;
}

.powder-half {
  flex: 1 1 50%;
  position: relative;
}

.powder-half.pink {
  background: linear-gradient(180deg, rgba(255, 205, 224, 0.9), rgba(234, 147, 180, 0.9));
  border-right: 6px solid rgba(132, 75, 125, 0.6);
}

.powder-half.coral {
  background: linear-gradient(180deg, rgba(255, 181, 145, 0.92), rgba(255, 122, 87, 0.92));
}

.agent-panel {
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
  width: min(78vw, 420px);
  text-align: center;
  background: rgba(35, 18, 40, 0.25);
  border: 1px solid rgba(255,255,255,0.19);
  backdrop-filter: blur(8px);
  box-shadow: 0 0 28px rgba(71, 28, 91, 0.25);
  border-radius: 18px;
  padding: 18px 18px 20px;
}

.seal {
  display: inline-block;
  margin-bottom: 8px;
  letter-spacing: 0.28rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255,255,255,0.72);
}

h1 {
  margin: 0;
  font-family: "Cinzel", serif;
  font-size: clamp(1.3rem, 2vw, 2.3rem);
  font-weight: 700;
  letter-spacing: 0.08rem;
  text-transform: uppercase;
  color: #f8e8ff;
}

button {
  margin-top: 14px;
  appearance: none;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #f5d9f0, #d68ed0 60%, #c06cc7);
  color: #2f1537;
  font-weight: 700;
  letter-spacing: 0.08rem;
  padding: 12px 22px;
  font-size: 0.8rem;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(73, 20, 128, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 28px rgba(73, 20, 128, 0.45);
}

button:active {
  transform: translateY(1px);
}

.mission-page {
  display: grid;
  place-items: center;
  background-image:
    linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(180deg, #66bdf2 0%, #3f9fe7 100%);
  background-size: 24px 24px, 24px 24px, 100% 100%;
  overflow: auto;
}

.mission-panel {
  width: min(88vw, 780px);
  background: rgba(42, 18, 47, 0.38);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 26px;
  padding: 28px 28px 32px;
  box-shadow: 0 26px 60px rgba(49, 17, 64, 0.28);
  backdrop-filter: blur(9px);
}

.mission-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  letter-spacing: 0.18rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  color: rgba(255,255,255,0.68);
}

.mission-top strong {
  color: #f9e6ff;
}

.mission-header {
  margin-top: 18px;
  font-family: "Cinzel", serif;
  font-size: clamp(2.2rem, 3vw, 4rem);
  line-height: 1.1;
  letter-spacing: 0.06rem;
  color: #fff3ff;
}

.mission-copy {
  margin-top: 18px;
  font-size: 1.06rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.9);
  max-width: 54ch;
}

.briefing-box {
  margin-top: 24px;
  border-radius: 20px;
  padding: 20px 20px 18px;
  background: linear-gradient(135deg, rgba(255,255,255,0.09), rgba(133, 81, 169, 0.14));
  border: 1px solid rgba(255,255,255,0.12);
}

.briefing-box h2 {
  margin: 0 0 12px;
  font-size: 0.86rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
}

.briefing-box p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.8;
  color: #f7ebff;
}

.mission-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 24px;
}

@media (max-width: 700px) {
  .scene {
    width: 100vw;
    height: 100vh;
    padding: 20px 10px 120px;
  }

  .compact-shell {
    width: min(86vw, 500px);
    height: min(78vw, 520px);
  }

  .agent-panel {
    bottom: 4%;
    width: min(88vw, 360px);
  }

  .mission-panel {
    padding: 22px 20px 24px;
  }

  .mission-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
