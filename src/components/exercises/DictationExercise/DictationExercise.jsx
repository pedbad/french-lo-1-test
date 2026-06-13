import { TextEntryExerciseRuntime } from "../TextEntryExerciseRuntime/TextEntryExerciseRuntime";

// Semantic wrapper: listen + transcribe.
// Kept on shared runtime for parity; planned divergence is isolated below.
// TODO(component-split): add dictation-specific normalization rules
// (punctuation/accents policy) without changing TypedTransformExercise.
export function DictationExercise(props) {
  return (
    <TextEntryExerciseRuntime
      {...props}
      audioClipClassName="super-compact-speaker"
      audioColumnPosition="left"
      comparisonOptions={{ comparisonMode: "dictation" }}
    />
  );
}
