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
