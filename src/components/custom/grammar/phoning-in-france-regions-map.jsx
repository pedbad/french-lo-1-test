import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CircularAudioProgressAnimatedSpeakerDisplay } from "@/components/AudioClip";
import franceTelephoneMapSvg from "@/assets/lo9/france-telephone-area-codes.svg?raw";
import { resolveAsset } from "@/utils/assets";
import { stopAllAudioPlayback, trackFloatingAudio } from "@/utils/audioPlayback";

const REGION_DETAILS = {
	"01": {
		audio: "audio/lo9/grammar/telephone-regions/001-region-01.mp3",
		cities: ["Paris", "Versailles", "Saint-Denis"],
		coverage: "Capital region — all Paris landlines and 8 surrounding departments.",
		label: "Île-de-France",
		regions: ["Île-de-France"],
	},
	"02": {
		audio: "audio/lo9/grammar/telephone-regions/002-region-02.mp3",
		cities: ["Lille", "Rouen", "Rennes", "Nantes", "Tours"],
		coverage:
			"Hauts-de-France, Normandy, Brittany, Pays de la Loire, Centre-Val de Loire.",
		label: "Northwest France",
		regions: [
			"Normandie",
			"Hauts-de-France",
			"Bretagne",
			"Pays de la Loire",
			"Centre-Val de Loire",
		],
	},
	"03": {
		audio: "audio/lo9/grammar/telephone-regions/003-region-03.mp3",
		cities: ["Lyon", "Strasbourg", "Dijon", "Grenoble"],
		coverage:
			"Grand Est, Bourgogne-Franche-Comté, Auvergne-Rhône-Alpes.",
		label: "Northeast France",
		regions: [
			"Grand Est",
			"Bourgogne-Franche-Comté",
			"Auvergne-Rhône-Alpes",
		],
	},
	"04": {
		audio: "audio/lo9/grammar/telephone-regions/004-region-04.mp3",
		cities: ["Marseille", "Nice", "Toulon", "Ajaccio"],
		coverage: "Provence-Alpes-Côte d'Azur and Corsica.",
		label: "Southeast France",
		regions: ["Provence-Alpes-Côte d'Azur", "Corse"],
	},
	"05": {
		audio: "audio/lo9/grammar/telephone-regions/005-region-05.mp3",
		cities: ["Bordeaux", "Toulouse", "Montpellier"],
		coverage: "Nouvelle-Aquitaine and Occitanie.",
		label: "Southwest France",
		regions: ["Nouvelle-Aquitaine", "Occitanie"],
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

const SVG_MARKUP = franceTelephoneMapSvg.replace(/<\?xml[\s\S]*?\?>\s*/i, "").trim();

const LEGEND_ITEMS = [
	{
		code: "01",
		label: "Île-de-France",
		swatchClassName: "regional-telephone-map__legend-swatch--01",
	},
	{
		code: "02",
		label: "Northwest",
		swatchClassName: "regional-telephone-map__legend-swatch--02",
	},
	{
		code: "03",
		label: "Northeast",
		swatchClassName: "regional-telephone-map__legend-swatch--03",
	},
	{
		code: "04",
		label: "Southeast",
		swatchClassName: "regional-telephone-map__legend-swatch--04",
	},
	{
		code: "05",
		label: "Southwest",
		swatchClassName: "regional-telephone-map__legend-swatch--05",
	},
	{
		code: "06 / 07",
		isMobile: true,
		label: "Mobile (nationwide)",
		swatchClassName: "regional-telephone-map__legend-swatch--mobile",
	},
];

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

function applyRegionHighlight(svgRoot, activeCode) {
	const departments = svgRoot.querySelectorAll(".land");
	const labels = svgRoot.querySelectorAll("text");

	departments.forEach((department) => {
		resetDepartmentStyles(department);
		const departmentCode = getRegionCodeFromElement(department);
		if (!activeCode) {
			return;
		}

		if (departmentCode === activeCode) {
			department.style.filter = "brightness(1.08) saturate(1.06)";
			department.style.stroke = "#ffffff";
			department.style.strokeWidth = "2.8";
			department.style.transform = "scale(1.045)";
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
			label.style.transform = "scale(1.08)";
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
	const mapContainerRef = useRef(null);
	const svgRootRef = useRef(null);
	const [activeRegionCode, setActiveRegionCode] = useState(null);

	useLayoutEffect(() => {
		const mapContainer = mapContainerRef.current;
		if (!mapContainer) {
			return undefined;
		}

		mapContainer.innerHTML = SVG_MARKUP;

		const svgRoot = mapContainer.querySelector("svg");
		if (!svgRoot) {
			return undefined;
		}

		svgRootRef.current = svgRoot;
		svgRoot.classList.add("regional-telephone-map__svg");
		const width = svgRoot.getAttribute("width");
		const height = svgRoot.getAttribute("height");
		if (!svgRoot.getAttribute("viewBox") && width && height) {
			svgRoot.setAttribute("viewBox", `0 0 ${width} ${height}`);
		}
		svgRoot.setAttribute("preserveAspectRatio", "xMinYMin meet");
		svgRoot.removeAttribute("width");
		svgRoot.removeAttribute("height");

		const cleanups = [];
		const departments = Array.from(svgRoot.querySelectorAll(".land"));
		const labels = Array.from(svgRoot.querySelectorAll("text"));

		const handleMapLeave = () => {
			setActiveRegionCode(null);
			applyRegionHighlight(svgRoot, null);
		};

		svgRoot.addEventListener("mouseleave", handleMapLeave);
		cleanups.push(() => {
			svgRoot.removeEventListener("mouseleave", handleMapLeave);
		});

		departments.forEach((department) => {
			const regionCode = getRegionCodeFromElement(department);
			if (!regionCode) {
				return;
			}

			department.setAttribute("data-region-code", regionCode);

			const handleEnter = () => {
				setActiveRegionCode(regionCode);
				applyRegionHighlight(svgRoot, regionCode);
			};

			const handleClick = () => {
				setActiveRegionCode(regionCode);
				applyRegionHighlight(svgRoot, regionCode);
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

			label.setAttribute("data-region-code", regionCode);
			label.setAttribute("tabindex", "0");
			label.setAttribute("role", "button");
			label.setAttribute(
				"aria-label",
				`${REGION_DETAILS[regionCode].label}, telephone prefix ${regionCode}`,
			);

			const handleEnter = () => {
				setActiveRegionCode(regionCode);
				applyRegionHighlight(svgRoot, regionCode);
			};

			const handleLeave = () => {
				setActiveRegionCode(null);
				applyRegionHighlight(svgRoot, null);
			};

			const handleActivate = () => {
				setActiveRegionCode(regionCode);
				applyRegionHighlight(svgRoot, regionCode);
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

		applyRegionHighlight(svgRoot, null);

		return () => {
			cleanups.forEach((cleanup) => cleanup());
			svgRootRef.current = null;
			mapContainer.innerHTML = "";
		};
	}, []);

	useEffect(() => {
		if (svgRootRef.current) {
			applyRegionHighlight(svgRootRef.current, activeRegionCode);
		}
	}, [activeRegionCode]);

	const activeRegion =
		activeRegionCode && REGION_DETAILS[activeRegionCode]
			? REGION_DETAILS[activeRegionCode]
			: null;

	return (
		<figure className="regional-telephone-map">
			<div className="regional-telephone-map__layout">
				<div className="regional-telephone-map__legend" aria-label="Telephone region key">
					<div className="regional-telephone-map__legend-title">Key</div>
					<dl className="regional-telephone-map__legend-list">
						{LEGEND_ITEMS.map((item) => {
							const soundFile =
								item.audio ?? REGION_DETAILS[item.code]?.audio;

							return (
								<div
									key={item.code}
									className={`regional-telephone-map__legend-item${item.isMobile ? " regional-telephone-map__legend-item--mobile" : ""}`}
								>
									<dt>
										<span
											className={`regional-telephone-map__legend-swatch ${item.swatchClassName}`}
											aria-hidden="true"
										/>
									</dt>
									<dd>
										{item.isMobile ? (
											<span className="regional-telephone-map__legend-static">
												<span className="regional-telephone-map__legend-code">{item.code}</span>
												<span>{item.label}</span>
											</span>
										) : (
											<button
												type="button"
												className="regional-telephone-map__legend-trigger"
												onBlur={() => setActiveRegionCode(null)}
												onClick={() => {
													setActiveRegionCode(item.code);
													playRegionAudio(soundFile);
												}}
												onFocus={() => setActiveRegionCode(item.code)}
												onMouseEnter={() => setActiveRegionCode(item.code)}
												onMouseLeave={() => setActiveRegionCode(null)}
											>
												<CircularAudioProgressAnimatedSpeakerDisplay
													className="regional-telephone-map__legend-trigger-icon"
													inline={true}
													interactive={false}
													size="20"
													status={activeRegionCode === item.code ? "playing" : "stopped"}
													title={`Play ${item.code}`}
												/>
												<span className="regional-telephone-map__legend-code">{item.code}</span>
												<span>{item.label}</span>
											</button>
										)}
									</dd>
								</div>
							);
						})}
					</dl>
					{activeRegion ? (
						<div
							className={`regional-telephone-map__detail regional-telephone-map__detail--${activeRegionCode}`}
							aria-live="polite"
						>
							<div className="regional-telephone-map__detail-header">
								<span className="regional-telephone-map__detail-code">
									{activeRegionCode}
								</span>
								<span className="regional-telephone-map__detail-name">
									{activeRegion.label}
								</span>
							</div>
							<div className="regional-telephone-map__detail-section">
								<p className="regional-telephone-map__detail-label">Regions</p>
								<div className="regional-telephone-map__detail-pills">
									{activeRegion.regions.map((region) => (
										<span
											key={region}
											className="regional-telephone-map__detail-pill"
										>
											{region}
										</span>
									))}
								</div>
							</div>
							<div className="regional-telephone-map__detail-section">
								<p className="regional-telephone-map__detail-label">Cities</p>
								<div className="regional-telephone-map__detail-pills">
									{activeRegion.cities.map((city) => (
										<span
											key={city}
											className="regional-telephone-map__detail-pill regional-telephone-map__detail-pill--soft"
										>
											{city}
										</span>
									))}
								</div>
							</div>
							<p className="regional-telephone-map__detail-summary">
								{activeRegion.coverage}
							</p>
						</div>
					) : null}
				</div>
				<div
					className="regional-telephone-map__canvas"
					role="group"
					aria-label="Interactive map of French landline telephone regions"
				>
					<div ref={mapContainerRef} className="regional-telephone-map__svg-host" />
				</div>
				<figcaption className="regional-telephone-map__caption">
					<small>
						Telephone regions of France. Base map:{" "}
						<cite className="regional-telephone-map__caption-source">
							Wikimedia Commons, Babsy, CC BY 3.0
						</cite>
						.
					</small>
				</figcaption>
			</div>
		</figure>
	);
}
