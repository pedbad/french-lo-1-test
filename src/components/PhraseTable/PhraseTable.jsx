import {
  AudioClip,
  IconButton,
  Info,
} from "../../components";
import {
  Table,
  TableBody,
  TableCaption,
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
import { resolveAsset } from "../../utils/assets";
import { playAudioLink } from "../../utils/audioPlayback";

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

  isAudioPath = (value) => typeof value === "string" && /\.mp3(?:[?#].*)?$/i.test(value.trim());

  getRowSortKey = (row = []) => {
    // Sort by first non-audio text cell so vocabulary sorts by the visible French term,
    // not by the hidden audio filename column.
    for (const cell of row) {
      if (typeof cell !== "string") continue;
      const trimmed = cell.trim();
      if (!trimmed) continue;
      if (this.isAudioPath(trimmed)) continue;
      return this.normalizeForSort(trimmed);
    }
    return "";
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
    // Tactical escape hatch for nested layouts (for example LO2 grammar inside accordion cards)
    // where PhraseTable's default `.container` padding creates double horizontal inset.
    // TODO: Replace this per-instance flag with a shared layout contract
    // (for example a parent "content-density" context or panel-level spacing token).
    const disableContainerPadding = Boolean(config.disableContainerPadding);
    const isSemanticSort = tableSort === "natural";
    const isAlphabeticalSort = tableSort === "alphabetical" || tableSort === "reverse";
    const semanticButtonClass = `vocab-sort-button btn-hero-title${isSemanticSort ? " vocab-sort-button-active" : ""}`;
    const alphabeticalButtonClass = `vocab-sort-button btn-ex-affirm${isAlphabeticalSort ? " vocab-sort-button-active" : ""}`;

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

      // Sort ascending by first non-audio text cell in each row.
      nonBlank.sort((a, b) => {
        const A = this.getRowSortKey(a);
        const B = this.getRowSortKey(b);
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
        // Empty header cell (e.g. audio speaker column) — WAVE flags empty <th>;
        // provide sr-only text so the cell has an accessible name.
        const content = header[i] === "" || header[i] == null
          ? <span className="sr-only">Audio</span>
          : header[i];
        headerCells.push(
          <TableHead key={`${id}header${i}`} scope="col">{content}</TableHead>
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
        const hasAudioCell = phrase.some(
          (value) => typeof value === "string" && value.endsWith(".mp3")
        );

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
            className={`${rowSoundFile ? "cursor-pointer" : ""} ${hasAudioCell ? "has-audio-row" : ""}`.trim()}
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
        className={`phrases-table-container${disableContainerPadding ? "" : " container"}`}
        id={`${id ? `${id}-phrase-table` : ""}`}
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
                    className={semanticButtonClass}
                    theme="natural"
                    size="lg"
                    variant="default"
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
                      className={alphabeticalButtonClass}
                      theme="reverse"
                      size="lg"
                      variant="default"
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
                      className={alphabeticalButtonClass}
                      theme="alphabetic"
                      size="lg"
                      variant="default"
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

        <Table variant="learning">
          <TableCaption className="sr-only">
						Phrase and translation table
          </TableCaption>
          {header ? (
            <TableHeader>
              <TableRow>{headerCells}</TableRow>
            </TableHeader>
          ) : (
            <TableHeader className="sr-table-head">
              <TableRow className="border-0">
                {Array.from({ length: longestRow }).map((_, index) => (
                  <TableHead key={`sr-header-${id}-${index}`} className="h-0 p-0 leading-[0]" scope="col">
                    {`Column ${index + 1}`}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>{rows}</TableBody>
        </Table>

        {footnote ? (
          <Info
            className={`mt-4`}
            variant={`warning`}
            informationText={footnote}
          />
        ) : null}
        {footnoteHTML ? (
          <Info
            className={`mt-4`}
            variant={`warning`}
            informationTextHTML={footnoteHTML}
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
			  ? targetNode.closest(".modal-link")
			  : targetNode?.parentElement?.closest(".modal-link");
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
