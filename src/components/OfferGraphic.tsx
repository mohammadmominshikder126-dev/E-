export function OfferGraphic() {
  return (
    <div className="w-full overflow-hidden rounded-sm bg-[#222222] select-none">
      <svg
        viewBox="0 0 400 320"
        className="w-full h-auto block"
        role="img"
        aria-label="বিশেষ ছাড় ও সীমিত সময়ের অফার"
      >
        <rect width="400" height="320" fill="#222222" />

        {/* Subtle diagonal warm olive/amber bands matching screenshot */}
        <polygon points="150,0 205,0 65,320 10,320" fill="#352E18" />
        <polygon points="275,0 330,0 190,320 135,320" fill="#352E18" />
        <polygon points="370,0 400,0 280,320 225,320" fill="#2D2818" />

        {/* Accent gold dots */}
        <circle cx="48" cy="76" r="5" fill="#9A7209" />
        <circle cx="144" cy="296" r="3.5" fill="#9A7209" />
        <circle cx="356" cy="280" r="6" fill="#9A7209" />

        {/* Large golden-yellow percent circle */}
        <circle cx="242" cy="176" r="102" fill="#F5B400" />

        {/* Bold dark percent symbol inside circle */}
        <g stroke="#222222" strokeWidth="13" strokeLinecap="round" fill="none">
          <circle cx="212" cy="144" r="20" />
          <circle cx="272" cy="208" r="20" />
          <line x1="274" y1="132" x2="210" y2="220" />
        </g>

        {/* Bottom-left 3D isometric cube */}
        <g transform="translate(86, 240)">
          {/* Top face */}
          <polygon points="0,-46 42,-24 0,-2 -42,-24" fill="#F8FAFC" />
          {/* Left face */}
          <polygon points="-42,-24 0,-2 0,46 -42,24" fill="#E2E8F0" />
          {/* Right face */}
          <polygon points="42,-24 0,-2 0,46 42,24" fill="#CBD5E1" />
        </g>

        {/* Top-right 3D isometric cube overlapping circle edge */}
        <g transform="translate(332, 102)">
          {/* Top face */}
          <polygon points="0,-32 29,-17 0,-2 -29,-17" fill="#F8FAFC" />
          {/* Left face */}
          <polygon points="-29,-17 0,-2 0,32 -29,17" fill="#E2E8F0" />
          {/* Right face */}
          <polygon points="29,-17 0,-2 0,32 29,17" fill="#CBD5E1" />
        </g>
      </svg>
    </div>
  );
}
