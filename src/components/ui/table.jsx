import * as React from "react";

import { cn } from "@/lib/utils";

const TABLE_VARIANTS = {
	default: {
		caption: "mt-4 text-sm text-muted-foreground",
		cell: "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
		head: "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
		row: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
		table: "w-full caption-bottom text-sm",
		wrapper: "relative w-full overflow-auto",
	},
	learning: {
		caption: "mt-4 text-sm text-muted-foreground",
		cell: "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
		head: "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
		row: "border-b bg-card transition-colors hover:bg-[color-mix(in_oklab,var(--muted)_70%,transparent)] hover:text-[var(--chart-2)] data-[state=selected]:bg-muted",
		table: "mt-4 w-full caption-bottom text-sm",
		wrapper: "relative w-full overflow-auto",
	},
};

const resolveTableVariant = (variant) =>
	Object.prototype.hasOwnProperty.call(TABLE_VARIANTS, variant) ? variant : "default";

const TableVariantContext = React.createContext("default");

const Table = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
	const resolvedVariant = resolveTableVariant(variant);
	const classes = TABLE_VARIANTS[resolvedVariant];
	return (
		<TableVariantContext.Provider value={resolvedVariant}>
			<div className={classes.wrapper}>
				<table
					ref={ref}
					className={cn(classes.table, className)}
					{...props} />
			</div>
		</TableVariantContext.Provider>
	);
});
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
	<thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn("[&_tr:last-child]:border-0", className)}
		{...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
		{...props} />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ className, ...props }, ref) => {
	const variant = React.useContext(TableVariantContext);
	const classes = TABLE_VARIANTS[resolveTableVariant(variant)];
	return (
		<tr
			ref={ref}
			className={cn(classes.row, className)}
			{...props} />
	);
});
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => {
	const variant = React.useContext(TableVariantContext);
	const classes = TABLE_VARIANTS[resolveTableVariant(variant)];
	return (
		<th
			ref={ref}
			className={cn(classes.head, className)}
			{...props} />
	);
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => {
	const variant = React.useContext(TableVariantContext);
	const classes = TABLE_VARIANTS[resolveTableVariant(variant)];
	return (
		<td
			ref={ref}
			className={cn(classes.cell, className)}
			{...props} />
	);
});
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }, ref) => {
	const variant = React.useContext(TableVariantContext);
	const classes = TABLE_VARIANTS[resolveTableVariant(variant)];
	return (
		<caption
			ref={ref}
			className={cn(classes.caption, className)}
			{...props} />
	);
});
TableCaption.displayName = "TableCaption";

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
};
