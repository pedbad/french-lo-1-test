import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PureComponent } from "react";

export class CurrentLocationGrammarPrepositionsInPlaces extends PureComponent {
	render = () => {
		const { id } = this.props;
		const locationFormRows = [
			{
				examples: "Londres, Cambridge, Marseille",
				form: "à",
				use: "towns, cities, villages",
			},
			{
				examples: "Singapour, Hongkong, Taiwan",
				form: "à",
				use: "islands and archipelagos without gender",
			},
			{
				examples: "Maroc, Canada, Chili",
				form: "au",
				use: "masculine countries beginning with a consonant",
			},
			{
				examples: "France, Suisse, Chine",
				form: "en",
				use: "all feminine countries",
			},
			{
				examples: "Afghanistan, Iran, Andorre",
				form: "en",
				use: "masculine countries beginning with a vowel",
			},
			{
				examples: "Provence, Nouvelle Calédonie",
				form: "en",
				use: "feminine provinces and regions",
			},
			{
				examples: "Océanie, Afrique, Amérique du nord / du sud, Europe, Asie, Antarctique",
				form: "en",
				use: "the continents",
			},
			{
				examples: "Pays Bas, Seychelles, États-Unis",
				form: "aux",
				use: "plurals",
			},
			{
				examples: "Cambridgeshire, Derbyshire, Pas-de-Calais, Colorado",
				form: "dans le",
				use: "masculine provinces and regions including some British counties",
			},
		];
		return (
			<div
				className={`lo4-grammar-container`}
				id={id || undefined}
				key={`${id}CustomComponent`}
			>
				<div
					className={`panel !mt-0 !pt-2`}
					id={id ? `${id}Panel1` : undefined}
					key={`${id}Panel1`}
				>
					<p style={{ marginTop: 0 }}>
						In French there are several words that translate the word <strong>in</strong>. If you are saying{" "}
						<strong>in</strong> with a proper noun (a place name), you will use{" "}
						<strong>à</strong>, <strong>en</strong>, <strong>au</strong>, <strong>aux</strong>, or{" "}
						<strong>dans le</strong> depending on context.
					</p>
					<Separator className="my-3 bg-border-subtle" />
					<p>The chart below shows when each form is used:</p>
					<div className={`phrases-table-container container`}>
						<div className="space-y-2 sm:hidden">
							{locationFormRows.map((row, index) => (
								<Card className="border-border/70 bg-card/90 shadow-sm" key={`${row.form}-${index}`}>
									<CardContent className="space-y-2 p-3">
										<p className="m-0 text-sm font-semibold leading-[var(--line-height-app)]">
											<span className="text-muted-foreground">Form: </span>
											<span>{row.form}</span>
										</p>
										<p className="m-0 text-sm leading-[var(--line-height-body)]">
											<span className="font-semibold text-muted-foreground">Examples: </span>
											<span>{row.examples}</span>
										</p>
										<p className="m-0 text-sm leading-[var(--line-height-body)]">
											<span className="font-semibold text-muted-foreground">Use: </span>
											<span>{row.use}</span>
										</p>
									</CardContent>
								</Card>
							))}
						</div>

						<div className="hidden sm:block">
							<Table variant="learning">
								<colgroup>
									<col className="w-[8.5rem]" />
									<col />
									<col />
								</colgroup>
								<TableHeader>
									<TableRow>
										<TableHead className="whitespace-nowrap">Form</TableHead>
										<TableHead>Examples</TableHead>
										<TableHead>Use</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{locationFormRows.map((row, index) => (
										<TableRow key={`${row.form}-desktop-${index}`}>
											<TableCell className="whitespace-nowrap">{row.form}</TableCell>
											<TableCell>{row.examples}</TableCell>
											<TableCell>{row.use}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</div>
		);
	};
}

