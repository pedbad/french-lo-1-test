import { useEffect, useRef, useState } from "react";
import { resolveAsset } from "@/utils/assets";
import { stopAllAudioPlayback, trackFloatingAudio } from "@/utils/audioPlayback";

const REGION_DETAILS = {
	"01": {
		audio: "audio/lo9/grammar/telephone-regions/001-region-01.mp3",
		label: "Île-de-France",
	},
	"02": {
		audio: "audio/lo9/grammar/telephone-regions/002-region-02.mp3",
		label: "Northwest France",
	},
	"03": {
		audio: "audio/lo9/grammar/telephone-regions/003-region-03.mp3",
		label: "Northeast France",
	},
	"04": {
		audio: "audio/lo9/grammar/telephone-regions/004-region-04.mp3",
		label: "Southeast France",
	},
	"05": {
		audio: "audio/lo9/grammar/telephone-regions/005-region-05.mp3",
		label: "Southwest France",
	},
};

const FILL_TO_REGION_CODE = {
	"#00ccff": "02",
	"#55d400": "04",
	"#ff0000": "03",
	"#ff6600": "05",
	"#ffcc00": "01",
	"rgb(0, 204, 255)": "02",
	"rgb(255, 0, 0)": "03",
	"rgb(255, 102, 0)": "05",
	"rgb(255, 204, 0)": "01",
	"rgb(85, 212, 0)": "04",
};

