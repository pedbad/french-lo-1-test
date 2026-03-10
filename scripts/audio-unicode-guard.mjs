#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const args = process.argv.slice(2);
const mode = args.includes("--fix") ? "fix" : "check";

let scope = "all";
let againstRef = "";
for (let i = 0; i < args.length; i += 1) {
	if (args[i] === "--staged") {
		scope = "staged";
	}
	if (args[i] === "--working") {
		scope = "working";
	}
	if (args[i] === "--against") {
		scope = "against";
		againstRef = args[i + 1] || "";
		i += 1;
	}
}

if (scope === "against" && !againstRef) {
	console.error("Error: --against requires a git ref");
	process.exit(2);
}

const rootDir = process.cwd();
const srcRoot = path.join(rootDir, "src");

const isTrackedAudioPath = (relPath) =>
	relPath.endsWith(".mp3") &&
	(relPath.startsWith("public/sounds/fr/") || relPath.startsWith("public/audio/"));

const toPosix = (input) => input.split(path.sep).join("/");
const getRelativePosix = (absPath) => toPosix(path.relative(rootDir, absPath));

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

const runGit = (cmd) => {
	try {
		return execSync(cmd, { cwd: rootDir, encoding: "utf8" }).trim();
	} catch {
		return "";
	}
};

const getChangedFiles = () => {
	let output = "";
	if (scope === "staged") {
		output = runGit("git diff --cached --name-only --diff-filter=ARCM");
	} else if (scope === "working") {
		output = runGit("git diff --name-only --diff-filter=ARCM");
	} else if (scope === "against") {
		output = runGit(`git diff ${againstRef}...HEAD --name-only --diff-filter=ARCM`);
	}
	if (!output) return [];
	return output
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => toPosix(line));
};

const getAudioTargets = () => {
	if (mode === "fix" || scope === "all") {
		const targets = [];
		const roots = [
			path.join(rootDir, "public", "sounds", "fr"),
			path.join(rootDir, "public", "audio"),
		];
		for (const audioRoot of roots) {
			if (!fs.existsSync(audioRoot)) continue;
			const entries = walkEntries(audioRoot);
			for (const absPath of entries) {
				if (fs.existsSync(absPath) && fs.statSync(absPath).isFile() && absPath.endsWith(".mp3")) {
					targets.push(absPath);
				}
			}
		}
		return targets;
	}

	const changed = getChangedFiles().filter(isTrackedAudioPath);
	return changed
		.map((relPath) => path.join(rootDir, relPath))
		.filter((absPath) => fs.existsSync(absPath));
};

const renames = [];
const collectAudioRenameCandidates = () => {
	const entries = getAudioTargets().sort((a, b) => b.length - a.length);
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

const getSourceTargets = () => {
	if (scope === "all" || mode === "fix") {
		return fs.existsSync(srcRoot) ? walkSourceFiles(srcRoot) : [];
	}
	const changed = getChangedFiles();
	return changed
		.filter((relPath) => relPath.startsWith("src/") && exts.has(path.extname(relPath)))
		.map((relPath) => path.join(rootDir, relPath))
		.filter((absPath) => fs.existsSync(absPath));
};

const collectReferenceIssues = () => {
	const files = getSourceTargets();
	const refPattern = /(?:sounds\/fr|audio)\/[^"'`<>\n]+?\.mp3/g;
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
