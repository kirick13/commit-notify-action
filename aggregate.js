
import { appendFile } from 'node:fs/promises';

const files = { A: 0, M: 0, D: 0 };
for (const op of process.env.FILES.split(/\s/).filter(a => a.length > 0)) {
	try {
		files[op]++;
	}
	catch {}
}

const [ , lines_added = 0 ] = process.env.LINES.match(/\s+(\d+)\s+insertions/) ?? [];
const [ , lines_deleted = 0 ] = process.env.LINES.match(/\s+(\d+)\s+deletions/) ?? [];

await appendFile(
	process.env.GITHUB_OUTPUT,
	'value=' + JSON.stringify({
		repo_name: process.env.GITHUB_REPOSITORY,
		files,
		lines: {
			added: Number.parseInt(lines_added),
			deleted: Number.parseInt(lines_deleted),
		},
	}),
);
