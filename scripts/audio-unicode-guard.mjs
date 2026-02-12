#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const mode = process.argv.includes("--fix") ? "fix" : "check";
const rootDir = process.cwd();
const audioRoot = path.join(rootDir, "public", "sounds", "fr");
const srcRoot = path.join(rootDir, "src");

const renames = [];

const walkEntries = (dir, out = []) => {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const absPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walkEntries(absPath, out);
		}
		out.push(absPath);
	}
	return out;
};

const getRelativePosix = (absPath) => path.relative(rootDir, absPath).split(path.sep).join("/");

const collectAudioRenameCandidates = () => {
	if (!fs.existsSync(audioRoot)) return;
	const entries = walkEntries(audioRoot).sort((a, b) => b.length - a.length);
	for (const oldAbsPath of entries) {
		const oldName = path.basename(oldAbsPath);
		const newName = oldName.normalize("NFC");
		if (oldName === newName) continue;
		const parentDir = path.dirname(oldAbsPath);
		const newAbsPath = path.join(parentDir, newName);
		renames.push({ oldAbsPath, newAbsPath });
	}
};

const applyRename = ({ oldAbsPath, newAbsPath }) => {
	if (oldAbsPath === newAbsPath) return;
	if (fs.existsSync(newAbsPath)) {
		throw new Error(`Cannot rename due to collision: ${getRelativePosix(oldAbsPath)} -> ${getRelativePosix(newAbsPath)}`);
	}
	fs.renameSync(oldAbsPath, newAbsPath);
};

const exts = new Set([".json", ".js", ".jsx", ".ts", ".tsx"]);
const referenceIssues = [];

const walkSourceFiles = (dir, out = []) => {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const absPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walkSourceFiles(absPath, out);
		} else if (exts.has(path.extname(entry.name))) {
			out.push(absPath);
		}
	}
	return out;
};

const collectReferenceIssues = () => {
	if (!fs.existsSync(srcRoot)) return;
	const files = walkSourceFiles(srcRoot);
	const refPattern = /sounds\/fr\/[^"'`<>\n]+?\.mp3/g;
	for (const filePath of files) {
		const content = fs.readFileSync(filePath, "utf8");
		let match;
		while ((match = refPattern.exec(content)) !== null) {
			const ref = match[0];
			if (ref !== ref.normalize("NFC")) {
				referenceIssues.push({
					filePath: getRelativePosix(filePath),
					ref,
				});
			}
		}
	}
};

collectAudioRenameCandidates();
collectReferenceIssues();

if (mode === "fix") {
	for (const rename of renames) applyRename(rename);
}

if (renames.length > 0) {
	const action = mode === "fix" ? "Renamed" : "Needs rename";
	for (const { oldAbsPath, newAbsPath } of renames) {
		console.log(`${action}: ${getRelativePosix(oldAbsPath)} -> ${getRelativePosix(newAbsPath)}`);
	}
} else {
	console.log("Audio filename normalization: no disk renames needed.");
}

if (referenceIssues.length > 0) {
	for (const issue of referenceIssues) {
		console.log(`Non-NFC audio reference: ${issue.filePath} :: ${issue.ref}`);
	}
}

if (renames.length > 0 || referenceIssues.length > 0) {
	process.exitCode = 1;
} else {
	console.log("Audio filename normalization: all checks passed.");
}
