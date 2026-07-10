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
  // WCAG 2.5.3 (label-in-name): when the button shows visible text, the
  // accessible name must contain it — so speech-control users can activate it
  // by the words they see. Fold the visible label into aria-label; fall back to
  // the play/pause hint only for icon-only (no visible text) usage.
  const hasTextLabel = typeof children === 'string' && children.trim().length > 0;
  const accessibleLabel = hasTextLabel ? `${children.trim()}, ${tooltipText}` : tooltipText;

  return (
    <button
      type="button"
      className={`audio-link ${status} ${className}`.trim()}
      onClick={handleClick}
      title={tooltipText}
      aria-label={accessibleLabel}>
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
