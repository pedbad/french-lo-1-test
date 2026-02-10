import "./PhraseTable.scss";
import {
	AudioClip,
	IconButton,
	Info,
} from "../../components";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DOMPurify from "dompurify";
import React from "react";
// eslint-disable-next-line no-unused-vars
import { playAudioLink, resolveAsset } from "../../utility";

export class PhraseTable extends React.PureComponent {
	// Table of phrases with translations column and sound files column.
	// config is passed from the parent so that multiple exercises are possible.

	constructor(props) {
		super(props);

		// Make a *detached* copy of the phrases so we never mutate props.config
		const configPhrases = (props.config && props.config.phrases) || [];
		this.originalPhrases = configPhrases.map((row) => [...row]);

		this.state = {
			...props.config,
			tableSort: "natural",
			// we *don't* keep phrases in state anymore
		};
	}

	normalizeForSort = (value) => {
		// Strip HTML tags, lowercase, and remove accents
		if (!value) return "";

		const noTags = value.replace(/<[^>]*>/g, ""); // remove HTML tags
		const lower = noTags.toLocaleLowerCase("fr");

		// Normalize accents: é -> e, à -> a, etc.
		return lower
			.normalize("NFD")
			.replace(/\p{Diacritic}/gu, ""); // needs modern JS (Unicode regex)
	};

	render = () => {
		const {
			config,
			targetLanguageCode,
		} = this.props;
		const {
			footnote = "",
			footnoteHTML,
			header,
			htmlContent,
			id = [],
			tableSort,
		} = this.state;

		const { sortable = false } = config;

		// Always start from the immutable original
		const basePhrases = this.originalPhrases || [];

		// Use this for both alphabetical and reverse
		const collator = new Intl.Collator(targetLanguageCode, { sensitivity: "base" });

		let phrasesForView;

		if (tableSort === "natural") {
			// NATURAL: original phrases including blank spacer rows
			phrasesForView = basePhrases;
		} else {
			// SORTED VIEWS: remove blank rows before sorting
			const nonBlank = basePhrases.filter(
				(p) => !(p[0] === "" && p.length === 1)
			);

			// Sort ascending by first column
			nonBlank.sort((a, b) => {
				const A = this.normalizeForSort(a[0]);
				const B = this.normalizeForSort(b[0]);
				return collator.compare(A, B);
			});

			if (tableSort === "reverse") {
				// Reverse alphabetical: alphabetical, then reversed
				nonBlank.reverse();
			}

			phrasesForView = nonBlank;
		}

		// Longest row: use original phrases so spacer colSpan is correct in natural mode
		let longestRow = 0;
		for (let i = 0; i < basePhrases.length; i++) {
			if (basePhrases[i].length > longestRow) longestRow = basePhrases[i].length;
		}

		// Header cells
		const headerCells = [];
		if (header) {
			for (let i = 0; i < header.length; i++) {
				headerCells.push(
					<TableHead key={`${id}header${i}`}>{header[i]}</TableHead>
				);
			}
		}

		// Table rows from phrasesForView
		const rows = [];
		for (let i = 0; i < phrasesForView.length; i++) {
			const phrase = phrasesForView[i];
			const cells = [];
			const rowSoundFile =
				typeof phrase[0] === "string" && phrase[0].endsWith(".mp3")
					? phrase[0]
					: null;

			if (phrase[0] === "" && phrase.length === 1) {
				// Blank row (only possible in natural mode now)
				rows.push(
					<TableRow className="spacer" key={`row${i}`}>
						<TableCell colSpan={longestRow}></TableCell>
					</TableRow>
				);
			} else {
				for (let j = 0; j < phrase.length; j++) {
					const value = phrase[j];

					if (typeof value === "string" && value.slice(-4) === ".mp3") {
						// Sound file
						const soundFile = `${value}`;
						cells.push(
							<TableCell key={`row${i}cell${j}`}>
								<AudioClip
									className="super-compact-speaker"
									label=""
									soundFile={soundFile}
								/>
							</TableCell>
						);
					} else {
						cells.push(
							<TableCell key={`row${i}cell${j}`}>
								<span
									dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
								/>
							</TableCell>
						);
					}
				}

				rows.push(
					<TableRow
						className={rowSoundFile ? "cursor-pointer" : ""}
						key={`row${i}`}
						onClick={(e) => this.handleRowClick(rowSoundFile, e)}
					>
						{cells}
					</TableRow>
				);
			}
		}

		return (
			<div
				className="phrases-table-container container"
				id={`${id ? id : ""}`}
				key={`${id}PhraseTable`}
			>
				{/* Info is now rendered at the Accordion level for consistent placement. */}

				{htmlContent ? (
					<div
						className="html-content"
						dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
					/>
				) : null}

				{sortable ?
					<div className="sort-container">
						{/* Use shadcn/Radix tooltip instead of native title tooltips. */}
						<Tooltip>
							{/* TooltipTrigger needs a ref-capable element; wrap IconButton in a span. */}
							<TooltipTrigger asChild>
								<span className="inline-flex">
									<IconButton
										theme="natural"
										size="sm"
										onClick={() => this.setState({ tableSort: "natural" })}
										ariaLabel={`Vocabulary organised semantically`}
									>
										Semantic
									</IconButton>
								</span>
							</TooltipTrigger>
							<TooltipContent className="bg-[var(--footer-background)] text-foreground">
								Vocabulary organised semantically
							</TooltipContent>
						</Tooltip>
						{tableSort === "alphabetical" ?
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="inline-flex">
										<IconButton
											theme="reverse"
											size="sm"
											onClick={() => this.setState({ tableSort: "reverse" })}
											ariaLabel={`Vocabulary organised alphabetically`}
										>
											Alphabetical
										</IconButton>
									</span>
								</TooltipTrigger>
								<TooltipContent className="bg-[var(--footer-background)] text-foreground">
									Vocabulary organised alphabetically
								</TooltipContent>
							</Tooltip>
							:
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="inline-flex">
										<IconButton
											theme="alphabetic"
											size="sm"
											onClick={() => this.setState({ tableSort: "alphabetical" })}
											ariaLabel={`Vocabulary organised alphabetically`}
										>
											Alphabetical
										</IconButton>
									</span>
								</TooltipTrigger>
								<TooltipContent className="bg-[var(--footer-background)] text-foreground">
									Vocabulary organised alphabetically
								</TooltipContent>
							</Tooltip>
						}
					</div>
					: null}

				<Table>
					{header ? (
						<TableHeader>
							<TableRow>{headerCells}</TableRow>
						</TableHeader>
					) : null}
					<TableBody>{rows}</TableBody>
				</Table>

				{footnote ? <p className="ootnote">{footnote}</p> : null}
				{footnoteHTML ? (
					<p
						className="footNote"
						dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(footnoteHTML) }}
					/>
				) : null}
			</div>
		);
	};

	handleRowClick = (soundFile, event) => {
		if (!soundFile) return;
		if (event?.defaultPrevented) return;
		const targetNode = event?.target;
		const anchorElement =
			targetNode instanceof Element
				? targetNode.closest(".modal-link, .modal-link")
				: targetNode?.parentElement?.closest(".modal-link, .modal-link");
		if (anchorElement) return;

		if (targetNode instanceof Element && targetNode.closest('.audio-container')) return;
		const rowEl = event?.currentTarget;
		const speakerButton = rowEl?.querySelector('.audio-container');
		if (speakerButton) {
			speakerButton.click();
			return;
		}
		playAudioLink(soundFile);
	};
}
