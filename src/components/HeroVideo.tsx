import { useState } from "react";

export default function HeroVideo() {
  const [play, setPlay] = useState(false);
  const videoId = "y818qiCzKCk";
  const posterHQ = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const posterFallback = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="mx-auto" style={{ maxWidth: 1200 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%", // 16:9
          borderRadius: 16,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {!play && (
          <button
            type="button"
            aria-label="Play demo video"
            onClick={() => setPlay(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
              border: 0,
              background: "transparent",
              zIndex: 10,
            }}
          >
            {/* Try maxres; if it 404s, browser falls back to hqdefault via onError */}
            <img
              src={posterHQ}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = posterFallback; }}
              alt="VyaparGuru demo poster"
              fetchpriority="high"
              decoding="async"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.85)",
              }}
            />
            <span
              style={{
                position: "relative",
                display: "inline-flex",
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
                <polygon points="24,18 24,46 46,32" fill="#000" />
              </svg>
            </span>
          </button>
        )}

        {play && (
          <iframe
            title="VyaparGuru Demo"
            // remove loading="lazy" for above-the-fold
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0&playsinline=1&controls=1`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
              zIndex: 5,
            }}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
