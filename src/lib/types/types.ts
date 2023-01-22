import type { Color } from 'chessground/types';
import type { BoardConfig } from './BoardTypes';
import type { BoardApi } from '$lib/classes/BoardApi';
import type { Square } from 'chess.js';

export type DrawType = 'Insufficient Material' | 'Threefold repetition' | 'Fifty-Move Rule';

export interface BoardEvents {
	boardCreated: BoardApi;
	check: Color;
	checkmate: Color;
	stalemate: Color;
	draw: DrawType;
}

export interface BoardState {
	boardConfig: BoardConfig;
	showThreats: boolean;
	activeGame: boolean;
	openPromotionDialog: boolean;
}

export interface Threat {
	orig: Square;
	dest?: Square;
	brush: string;
}

export interface MaterialDifference {
	materialWhite: number;
	materialBlack: number;
	materialDiff: number;
}

export type BrushColor =
	| 'red'
	| 'green'
	| 'blue'
	| 'paleBlue'
	| 'yellow'
	| 'paleGreen'
	| 'paleRed'
	| 'paleGrey';

export interface LichessOpening {
	white: number;
	black: number;
	draws: number;
	moves: [
		{
			uci: string;
			san: string;
			averageRating: number;
			white: number;
			game: null;
			black: number;
			draws: number;
		}
	];
	opening: {
		eco: string;
		name: string;
	} | null;
	topGames: [
		{
			id: string;
			uci: string;
			month: string;
			year: number;
			winner: 'white' | 'black' | null;
			white: {
				name: string;
				rating: number;
			};
			black: {
				name: string;
				rating: number;
			};
		}
	];
}
