import type { Threat } from '$lib/types/types';
import type { Chess, Move } from 'chess.js';
import type { Color, Key } from 'chessground/types';

export function possibleMoves(game: Chess) {
	const allMoves = game.moves({ verbose: true });
	const dests = new Map<Key, Key[]>();

	allMoves.map((move) => {
		if (!dests.has(move.from)) {
			dests.set(move.from, []);
		}
		dests.get(move.from)?.push(move.to);
	});

	return dests;
}

export function formatTurnColor(color: 'w' | 'b'): Color {
	return color === 'w' ? 'white' : 'black';
}

export function getThreats(moves: Move[]) {
	return moves.map((move) => {
		const threat: Threat = { orig: move.to, brush: 'yellow' };
		if (move['captured']) {
			threat.dest = move.to;
			threat.brush = 'red';
		}
		if (move['san'].includes('+')) {
			threat.dest = move.to;
			threat.brush = 'blue';
		}
		return threat;
	});
}
