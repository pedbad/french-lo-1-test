import { CurrentLocationNasalRhymeExercise } from "@/components/exercises/current-location";
import * as grammarComponents from "./grammar";
import * as miscComponents from "./misc";
import * as pronunciationComponents from "./pronunciation";

// Explicit registry map. This is the single runtime source of truth
// for custom FR component keys resolved from LO config.
export const AllCustomComponentsFR = {
	...grammarComponents,
	...pronunciationComponents,
	CurrentLocationNasalRhymeExercise,
	...miscComponents,
};

export const {
	Grammar1Body,
	Grammar2Body,
	AboutMeSubjectPronounsBody,
} = grammarComponents;
