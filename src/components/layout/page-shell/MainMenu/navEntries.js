export const getMainMenuNavEntries = (config) => {
	if (!config) return [];

	return [
		{
			href: "#introduction",
			id: "introduction",
			label: "Introduction",
		},
		...Object.values(config)
			.filter((value) => value.component && value.id)
			.map((value) => {
				const label = value.menuText ? value.menuText : value.titleText;
				return {
					href: `#${value.id}`,
					id: value.id,
					label,
				};
			})
			.filter((item) => typeof item.label === "string" && item.label.trim().length > 0),
	];
};
