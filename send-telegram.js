const {
	'INPUT_TELEGRAM-BOT-TOKEN': bot_token,
	'INPUT_TELEGRAM-CHAT-ID': chat_id,
	'DATA': input,
	'INPUT_SIGNATURE': signature,
} = process.env;

const { repo_name, files, lines } = JSON.parse(input);

const text_lines = [
	`👨‍💻 New commit to <b>${repo_name}</b>:`,
];

if (files.A > 0) {
	text_lines.push(`\u00a0→\u00a0\u00a0<b>${files.A}</b> new file${files.A === 1 ? '' : 's'} created`);
}
if (files.M > 0) {
	text_lines.push(`\u00a0→\u00a0\u00a0<b>${files.M}</b> file${files.M === 1 ? '' : 's'} modified`);
}
if (files.D > 0) {
	text_lines.push(`\u00a0→\u00a0\u00a0<b>${files.D}</b> file${files.D === 1 ? '' : 's'} deleted`);
}

text_lines.push(
	`\u00a0<b>\uFF0B</b>\u00a0\u00a0<b>${lines.added}</b> line${lines.added === 1 ? '' : 's'} of code added`,
	`\u00a0<b>\uFF0D</b>\u00a0\u00a0<b>${lines.deleted}</b> line${lines.deleted === 1 ? '' : 's'} of code deleted`,
);

if (typeof signature === 'string' && signature.length > 0) {
	text_lines.push('');
	text_lines.push(`<i>${signature}</i>`);
}

console.log(text_lines.join('\n'));
console.log();

const response = await fetch(
	`https://api.telegram.org/bot${bot_token}/sendMessage`,
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chat_id,
			text: text_lines.join('\n'),
			parse_mode: 'HTML',
		}),
	},
);

console.log(response.status, response.statusText);
console.log(
	[ ...response.headers.entries() ]
		.map(([ k, v ]) => k + ': ' + v)
		.join('\n'),
);
console.log();
console.log(
	await response.text(),
);
