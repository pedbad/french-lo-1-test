import { AudioClip } from "@/components/AudioClip";

const highlightClass = "modal-highlight-flash font-semibold text-amber-950";

export const LO2SubjectPronounsBody = ({ highlightTarget = "" } = {}) => {
	const isActive = (target) => highlightTarget === target;
	const highlight = (target) => (isActive(target) ? highlightClass : "");

	return (
		<>
			<div className={`space-y-2`}>
				<p>
					<span className={`modal-link-target ${highlight("subject-pronouns-il")}`} id={`subject-pronouns-il`}>
						<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/003-il-est.mp3`}><strong>Il</strong></AudioClip> is used to replace a masculine noun.
					</span>
				</p>
				<p>
					<span className={`modal-link-target ${highlight("subject-pronouns-elle")}`} id={`subject-pronouns-elle`}>
						<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/001-elle-est.mp3`}><strong>Elle</strong></AudioClip> is used to replace a feminine noun.
					</span>
				</p>
				<p>
					<span className={`modal-link-target ${highlight("subject-pronouns-ils")}`} id={`subject-pronouns-ils`}>
						<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/004-ils-sont.mp3`}><strong>Ils</strong></AudioClip> is used to replace more than one masculine noun or a mixture of masculine and feminine nouns.
					</span>
				</p>
				<p>
					<span className={`modal-link-target ${highlight("subject-pronouns-elles")}`} id={`subject-pronouns-elles`}>
						<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/002-elles-sont.mp3`}><strong>Elles</strong></AudioClip> is used to replace more than one feminine noun.
					</span>
				</p>
				<p>
					<span className={`modal-link-target ${highlight("subject-pronouns-iel")}`} id={`subject-pronouns-iel`}>
						<AudioClip className={`link`} soundFile={`audio/lo2/grammar/grammar-and-usage/025-iel.mp3`}><strong>iel</strong></AudioClip> is a gender-neutral singular pronoun.
					</span>
				</p>
			</div>
		</>
	);
};
