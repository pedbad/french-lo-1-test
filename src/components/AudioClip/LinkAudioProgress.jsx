import { CircularAudioProgressAnimatedSpeakerDisplay } from './CircularAudioProgressAnimatedSpeakerDisplay';
import { useAudioClip } from './useAudioClip';

/**
 * link variant: an inline text button (speaker glyph + label) that plays its
 * clip via useAudioClip. The speaker display is non-interactive here; the
 * surrounding button owns the click.
 */
export function LinkAudioProgress({ children, className = '', id, size, soundFile, title }) {
  const { status, progress, duration, handleClick } = useAudioClip(soundFile, { id });
  const tooltipText = title || (status !== 'playing' ? 'Click to play' : 'Click to pause');

  return (
    <button
      type="button"
      className={`audio-link ${status} ${className}`.trim()}
      onClick={handleClick}
      aria-label={tooltipText}>
      <CircularAudioProgressAnimatedSpeakerDisplay
        className={className}
        inline={true}
        status={status}
        progress={progress}
        duration={duration}
        interactive={false}
        size={size}
        title={tooltipText}
      />
      <span className="audio-link-text">{children}</span>
    </button>
  );
}
