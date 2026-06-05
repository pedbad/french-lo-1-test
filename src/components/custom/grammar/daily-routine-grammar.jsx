import { AudioClip } from "@/components/AudioClip";
import { GrammarLabel } from "@/components/custom/grammar/GrammarLabel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { playAudioLink } from "@/utils/audioPlayback";
import { PureComponent } from "react";

const handleAudioRowClick = (soundFile, event) => {
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

const AudioTable = ({ rows, tableId }) => (
  <Table aria-label="French and English" className="grammar-audio-table" variant="learning">
    <TableHeader className="sr-table-head">
      <TableRow>
        <TableHead scope="col">French</TableHead>
        <TableHead scope="col">English</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.map((row, index) => (
        <TableRow
          className="cursor-pointer has-audio-row"
          key={`${tableId}-row-${index}`}
          onClick={(event) => handleAudioRowClick(row.soundFile, event)}
        >
          <TableCell>
            <AudioClip className="link" soundFile={row.soundFile}>
              {row.french}
            </AudioClip>
          </TableCell>
          <TableCell>{row.english}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export class DailyRoutineGrammarOn extends PureComponent {
  render = () => {
    const { id } = this.props;
    return (
      <div id={id || undefined}>
        <h3>1. Using <em>on</em> in everyday French</h3>
        <p>
					The French subject pronoun{" "}
          <AudioClip className="link" soundFile="audio/lo13/grammar/001-on.mp3">
            <strong>on</strong>
          </AudioClip>{" "}
					literally means <strong>one</strong>, but in everyday speech it very often
					means <strong>we</strong>. Depending on the context, it can also mean
          <strong> people</strong> or <strong>you</strong> in a general sense.
        </p>
        <p>
					It is commonly used instead of{" "}
          <AudioClip className="link" soundFile="audio/lo13/grammar/002-nous.mp3">
            <strong>nous</strong>
          </AudioClip>{" "}
					in spoken French, but it still takes the <strong>third-person singular</strong>{" "}
					verb form.
        </p>
        {/* p→div: short label triggers WAVE "possible heading" */}
        <GrammarLabel>For example:</GrammarLabel>
        <div className="mb-0 ml-2 space-y-1">
          <div>
            <AudioClip className="link" soundFile="audio/lo13/grammar/003-on-parle-francais-ici.mp3">
              <strong>On parle français ici.</strong>
            </AudioClip>{" "}
						— "French is spoken here"
          </div>
          <div>
            <AudioClip className="link" soundFile="audio/lo13/grammar/004-on-va-au-cinema.mp3">
              <strong>On va au cinéma&nbsp;?</strong>
            </AudioClip>{" "}
						— "Are we going to the cinema?" or "Shall we go to the cinema?"
          </div>
        </div>
      </div>
    );
  };
}

export class DailyRoutineGrammarReflexiveVerbs extends PureComponent {
  render = () => {
    const { id } = this.props;
    const reflexiveRows = [
      {
        english: "to rest (oneself)",
        french: <strong>se reposer</strong>,
        soundFile: "audio/lo13/vocabulary/017-se-reposer.mp3",
      },
      {
        english: "I rest / I am resting",
        french: <strong>je me repose</strong>,
        soundFile: "audio/lo13/grammar/012-je-me-repose.mp3",
      },
      {
        english: "you rest / you are resting",
        french: <strong>tu te reposes</strong>,
        soundFile: "audio/lo13/grammar/013-tu-te-reposes.mp3",
      },
      {
        english: "he rests / he is resting",
        french: <strong>il se repose</strong>,
        soundFile: "audio/lo13/grammar/014-il-se-repose.mp3",
      },
      {
        english: "she rests / she is resting",
        french: <strong>elle se repose</strong>,
        soundFile: "audio/lo13/grammar/011-elle-se-repose.mp3",
      },
      {
        english: "we / people rest / are resting",
        french: <strong>on se repose</strong>,
        soundFile: "audio/lo13/grammar/015-on-se-repose.mp3",
      },
      {
        english: "we rest / we are resting",
        french: <strong>nous nous reposons</strong>,
        soundFile: "audio/lo13/grammar/016-nous-nous-reposons.mp3",
      },
      {
        english: "you rest / you are resting",
        french: <strong>vous vous reposez</strong>,
        soundFile: "audio/lo13/grammar/017-vous-vous-reposez.mp3",
      },
      {
        english: "they rest / they are resting",
        french: <strong>ils / elles se reposent</strong>,
        soundFile: "audio/lo13/grammar/018-ils-se-reposent-elles-se-reposent.mp3",
      },
    ];

    return (
      <div id={id || undefined}>
        <h3>2. Forming reflexive verbs in the present tense</h3>
        <p>
					In French, <strong>reflexive verbs</strong> are verbs where the subject and
					object refer to the same person. In the infinitive, they usually appear with{" "}
          <strong>se</strong>, for example{" "}
          <AudioClip className="link" soundFile="audio/lo13/grammar/005-se-laver.mp3">
            <strong>se laver</strong>
          </AudioClip>{" "}
					and{" "}
          <AudioClip className="link" soundFile="audio/lo13/vocabulary/017-se-reposer.mp3">
            <strong>se reposer</strong>
          </AudioClip>
					.
        </p>
        <p>
					In a sentence, the reflexive pronoun comes between the subject and the verb:
        </p>
        <div className="mb-0 ml-2 space-y-1">
          <div>
            <AudioClip className="link" soundFile="audio/lo13/grammar/006-me.mp3">
              <strong>me</strong>
            </AudioClip>
          </div>
          <div>
            <AudioClip className="link" soundFile="audio/lo13/grammar/007-te.mp3">
              <strong>te</strong>
            </AudioClip>
          </div>
          <div>
            <AudioClip className="link" soundFile="audio/lo13/grammar/008-se.mp3">
              <strong>se</strong>
            </AudioClip>
          </div>
          <div>
            <AudioClip className="link" soundFile="audio/lo13/grammar/002-nous.mp3">
              <strong>nous</strong>
            </AudioClip>
          </div>
          <div>
            <AudioClip className="link" soundFile="audio/lo13/grammar/009-vous.mp3">
              <strong>vous</strong>
            </AudioClip>
          </div>
          <div>
            <AudioClip className="link" soundFile="audio/lo13/grammar/008-se.mp3">
              <strong>se</strong>
            </AudioClip>
          </div>
        </div>
        {/* p→div: short label triggers WAVE "possible heading" */}
        <GrammarLabel>For example:</GrammarLabel>
        <div className="mb-0 ml-2 space-y-1">
          <div>
            <AudioClip className="link" soundFile="audio/lo13/grammar/010-je-me-lave.mp3">
              <strong>Je me lave</strong>
            </AudioClip>{" "}
						— "I wash myself / I have a wash"
          </div>
          <div>
            <AudioClip className="link" soundFile="audio/lo13/grammar/011-elle-se-repose.mp3">
              <strong>Elle se repose</strong>
            </AudioClip>{" "}
						— "She is resting / She is having a rest."
          </div>
        </div>
        <GrammarLabel>Here is the present tense of <strong>se reposer</strong>:</GrammarLabel>
        <AudioTable rows={reflexiveRows} tableId={id || "lo13-grammar2"} />
      </div>
    );
  };
}

export class DailyRoutineGrammarReflexiveBeforeVowel extends PureComponent {
  render = () => {
    const { id } = this.props;
    const appelerRows = [
      {
        english: "I am called",
        french: <strong>je m&apos;appelle</strong>,
        soundFile: "audio/lo13/grammar/020-je-mappelle.mp3",
      },
      {
        english: "you are called",
        french: <strong>tu t&apos;appelles</strong>,
        soundFile: "audio/lo13/grammar/021-tu-tappelles.mp3",
      },
      {
        english: "he is called",
        french: <strong>il s&apos;appelle</strong>,
        soundFile: "audio/lo13/grammar/022-il-sappelle.mp3",
      },
      {
        english: "she is called",
        french: <strong>elle s&apos;appelle</strong>,
        soundFile: "audio/lo13/grammar/023-elle-sappelle.mp3",
      },
      {
        english: "we / people are called",
        french: <strong>on s&apos;appelle</strong>,
        soundFile: "audio/lo13/grammar/024-on-sappelle.mp3",
      },
      {
        english: "we are called",
        french: <strong>nous nous appelons</strong>,
        soundFile: "audio/lo13/grammar/025-nous-nous-appelons.mp3",
      },
      {
        english: "you are called",
        french: <strong>vous vous appelez</strong>,
        soundFile: "audio/lo13/grammar/026-vous-vous-appelez.mp3",
      },
      {
        english: "they are called",
        french: <strong>ils / elles s&apos;appellent</strong>,
        soundFile: "audio/lo13/grammar/027-ils-sappellent-elles-sappellent.mp3",
      },
    ];

    return (
      <div id={id || undefined}>
        <h3>3. Reflexive forms before a vowel</h3>
        <p>
					When a reflexive verb begins with a vowel or silent <strong>h</strong>, the
					short pronouns change to <strong>m&apos;</strong>, <strong>t&apos;</strong>,
					and <strong>s&apos;</strong>. The plural forms <strong>nous</strong> and{" "}
          <strong>vous</strong> stay the same.
        </p>
        <p>
					The verb{" "}
          <AudioClip className="link" soundFile="audio/lo13/grammar/019-sappeler.mp3">
            <strong>s&apos;appeler</strong>
          </AudioClip>{" "}
					is a useful model for this pattern.
        </p>
        <AudioTable rows={appelerRows} tableId={id || "lo13-grammar3"} />
      </div>
    );
  };
}
