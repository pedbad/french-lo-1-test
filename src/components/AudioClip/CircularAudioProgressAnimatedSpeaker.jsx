import { CircularAudioProgressAnimatedSpeakerDisplay } from './CircularAudioProgressAnimatedSpeakerDisplay';
import { useAudioClip } from './useAudioClip';

/**
 * super-compact-speaker variant: thin wrapper that feeds useAudioClip state
 * into the (already functional) animated speaker display.
 */
export function CircularAudioProgressAnimatedSpeaker({ className = '', id, inline, size, soundFile, title }) {
  const { status, progress, duration, handleClick } = useAudioClip(soundFile, { id });

  return (
    <span>
      <CircularAudioProgressAnimatedSpeakerDisplay
        className={className}
        size={size}
        inline={inline}
        status={status}
        progress={progress}
        duration={duration}
        handleClick={handleClick}
        title={title}
      />
    </span>
  );
}
