import * as exercisesComponents from "./exercises";
import * as grammarComponents from "./grammar";
import * as miscComponents from "./misc";
import * as pronunciationComponents from "./pronunciation";

// Explicit registry map. This is the single runtime source of truth
// for custom FR component keys resolved from LO config.
export const AllCustomComponentsFR = {
	...grammarComponents,
	...pronunciationComponents,
	...exercisesComponents,
	...miscComponents,
};

export const {
	Grammar1Body,
	Grammar2Body,
	LO2SubjectPronounsBody,
} = grammarComponents;
