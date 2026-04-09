import { AudioClip } from "@/components/AudioClip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";
import { PhoningInFranceRegionsMap } from "./phoning-in-france-regions-map";

export class PhoningInFranceGrammarTelephoneNumbers extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo9-grammar-container container"
				id="RegionalTelephoneMap"
				key={`${id}CustomComponent`}
			>
				<div
					className="panel"
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p>
						Within France, telephone numbers usually have ten digits. For landlines,
						the first two digits are the area code. Hover over the map to see the
						main telephone regions and click a region to hear its code.
					</p>
					<div className="lo9-figure-container">
						<PhoningInFranceRegionsMap />
					</div>
					<Table variant="learning">
						<TableBody>
							<TableRow>
								<TableCell>Île-de-France</TableCell>
								<TableCell>
									<AudioClip className="link" soundFile="audio/lo9/grammar/telephone-regions/001-region-01.mp3">01</AudioClip>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Northwest France</TableCell>
								<TableCell>
									<AudioClip className="link" soundFile="audio/lo9/grammar/telephone-regions/002-region-02.mp3">02</AudioClip>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Northeast France</TableCell>
								<TableCell>
									<AudioClip className="link" soundFile="audio/lo9/grammar/telephone-regions/003-region-03.mp3">03</AudioClip>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Southeast France</TableCell>
								<TableCell>
									<AudioClip className="link" soundFile="audio/lo9/grammar/telephone-regions/004-region-04.mp3">04</AudioClip>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Southwest France</TableCell>
								<TableCell>
									<AudioClip className="link" soundFile="audio/lo9/grammar/telephone-regions/005-region-05.mp3">05</AudioClip>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
					<p>
						Mobile numbers usually begin with <strong>06</strong> or <strong>07</strong>.
					</p>
					<p>
						Telephone numbers are normally spoken in two-digit groups, for example{" "}
						<AudioClip className="link" soundFile="audio/lo9/grammar/telephone-regions/006-example-mobile-number.mp3">
							07 11 15 22 55
						</AudioClip>
					</p>
				</div>
			</div>
		);
	};
}

export class PhoningInFranceGrammarBienForConfirmation extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className="lo9-grammar2-container container"
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className="panel"
					id={id ? `${id}Panel2` : undefined}
					key={`${id}Panel2`}
				>
					<p>
						<AudioClip
							className="link"
							soundFile="audio/lo9/grammar/bien-for-confirmation/001-bien.mp3"
						>
							<strong>Bien</strong>
						</AudioClip>
						{" "}usually means <strong>well</strong> or <strong>good</strong>.
						On the telephone, however, it can also help to check whether
						information is correct, a bit like <strong>isn&apos;t it?</strong> or
						<strong> that&apos;s right</strong>.
					</p>
					<Table variant="learning">
						<TableBody>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo9/grammar/bien-for-confirmation/002-cest-bien-le-06-22-14-66-33.mp3"
									>
										C&apos;est bien le 06 22 14 66 33 ?
									</AudioClip>
								</TableCell>
								<TableCell>This is 06 22 14 66 33, isn&apos;t it?</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo9/grammar/bien-for-confirmation/003-cest-bien-ca.mp3"
									>
										C&apos;est bien ça !
									</AudioClip>
								</TableCell>
								<TableCell>That&apos;s right. / It is indeed.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo9/grammar/bien-for-confirmation/004-vous-etes-bien-madame-galipot.mp3"
									>
										Vous êtes bien Madame Galipot ?
									</AudioClip>
								</TableCell>
								<TableCell>You are Madame Galipot, aren&apos;t you?</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<AudioClip
										className="link"
										soundFile="audio/lo9/grammar/bien-for-confirmation/003-cest-bien-ca.mp3"
									>
										C&apos;est bien ça !
									</AudioClip>
								</TableCell>
								<TableCell>That&apos;s right. / I am indeed.</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		);
	};
}
