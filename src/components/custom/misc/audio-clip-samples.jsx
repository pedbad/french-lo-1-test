import { AudioClip } from "@/components/AudioClip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { resolveAsset } from "@/utils/assets";
import { PureComponent } from "react";

export class AudioClipSamples extends PureComponent {
	render = () => {
		const { id } = this.props;
		return (
			<div
				className={`audio-clip-samples-container container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel`}
					id={id ? `${id}Panel` : undefined}
					key={`${id}CustomComponent`}
				>
					<h2>AudioClip Samples</h2>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>link:</TableCell>
								<TableCell><AudioClip className={`link`} soundFile={resolveAsset(`/sounds/fr/Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16.mp3`)} >Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16</AudioClip></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>compact:</TableCell>
								<TableCell><AudioClip className={`compact`} soundFile={resolveAsset(`/sounds/fr/Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16.mp3`)} >Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16</AudioClip></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>super-compact:</TableCell>
								<TableCell><AudioClip className={`super-compact`} soundFile={resolveAsset(`/sounds/fr/Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16.mp3`)} >Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16</AudioClip></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>super-compact-speaker:</TableCell>
								<TableCell><AudioClip className={`super-compact-speaker`} soundFile={resolveAsset(`/sounds/fr/Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16.mp3`)} >Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16</AudioClip></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>default:</TableCell>
								<TableCell><AudioClip className={``} soundFile={resolveAsset(`/sounds/fr/Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16.mp3`)} >Ah non, je suis désolée, il y a une erreur ! C'est le 01 23 08 08 16</AudioClip></TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		);
	};
}
