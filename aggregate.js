import { $ } from 'bun';

const files = { A: 0, M: 0, D: 0 };
for await (const line of $`git diff --name-status HEAD~1 HEAD`.lines()) {
	const [ status ] = line.split(/\s+/);

	if (status in files) {
		files[status]++;
	}
}

const LINES = await $`git diff --shortstat HEAD~1 HEAD`.text();
const [ , lines_added = 0 ] = LINES.match(/(?:^|\s)(\d+)\s+insertions/) ?? [];
const [ , lines_deleted = 0 ] = LINES.match(/(?:^|\s)(\d+)\s+deletions/) ?? [];

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
