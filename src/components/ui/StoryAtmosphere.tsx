export default function StoryAtmosphere() {
  return (
    <div className="atlas-atmosphere fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="atlas-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="#b9d3d5" strokeOpacity="0.042" strokeWidth="1" />
          </pattern>
          <radialGradient id="atlas-glow" cx="50%" cy="50%" r="50%">
            <stop stopColor="#3cc7bd" stopOpacity="0.11" />
            <stop offset="1" stopColor="#3cc7bd" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1600" height="1000" fill="url(#atlas-grid)" />
        <ellipse cx="1180" cy="210" rx="540" ry="360" fill="url(#atlas-glow)" />
        <path d="M-120 810 C250 700 385 875 675 690 S1170 370 1730 425" fill="none" stroke="#3cc7bd" strokeOpacity="0.12" strokeWidth="1" />
        <path d="M-140 838 C208 752 416 908 714 722 S1215 408 1740 454" fill="none" stroke="#e9a35a" strokeOpacity="0.07" strokeWidth="1" />
        <g fill="#3cc7bd" fillOpacity="0.16">
          <circle cx="103" cy="784" r="2" /><circle cx="253" cy="732" r="2" /><circle cx="510" cy="774" r="2" />
          <circle cx="874" cy="540" r="2" /><circle cx="1135" cy="351" r="2" /><circle cx="1406" cy="280" r="2" />
        </g>
      </svg>
    </div>
  );
}