function normalizeColor(value = "") {
	return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getFillValue(element) {
	const inlineFill = element.getAttribute("fill");
	if (inlineFill) {
		return normalizeColor(inlineFill);
	}

	const styleAttribute = element.getAttribute("style") ?? "";
	const styleFillMatch = styleAttribute.match(/fill:\s*([^;]+)/i);
	if (styleFillMatch) {
		return normalizeColor(styleFillMatch[1]);
	}

	return normalizeColor(window.getComputedStyle(element).fill);
}

function getRegionCodeFromElement(element) {
	const explicitCode = element.getAttribute("data-region-code");
	if (explicitCode && REGION_DETAILS[explicitCode]) {
		return explicitCode;
	}

	const textCode = element.textContent?.trim();
	if (textCode && REGION_DETAILS[textCode]) {
		return textCode;
	}

	return FILL_TO_REGION_CODE[getFillValue(element)] ?? null;
}

function resetDepartmentStyles(element) {
	element.style.cursor = "pointer";
	element.style.filter = "";
	element.style.opacity = "";
	element.style.stroke = "";
	element.style.strokeWidth = "";
	element.style.transform = "";
	element.style.transformBox = "fill-box";
	element.style.transformOrigin = "center";
	element.style.transition =
		"transform 160ms ease, filter 160ms ease, opacity 160ms ease, stroke-width 160ms ease";
}

function resetLabelStyles(element) {
	element.style.cursor = "pointer";
	element.style.filter = "";
	element.style.opacity = "";
	element.style.transform = "";
	element.style.transformBox = "fill-box";
	element.style.transformOrigin = "center";
	element.style.transition =
		"transform 160ms ease, filter 160ms ease, opacity 160ms ease";
}

function applyRegionHighlight(svgDocument, activeCode) {
	const departments = svgDocument.querySelectorAll(".land");
	const labels = svgDocument.querySelectorAll("text");

	departments.forEach((department) => {
		resetDepartmentStyles(department);
		const departmentCode = getRegionCodeFromElement(department);
		if (!activeCode) {
			return;
		}

		if (departmentCode === activeCode) {
			department.style.filter = "brightness(1.08) saturate(1.04)";
			department.style.stroke = "#ffffff";
			department.style.strokeWidth = "2.5";
			department.style.transform = "scale(1.03)";
		} else {
			department.style.opacity = "0.72";
		}
	});

	labels.forEach((label) => {
		const labelCode = getRegionCodeFromElement(label);
		resetLabelStyles(label);
		if (!activeCode || !labelCode) {
			return;
		}

		if (labelCode === activeCode) {
			label.style.filter = "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))";
			label.style.transform = "scale(1.05)";
		} else {
			label.style.opacity = "0.55";
		}
	});
}

function playRegionAudio(soundFile) {
	const audio = new Audio(resolveAsset(soundFile));
	trackFloatingAudio(audio);
	stopAllAudioPlayback(audio);
	audio.play().catch(() => {});
}

export function PhoningInFranceRegionsMap() {
	const objectRef = useRef(null);
	const svgDocumentRef = useRef(null);
	const [activeRegionCode, setActiveRegionCode] = useState(null);

	useEffect(() => {
		const objectElement = objectRef.current;
		if (!objectElement) {
			return undefined;
		}

		const cleanups = [];

		const bindInteractiveMap = () => {
			const svgDocument = objectElement.contentDocument;
			if (!svgDocument) {
				return;
			}
			svgDocumentRef.current = svgDocument;

			const svgRoot = svgDocument.querySelector("svg");
			const departments = Array.from(svgDocument.querySelectorAll(".land"));
			const labels = Array.from(svgDocument.querySelectorAll("text"));

			if (svgRoot) {
				const handleMapLeave = () => {
					setActiveRegionCode(null);
					applyRegionHighlight(svgDocument, null);
				};

				svgRoot.addEventListener("mouseleave", handleMapLeave);
				cleanups.push(() => {
					svgRoot.removeEventListener("mouseleave", handleMapLeave);
				});
			}

			departments.forEach((department) => {
				const regionCode = getRegionCodeFromElement(department);
				if (!regionCode) {
					return;
				}

				department.setAttribute("data-region-code", regionCode);

				const handleEnter = () => {
					setActiveRegionCode(regionCode);
					applyRegionHighlight(svgDocument, regionCode);
				};

				const handleClick = () => {
					setActiveRegionCode(regionCode);
					applyRegionHighlight(svgDocument, regionCode);
					playRegionAudio(REGION_DETAILS[regionCode].audio);
				};

				department.addEventListener("mouseenter", handleEnter);
				department.addEventListener("click", handleClick);

				cleanups.push(() => {
					department.removeEventListener("mouseenter", handleEnter);
					department.removeEventListener("click", handleClick);
				});
			});

			labels.forEach((label) => {
				const regionCode = getRegionCodeFromElement(label);
				if (!regionCode) {
					return;
				}

				label.setAttribute("tabindex", "0");
				label.setAttribute("role", "button");
				label.setAttribute(
					"aria-label",
					`${REGION_DETAILS[regionCode].label}, telephone prefix ${regionCode}`,
				);

				const handleEnter = () => {
					setActiveRegionCode(regionCode);
					applyRegionHighlight(svgDocument, regionCode);
				};

				const handleLeave = () => {
					setActiveRegionCode(null);
					applyRegionHighlight(svgDocument, null);
				};

				const handleActivate = () => {
					setActiveRegionCode(regionCode);
					applyRegionHighlight(svgDocument, regionCode);
					playRegionAudio(REGION_DETAILS[regionCode].audio);
				};

				const handleKeyDown = (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						handleActivate();
					}
				};

				label.addEventListener("mouseenter", handleEnter);
				label.addEventListener("mouseleave", handleLeave);
				label.addEventListener("focus", handleEnter);
				label.addEventListener("blur", handleLeave);
				label.addEventListener("click", handleActivate);
				label.addEventListener("keydown", handleKeyDown);

				cleanups.push(() => {
					label.removeEventListener("mouseenter", handleEnter);
					label.removeEventListener("mouseleave", handleLeave);
					label.removeEventListener("focus", handleEnter);
					label.removeEventListener("blur", handleLeave);
					label.removeEventListener("click", handleActivate);
					label.removeEventListener("keydown", handleKeyDown);
				});
			});

			applyRegionHighlight(svgDocument, null);
		};

		objectElement.addEventListener("load", bindInteractiveMap);
		if (objectElement.contentDocument) {
			bindInteractiveMap();
		}

		return () => {
			objectElement.removeEventListener("load", bindInteractiveMap);
			cleanups.forEach((cleanup) => cleanup());
			svgDocumentRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (svgDocumentRef.current) {
			applyRegionHighlight(svgDocumentRef.current, activeRegionCode);
		}
	}, [activeRegionCode]);

	const activeRegion =
		activeRegionCode && REGION_DETAILS[activeRegionCode]
			? REGION_DETAILS[activeRegionCode]
			: null;

	return (
		<figure className="figure centre max1000 regional-telephone-map">
			<div
				className="regional-telephone-map__canvas"
				role="group"
				aria-label="Interactive map of French landline telephone regions"
			>
				<object
					ref={objectRef}
					className="regional-telephone-map__object"
					data={resolveAsset("img/lo9/france-telephone-area-codes.svg")}
					type="image/svg+xml"
				>
					<img
						alt="Map of French landline telephone regions"
						className="regional-telephone-map__fallback"
						src={resolveAsset("img/lo9/france-telephone-area-codes.svg")}
					/>
				</object>
			</div>
			<figcaption>
				Telephone regions of France. Base map: Wikimedia Commons, Babsy, CC BY
				3.0.
			</figcaption>
			<div className="regional-telephone-map__status" aria-live="polite">
				{activeRegion ? (
					<>
						<strong>{activeRegionCode}</strong>
						<span>{activeRegion.label}</span>
					</>
				) : (
					<span>Hover, tap, or focus a region code to hear its prefix.</span>
				)}
			</div>
		</figure>
	);
}
