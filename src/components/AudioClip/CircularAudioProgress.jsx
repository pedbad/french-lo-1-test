import { useEffect, useRef } from 'react';
import { useAudioClip } from './useAudioClip';

const getCompactControlSize = (size, fallback) => {
  const parsedSize = Number.parseInt(size, 10);
  return Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : fallback;
};

/**
 * super-compact variant: a play/pause button with an SVG progress ring driven
 * by the off-DOM Audio element's timeupdate (via useAudioClip).
 */
export function CircularAudioProgress({ className = '', id, inline = false, size, soundFile }) {
  const { status, progress, duration, handleClick } = useAudioClip(soundFile, { id });
  const circleRef = useRef(null);

  const strokeWidth = 2;
  const bgColour = 'var(--border)';

  const root = getComputedStyle(document.documentElement);
  const compactDimension = parseInt(root.getPropertyValue('--compact-dimension').trim(), 10);
  const controlSize = getCompactControlSize(size, compactDimension);

  // Mirror the original updateCircleOffset: sync stroke offset whenever
  // progress/duration change. Uses the 27 fallback for the offset circumference
  // exactly as the class version did.
  useEffect(() => {
    if (!circleRef.current) return;
    const offsetControlSize = getCompactControlSize(size, 27);
    const circumference = Math.PI * offsetControlSize;
    const offset = circumference * (1 - (progress / duration || 0));
    circleRef.current.style.strokeDashoffset = offset;
  }, [progress, duration, size]);

  if (isNaN(controlSize)) {
    return null;
  }

  const radius = (controlSize - strokeWidth) / 2;
  const circumference = Math.PI * controlSize;

  return (
    <button
      type="button"
      className={`audio-container ${inline ? 'inline' : ''} super-compact circular-audio-progress ${status} ${className}`.trim()}
      onClick={handleClick}
      aria-label={`${status !== 'playing' ? 'Click to play' : 'Click to pause'}`}
      style={{ height: `${controlSize}px`, width: `${controlSize}px` }}
    >
      <svg
        fill="none"
        width={controlSize}
        height={controlSize}
        className="pointer-events-none">
        <circle
          cx={controlSize / 2}
          cy={controlSize / 2}
          r={radius}
          stroke={bgColour}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          ref={circleRef}
          cx={controlSize / 2}
          cy={controlSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 ${controlSize / 2} ${controlSize / 2})`}
          style={{ transition: 'stroke-dashoffset 0.2s linear' }}
        />
        <path fill="currentColor" d="m18.64 13.5-5.14 3.448-5.14 3.447V6.604l5.14 3.447z" className="play" />
        <path fill="currentColor" className="pause" d="M6.501 6.617h4.611v13.765H6.501zM14.966 6.617h4.611v13.765h-4.611z"/>
      </svg>
    </button>
  );
}
