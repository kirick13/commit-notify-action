const { repo_name, files, lines } = JSON.parse(process.env.DATA);

const text_lines = [
	`👨‍💻 New commit to *${repo_name}*:`,
];

if (files.A > 0) {
	text_lines.push(`\u00a0→\u00a0\u00a0*${files.A}* new file${files.A === 1 ? '' : 's'} created`);
}
if (files.M > 0) {
	text_lines.push(`\u00a0→\u00a0\u00a0*${files.M}* file${files.M === 1 ? '' : 's'} modified`);
}
if (files.D > 0) {
	text_lines.push(`\u00a0→\u00a0\u00a0*${files.D}* file${files.D === 1 ? '' : 's'} deleted`);
}

text_lines.push(
	`\u00a0*\uFF0B*\u00a0\u00a0*${lines.added}* line${lines.added === 1 ? '' : 's'} of code added`,
	`\u00a0*\uFF0D*\u00a0\u00a0*${lines.deleted}* line${lines.deleted === 1 ? '' : 's'} of code deleted`,
);

if (process.env.SIGNATURE) {
	text_lines.push(`>${process.env.SIGNATURE}`);
}

console.log(text_lines.join('\n'));
console.log();

const response = await fetch(
	`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chat_id: process.env.TELEGRAM_CHAT_ID,
			text: text_lines.join('\n'),
			parse_mode: 'markdown',
		}),
	},
);

console.log(
	[ ...response.headers.entries() ]
		.map(([ k, v ]) => k + ': ' + v)
		.join('\n'),
);
console.log();
console.log(
	await response.text(),
);
