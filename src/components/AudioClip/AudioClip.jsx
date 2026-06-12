import { useRef } from 'react';
import AudioManager from '../../audio/AudioManager';
import { resolveAsset } from '../../utils/assets';
import { CircularAudioProgress } from './CircularAudioProgress';
import { CircularAudioProgressAnimatedSpeaker } from './CircularAudioProgressAnimatedSpeaker';
import { LinkAudioProgress } from './LinkAudioProgress';

/**
 * Native <audio controls> variants (compact / labelled / default). The browser
 * owns playback UI; on play we stop every other clip but leave this element
 * running (AudioManager.stopAll with `except`).
 */
function NativeAudioClip({ className = '', id, listenText = '', soundFile }) {
  const audioRef = useRef(null);

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    AudioManager.stopAll({ except: audioRef.current });
  };

  const renderAudio = (ariaLabel) => (
    <audio
      aria-label={ariaLabel}
      className={className || ''}
      controls
      id={id}
      onPlay={handlePlay}
      ref={audioRef}
    ><source src={resolveAsset(soundFile)} /></audio>
  );

  if (className.split(/\s+/).includes('compact')) {
    return renderAudio('Audio clip');
  }

  if (listenText !== '') {
    return (
      <label className="audio-clip" htmlFor={`${id}`}>{listenText}:&nbsp;
        {renderAudio(listenText || 'Audio clip')}
      </label>
    );
  }

  return <div className="audio-clip">{renderAudio('Audio clip')}</div>;
}

/**
 * Public AudioClip: dispatches to the right variant based on className tokens.
 * Variant order matches the original class component (link → super-compact →
 * super-compact-speaker → native).
 */
export function AudioClip({
  className = '',
  children,
  id,
  inline = false,
  listenText = '',
  size,
  soundFile,
}) {
  const classes = className.split(/\s+/);

  if (classes.includes('link')) {
    return (
      <LinkAudioProgress className={className} id={id} soundFile={soundFile}>
        {children}
      </LinkAudioProgress>
    );
  }

  if (classes.includes('super-compact')) {
    return (
      <CircularAudioProgress
        className={className}
        id={id}
        inline={inline}
        size={size}
        soundFile={soundFile}
      />
    );
  }

  if (classes.includes('super-compact-speaker')) {
    return (
      <CircularAudioProgressAnimatedSpeaker
        className={className}
        id={id}
        inline={inline}
        size={size}
        soundFile={soundFile}
      />
    );
  }

  return (
    <NativeAudioClip className={className} id={id} listenText={listenText} soundFile={soundFile} />
  );
}
