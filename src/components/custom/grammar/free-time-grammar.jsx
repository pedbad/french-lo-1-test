import { AudioClip } from "@/components/AudioClip";
import { GrammarLabel } from "@/components/custom/grammar/GrammarLabel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { memo } from "react";
import { playAudioLink } from "@/utils/audioPlayback";

export const FreeTimeGrammarAdjectiveAgreement = memo(function FreeTimeGrammarAdjectiveAgreement({ id }) {
  return (
    <div
      className="lo8-grammar1-container container"
      id={id || undefined}
      key={`${id}CustomComponent`}
    >
      <div
        className="panel"
        id={id ? `${id}Panel1` : undefined}
        key={`${id}Panel1`}
      >
        <p>
						Some adjectives ending in <strong>f</strong> change to <strong>-ve</strong>
          {" "}in the feminine form, for example{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/adjective-agreement/001-sportif.mp3"
          >
							sport<strong>if</strong>
          </AudioClip>
          {" "}and{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/adjective-agreement/002-actif.mp3"
          >
							act<strong>if</strong>
          </AudioClip>
						. Compare these two examples:
        </p>
        {/* p→div: short <p> with audio triggers WAVE "possible heading" */}
        <div className="mb-0 ml-2 space-y-1">
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/adjective-agreement/003-mon-frere-est-sportif.mp3"
            >
								Mon frère est sport<strong>if</strong>.
            </AudioClip>
          </div>
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/adjective-agreement/004-ma-soeur-est-sportive.mp3"
            >
								Ma sœur est sporti<strong>ve</strong>.
            </AudioClip>
          </div>
        </div>
      </div>
    </div>
  );
});

export const FreeTimeGrammarFaireAndPartitives = memo(function FreeTimeGrammarFaireAndPartitives({ id }) {
  const handleRowClick = (soundFile, event) => {
    if (!soundFile) return;
    if (event?.defaultPrevented) return;

    const targetNode = event?.target;
    if (targetNode instanceof Element && targetNode.closest(".audio-link, .audio-container")) {
      return;
    }

    const rowEl = event?.currentTarget;
    const audioTrigger = rowEl?.querySelector("button.audio-link, .audio-container");
    if (audioTrigger) {
      audioTrigger.click();
      return;
    }

    playAudioLink(soundFile);
  };

  const faireRows = [
    {
      english: "I do / make",
      french: <>je <strong>fais</strong></>,
      soundFile: "audio/lo8/grammar/faire-and-partitives/002-je-fais.mp3",
    },
    {
      english: "you do / make",
      french: <>tu <strong>fais</strong></>,
      soundFile: "audio/lo8/grammar/faire-and-partitives/003-tu-fais.mp3",
    },
    {
      english: "he / she / it does / makes",
      french: <>il / elle <strong>fait</strong></>,
      soundFile: "audio/lo8/grammar/faire-and-partitives/004-il-elle-fait.mp3",
    },
    {
      english: "we do / make",
      french: <>nous <strong>faisons</strong></>,
      soundFile: "audio/lo8/grammar/faire-and-partitives/005-nous-faisons.mp3",
    },
    {
      english: "you do / make",
      french: <>vous <strong>faites</strong></>,
      soundFile: "audio/lo8/grammar/faire-and-partitives/006-vous-faites.mp3",
    },
    {
      english: "they do / make",
      french: <>ils / elles <strong>font</strong></>,
      soundFile: "audio/lo8/grammar/faire-and-partitives/007-ils-elles-font.mp3",
    },
  ];
  const exampleRows = [
    {
      english: "I do gymnastics",
      french: <strong>Je fais de la gymnastique</strong>,
      soundFile: "audio/lo8/grammar/faire-and-partitives/012-je-fais-de-la-gymnastique.mp3",
    },
    {
      english: "I do gardening",
      french: <strong>Je fais du jardinage</strong>,
      soundFile: "audio/lo8/grammar/faire-and-partitives/013-je-fais-du-jardinage.mp3",
    },
    {
      english: "I make cakes",
      french: <strong>Je fais des gâteaux</strong>,
      soundFile: "audio/lo8/grammar/faire-and-partitives/014-je-fais-des-gateaux.mp3",
    },
  ];

  return (
    <div
      className="lo8-grammar2-container container"
      id={id || undefined}
      key={`${id}CustomComponent`}
    >
      <div
        className="panel"
        id={id ? `${id}Panel2` : undefined}
        key={`${id}Panel2`}
      >
        <p>
						The verb{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/faire-and-partitives/001-faire.mp3"
          >
            <strong>faire</strong>
          </AudioClip>
          {" "}means both <strong>to do</strong> and <strong>to make</strong>. It is very
						common and irregular, so it is worth learning well. Here it is in the present tense:
        </p>
        <Table aria-label="French and English" className="grammar-audio-table" variant="learning">
          <TableHeader className="sr-table-head">
            <TableRow>
              <TableHead scope="col">French</TableHead>
              <TableHead scope="col">English</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faireRows.map((row, index) => (
              <TableRow
                className="cursor-pointer has-audio-row"
                key={`${id || "lo8-grammar2"}-faire-row-${index}`}
                onClick={(event) => handleRowClick(row.soundFile, event)}
              >
                <TableCell className="cursor-pointer">
                  <AudioClip className="link" soundFile={row.soundFile}>
                    {row.french}
                  </AudioClip>
                </TableCell>
                <TableCell className="cursor-pointer">{row.english}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p>
						When you talk about activities after <strong>faire</strong>, French usually
						needs a partitive article:
          {" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/faire-and-partitives/008-du.mp3"
          >
            <strong>du</strong>
          </AudioClip>
          {" "}for masculine nouns,{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/faire-and-partitives/009-de-la.mp3"
          >
            <strong>de la</strong>
          </AudioClip>
          {" "}for feminine nouns,{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/faire-and-partitives/010-de-l.mp3"
          >
            <strong>de l&apos;</strong>
          </AudioClip>
          {" "}before a vowel or silent <strong>h</strong>, and{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/faire-and-partitives/011-des.mp3"
          >
            <strong>des</strong>
          </AudioClip>
          {" "}for plurals.
        </p>
        {/* p→div: short label triggers WAVE "possible heading" */}
        <GrammarLabel>Here are some examples:</GrammarLabel>
        <Table aria-label="French and English" className="grammar-audio-table" variant="learning">
          <TableHeader className="sr-table-head">
            <TableRow>
              <TableHead scope="col">French</TableHead>
              <TableHead scope="col">English</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exampleRows.map((row, index) => (
              <TableRow
                className="cursor-pointer has-audio-row"
                key={`${id || "lo8-grammar2"}-example-row-${index}`}
                onClick={(event) => handleRowClick(row.soundFile, event)}
              >
                <TableCell className="cursor-pointer">
                  <AudioClip className="link" soundFile={row.soundFile}>
                    {row.french}
                  </AudioClip>
                </TableCell>
                <TableCell className="cursor-pointer">{row.english}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

export const FreeTimeGrammarJouerPatterns = memo(function FreeTimeGrammarJouerPatterns({ id }) {
  const handleRowClick = (soundFile, event) => {
    if (!soundFile) return;
    if (event?.defaultPrevented) return;

    const targetNode = event?.target;
    if (targetNode instanceof Element && targetNode.closest(".audio-link, .audio-container")) {
      return;
    }

    const rowEl = event?.currentTarget;
    const audioTrigger = rowEl?.querySelector("button.audio-link, .audio-container");
    if (audioTrigger) {
      audioTrigger.click();
      return;
    }

    playAudioLink(soundFile);
  };

  const instrumentRows = [
    {
      english: "I play the piano",
      french: <strong>Je joue du piano</strong>,
      soundFile: "audio/lo8/grammar/jouer-patterns/002-je-joue-du-piano.mp3",
    },
    {
      english: "I play the clarinet",
      french: <strong>Je joue de la clarinette</strong>,
      soundFile: "audio/lo8/grammar/jouer-patterns/003-je-joue-de-la-clarinette.mp3",
    },
  ];
  const gameRows = [
    {
      english: "I play football",
      french: <strong>Je joue au football</strong>,
      soundFile: "audio/lo8/grammar/jouer-patterns/009-je-joue-au-football.mp3",
    },
    {
      english: "I play pétanque",
      french: <strong>Je joue à la pétanque</strong>,
      soundFile: "audio/lo8/grammar/jouer-patterns/010-je-joue-a-la-petanque.mp3",
    },
  ];

  return (
    <div
      className="lo8-grammar3-container container"
      id={id || undefined}
      key={`${id}CustomComponent`}
    >
      <div
        className="panel"
        id={id ? `${id}Panel3` : undefined}
        key={`${id}Panel3`}
      >
        <p>
						The regular <strong>-er</strong> verb{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/jouer-patterns/001-jouer.mp3"
          >
            <strong>jouer</strong>
          </AudioClip>
          {" "}is useful when talking about hobbies and games.
        </p>
        <p>
						After{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/jouer-patterns/001-jouer.mp3"
          >
            <strong>jouer</strong>
          </AudioClip>
						, you use <strong>jouer de</strong> plus the partitive article for musical
						instruments:
        </p>
        <Table aria-label="French and English" className="grammar-audio-table" variant="learning">
          <TableHeader className="sr-table-head">
            <TableRow>
              <TableHead scope="col">French</TableHead>
              <TableHead scope="col">English</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instrumentRows.map((row, index) => (
              <TableRow
                className="cursor-pointer has-audio-row"
                key={`${id || "lo8-grammar3"}-instrument-row-${index}`}
                onClick={(event) => handleRowClick(row.soundFile, event)}
              >
                <TableCell className="cursor-pointer">
                  <AudioClip className="link" soundFile={row.soundFile}>
                    {row.french}
                  </AudioClip>
                </TableCell>
                <TableCell className="cursor-pointer">{row.english}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p>
						When you use{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/jouer-patterns/001-jouer.mp3"
          >
            <strong>jouer</strong>
          </AudioClip>
          {" "}for ball games and table games, you use{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/jouer-patterns/004-jouer-a.mp3"
          >
            <strong>jouer à</strong>
          </AudioClip>
						. This becomes{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/jouer-patterns/005-jouer-au.mp3"
          >
            <strong>jouer au</strong>
          </AudioClip>
          {" "}for masculine nouns,{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/jouer-patterns/006-jouer-a-la.mp3"
          >
            <strong>jouer à la</strong>
          </AudioClip>
          {" "}for feminine nouns,{" "}
          <strong>jouer à l&apos;</strong>
          {" "}before a vowel or silent <strong>h</strong>, and{" "}
          <AudioClip
            className="link"
            soundFile="audio/lo8/grammar/jouer-patterns/008-jouer-aux.mp3"
          >
            <strong>jouer aux</strong>
          </AudioClip>
          {" "}for plurals.
        </p>
        {/* p→div: short label triggers WAVE "possible heading" */}
        <GrammarLabel>For example:</GrammarLabel>
        <Table aria-label="French and English" className="grammar-audio-table" variant="learning">
          <TableHeader className="sr-table-head">
            <TableRow>
              <TableHead scope="col">French</TableHead>
              <TableHead scope="col">English</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gameRows.map((row, index) => (
              <TableRow
                className="cursor-pointer has-audio-row"
                key={`${id || "lo8-grammar3"}-game-row-${index}`}
                onClick={(event) => handleRowClick(row.soundFile, event)}
              >
                <TableCell className="cursor-pointer">
                  <AudioClip className="link" soundFile={row.soundFile}>
                    {row.french}
                  </AudioClip>
                </TableCell>
                <TableCell className="cursor-pointer">{row.english}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

export const FreeTimeGrammarNounEndings = memo(function FreeTimeGrammarNounEndings({ id }) {
  return (
    <div
      className="lo8-grammar4-container container"
      id={id || undefined}
      key={`${id}CustomComponent`}
    >
      <div
        className="panel"
        id={id ? `${id}Panel4` : undefined}
        key={`${id}Panel4`}
      >
        <p>
						Some word endings can help you guess noun gender. Many nouns ending in
          <strong> -tion</strong> or <strong>-ie</strong> are feminine:
        </p>
        <div className="mb-0 ml-2 space-y-1">
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/noun-endings/001-laction.mp3"
            >
								l&apos;action
            </AudioClip>
          </div>
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/noun-endings/002-la-nation.mp3"
            >
								la nation
            </AudioClip>
          </div>
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/noun-endings/003-la-natation.mp3"
            >
								la natation
            </AudioClip>
          </div>
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/noun-endings/004-la-biologie.mp3"
            >
								la biologie
            </AudioClip>
          </div>
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/noun-endings/005-la-geographie.mp3"
            >
								la géographie
            </AudioClip>
          </div>
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/noun-endings/006-la-sociologie.mp3"
            >
								la sociologie
            </AudioClip>
          </div>
        </div>
        {/* p→div: short label triggers WAVE "possible heading" */}
        <GrammarLabel className="mt-2">Many nouns ending in <strong>-isme</strong> are masculine, for example:</GrammarLabel>
        <div className="mb-0 ml-2 space-y-1">
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/noun-endings/007-lathletisme.mp3"
            >
								l&apos;athlétisme
            </AudioClip>
          </div>
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/noun-endings/008-lexistentialisme.mp3"
            >
								l&apos;existentialisme
            </AudioClip>
          </div>
          <div>
            <AudioClip
              className="link"
              soundFile="audio/lo8/grammar/noun-endings/009-le-socialisme.mp3"
            >
								le socialisme
            </AudioClip>
          </div>
        </div>
      </div>
    </div>
  );
});
