<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="900" height="520" viewBox="0 0 900 520">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="75%">
      <stop offset="0" stop-color="#10213f"/>
      <stop offset="1" stop-color="#05070d"/>
    </radialGradient>
    <linearGradient id="neon" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#58a6ff"/>
      <stop offset="1" stop-color="#a371f7"/>
    </linearGradient>
    <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#58a6ff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#58a6ff" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#58a6ff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="frame"><rect x="560" y="60" width="280" height="350" rx="22"/></clipPath>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="particles" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n">
        <animate attributeName="baseFrequency" values="0.9;0.35;0.02;0.02;0.35;0.9" keyTimes="0;0.2;0.4;0.7;0.9;1" dur="10s" repeatCount="indefinite"/>
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="40" xChannelSelector="R" yChannelSelector="G">
        <animate attributeName="scale" values="90;50;0;0;50;90" keyTimes="0;0.2;0.4;0.7;0.9;1" dur="10s" repeatCount="indefinite"/>
      </feDisplacementMap>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="900" height="520" fill="url(#bg)"/>

  <!-- Moving grid for depth -->
  <g stroke="#58a6ff" stroke-opacity="0.12" stroke-width="1">
    <path d="M0 440 H900 M0 400 H900 M0 365 H900 M0 335 H900 M0 310 H900"/>
    <path d="M450 290 L0 520 M450 290 L150 520 M450 290 L300 520 M450 290 L450 520 M450 290 L600 520 M450 290 L750 520 M450 290 L900 520"/>
    <animateTransform attributeName="transform" type="translate" values="0 0;0 12;0 0" dur="6s" repeatCount="indefinite"/>
  </g>

  <!-- Drifting particle field -->
  <g fill="#58a6ff" filter="url(#glow)">
    <circle cx="60" cy="90" r="2"><animate attributeName="cy" values="90;40;90" dur="7s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="140" cy="430" r="2.5" fill="#a371f7"><animate attributeName="cy" values="430;380;430" dur="8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.2;1" dur="4s" repeatCount="indefinite"/></circle>
    <circle cx="320" cy="60" r="1.8"><animate attributeName="cy" values="60;110;60" dur="6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite"/></circle>
    <circle cx="480" cy="470" r="2" fill="#a371f7"><animate attributeName="cy" values="470;420;470" dur="9s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.2;1;0.2" dur="3.5s" repeatCount="indefinite"/></circle>
    <circle cx="520" cy="40" r="2.2"><animate attributeName="cy" values="40;85;40" dur="7.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="870" cy="120" r="2" fill="#a371f7"><animate attributeName="cy" values="120;70;120" dur="8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.2;1;0.2" dur="4s" repeatCount="indefinite"/></circle>
    <circle cx="880" cy="440" r="2.4"><animate attributeName="cy" values="440;395;440" dur="6.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;1;0.3" dur="2.8s" repeatCount="indefinite"/></circle>
    <circle cx="250" cy="250" r="1.6" fill="#a371f7"><animate attributeName="cx" values="250;290;250" dur="7s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.2;1;0.2" dur="3.2s" repeatCount="indefinite"/></circle>
  </g>

  <!-- Orbit rings behind the photo (3D-style tilt) -->
  <g transform="translate(700 235)" fill="none" filter="url(#glow)">
    <ellipse rx="205" ry="70" stroke="url(#neon)" stroke-width="1.5" stroke-dasharray="4 8" transform="rotate(-18)">
      <animateTransform attributeName="transform" type="rotate" from="-18" to="342" dur="24s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse rx="175" ry="55" stroke="#58a6ff" stroke-opacity="0.6" stroke-width="1" transform="rotate(28)">
      <animateTransform attributeName="transform" type="rotate" from="388" to="28" dur="18s" repeatCount="indefinite"/>
    </ellipse>
    <circle r="5" fill="#a371f7">
      <animateMotion dur="6s" repeatCount="indefinite" path="M-205 0 A205 70 0 1 1 205 0 A205 70 0 1 1 -205 0"/>
    </circle>
  </g>

  <!-- Photo with particle assemble effect -->
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="5s" repeatCount="indefinite"/>
    <rect x="552" y="52" width="296" height="366" rx="26" fill="none" stroke="url(#neon)" stroke-width="2" filter="url(#glow)">
      <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
    </rect>
    <g clip-path="url(#frame)">
      <g filter="url(#particles)">
        <image x="560" y="60" width="280" height="350" preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,PASTE_BASE64_HERE" xlink:href="data:image/jpeg;base64,PASTE_BASE64_HERE"/>
      </g>
      <!-- Scan line -->
      <rect x="560" y="60" width="280" height="40" fill="url(#scan)">
        <animate attributeName="y" values="40;380;40" dur="5s" repeatCount="indefinite"/>
      </rect>
    </g>
    <!-- Corner brackets -->
    <g stroke="#58a6ff" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#glow)">
      <path d="M552 90 V52 H590"/><path d="M810 52 H848 V90"/>
      <path d="M552 380 V418 H590"/><path d="M810 418 H848 V380"/>
    </g>
  </g>

  <!-- Text side -->
  <g font-family="'Segoe UI', Arial, sans-serif">
    <text x="60" y="170" font-size="22" fill="#58a6ff" letter-spacing="6">HELLO, I AM</text>
    <text x="60" y="235" font-size="56" font-weight="700" fill="#ffffff" filter="url(#glow)">Hanshit Singh</text>
    <text x="60" y="285" font-size="22" fill="#c9d1d9">CS Diploma Student  |  Frontend  |  UX</text>
    <rect x="60" y="310" width="260" height="3" rx="1.5" fill="url(#neon)">
      <animate attributeName="width" values="0;260;260;0" keyTimes="0;0.3;0.8;1" dur="6s" repeatCount="indefinite"/>
    </rect>
    <text x="60" y="350" font-size="16" fill="#8b949e">Open to internships and junior roles</text>
  </g>
</svg>
