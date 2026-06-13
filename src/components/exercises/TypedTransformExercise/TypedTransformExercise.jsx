import { TextEntryExerciseRuntime } from "../TextEntryExerciseRuntime/TextEntryExerciseRuntime";

// Semantic wrapper: prompt -> typed transformed target form.
// Kept on shared runtime for parity; planned divergence is isolated below.
// TODO(component-split): keep transformed-form tolerant matching here
// (for example agreement variants) without affecting DictationExercise.
export function TypedTransformExercise(props) {
  return (
    <TextEntryExerciseRuntime
      {...props}
      audioClipClassName="super-compact-speaker"
      audioColumnPosition="left"
    />
  );
}
