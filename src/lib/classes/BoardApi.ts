import { formatTurnColor, getThreats, possibleMoves } from '$lib/helper/Board';
import type { BoardState } from '$lib/types/types';
import type { Chess } from 'chess.js';
import type { Api } from 'chessground/api';

export class BoardApi {
	private game: Chess;
	private board: Api;
	private boardState: BoardState;

	constructor(game: Chess, board: Api, boardState: BoardState) {
		this.game = game;
		this.board = board;
		this.boardState = boardState;
	}

	/**
	 * Resets the board to the initial starting position.
	 */
	resetBoard(): void {
		this.game.reset();
		this.board.set(this.boardState.boardConfig);
		this.board.state.movable.dests = possibleMoves(this.game);
		this.board.state.check = undefined;
		this.board.selectSquare(null);

		if (this.boardState.showThreats) {
			this.board.setShapes(getThreats(this.game.moves({ verbose: true })));
		}
	}

	/**
	 * undo last move, if possible
	 */
	undoLastMove(): void {
		const undoMove = this.game.undo();
		if (undoMove == null) return;
		const lastMove = this.game.history({ verbose: true }).at(-1);

		this.board.set({ fen: this.game.fen() });
		this.board.state.turnColor = formatTurnColor(this.game.turn());

		this.board.state.movable.color = this.board.state.turnColor;
		this.board.state.movable.dests = possibleMoves(this.game);
		this.board.state.check = undefined;

		if (this.game.history().length === 0 || typeof lastMove === 'undefined') {
			this.board.state.lastMove = undefined;
		} else {
			this.board.state.lastMove = [lastMove?.from, lastMove?.to];
		}

		if (this.boardState.showThreats) {
			// redraw threats in new position if enabled
			this.board.setShapes(getThreats(this.game.moves({ verbose: true })));
		}
	}
}
