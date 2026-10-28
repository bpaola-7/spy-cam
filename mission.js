<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mission Briefing</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body class="mission-page">
    <main class="mission-panel">
      <div class="mission-top">
        <span>Agent Clearance</span>
        <strong id="agentBadge">AGENT MIRA</strong>
      </div>

      <div class="mission-header" id="missionTitle">Welcome.</div>
      <p class="mission-copy">Here's this mission.</p>

      <div class="briefing-box">
        <h2>Mission Briefing</h2>
        <p>
          Secure the encrypted courier before dawn. Maintain your disguise, avoid visual detection,
          and extract the package without leaving a trace. The target is moving through the abandoned tower
          district at 02:17.
        </p>
      </div>

      <div class="mission-actions">
        <button type="button" id="beginMission">Begin Mission</button>
        <button type="button" id="returnLogin">Return to Login</button>
      </div>
    </main>

    <script src="mission.js"></script>
  </body>
</html>
