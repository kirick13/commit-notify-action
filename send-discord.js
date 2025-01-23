const {
	'INPUT_DISCORD-WEBHOOK': webhook,
	'DATA': input,
	'INPUT_ICON': icon_url,
	'INPUT_REPO-DESCRIPTION': repo_description,
	'INPUT_SIGNATURE': signature,
} = process.env;

const { repo_name, files, lines } = JSON.parse(input);

function format(value, color, type, symbol) {
	return (
		'\u0060\u0060\u0060'
		+ (value > 0 ? 'ansi\n\u001b[0;0m\u001b[1;' + color + 'm' : '\n')
		+ (symbol ? symbol + ' ' : '')
		+ value
		+ ' '
		+ type
		+ (value === 1 ? '' : 's')
		+ (symbol ? '' : '\u00a0\u00a0\u00a0')
		+ '\u0060\u0060\u0060'
	);
}

const embed = {
	color: 0x0099ff,
	title: "👨‍💻 New commit has arrived!",
	author: {
		name: repo_name,
		icon_url,
	},
	fields: [
		{
			name: "Created",
			value: format(
				files.A,
				32,
				'file',
			),
			inline: true,
		},
		{
			name: "Modified",
			value: format(
				files.M,
				34,
				'file',
			),
			inline: true,
		},
		{
			name: "Deleted",
			value: format(
				files.D,
				31,
				'file',
			),
			inline: true,
		},
		{
			name: "Code added",
			value: format(
				lines.added,
				32,
				'line',
				'+',
			),
			inline: true,
		},
		{
			name: "Code deleted",
			value: format(
				lines.deleted,
				31,
				'line',
				'\u2013',
			),
			inline: true,
		},
	],
	timestamp: new Date().toISOString(),
};

if (typeof repo_description === 'string') {
	embed.description = repo_description;
}

if (typeof signature === 'string') {
	embed.footer = {
		text: signature,
	};
}

const body = {
	embeds: [
		embed,
	],
};

console.log(JSON.stringify(body, null, 4));
console.log();

const response = await fetch(
	webhook,
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
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
