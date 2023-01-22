<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { Chess, type Chess as ChessLogic } from 'chess.js';
	import { Chessground } from 'chessground/chessground';
	import { BoardApi } from '$lib/classes/BoardApi';
	import { formatTurnColor, possibleMoves } from '$lib/helper/Board';
	import { defaultBoardConfig } from '$lib/constants/DefaultConfig';
	import type BoardConfig from '$lib/types/BoardTypes';
	import type { BoardEvents, BoardState, DrawType } from '$lib/types/types';
	import type { Api } from 'chessground/api';
	import type { Key } from 'chessground/types';

	export let boardConfig: BoardConfig | null = null;
	let boardElement: HTMLElement;
	let board: Api;
	let allowedToEmit = true;
	let game: ChessLogic;
	let boardState: BoardState = {
		showThreats: false,
		activeGame: true,
		boardConfig: {},
		openPromotionDialog: false
	};
	const dispatch = createEventDispatcher<BoardEvents>();

	function emit() {
		if (game.inCheck()) {
			dispatch('check', board.state.turnColor);
			const pieces = board.state.pieces;
			pieces.forEach((piece, key) => {
				if (piece.role === 'king' && piece.color === board?.state.turnColor) {
					board.state.check = key;
				}
			});
		}
		if (game.isCheckmate()) {
			dispatch('checkmate', board.state.turnColor);
		}
		if (game.isDraw()) {
			let drawType: DrawType;
			if (game.isThreefoldRepetition()) {
				drawType = 'Threefold repetition';
			} else if (game.isInsufficientMaterial()) {
				drawType = 'Insufficient Material';
			} else {
				drawType = 'Fifty-Move Rule';
			}
			dispatch('draw', drawType);
		}

		if (game.isStalemate()) {
			dispatch('stalemate', board.state.turnColor);
		}
	}

	function emitEvents() {
		// check for board events
		if (!allowedToEmit) {
			return;
		}

		emit();

		allowedToEmit = false;
		setTimeout(() => {
			allowedToEmit = true;
		}, 200);
	}

	function afterMove(): (orig: Key, dest: Key) => void {
		return (orig: Key, dest: Key) => {
			console.log('RUNNING');
			game.move({
				from: orig,
				to: dest,
				promotion: undefined
			});

			emit();

			board?.set({
				fen: game.fen(),
				turnColor: formatTurnColor(game.turn()),
				movable: {
					color: formatTurnColor(game.turn()),
					dests: possibleMoves(game)
				}
			});
		};
	}

	onMount(() => {
		game = new Chess();

		// merge board config
		if (boardConfig == null) {
			boardState.boardConfig = defaultBoardConfig;
		} else {
			boardState.boardConfig = { ...defaultBoardConfig, ...boardConfig };
		}

		board = Chessground(boardElement, boardState.boardConfig);
		board.set({
			events: {
				move: emitEvents
			},
			movable: { events: { after: afterMove() }, dests: possibleMoves(game) }
		});

		dispatch('boardCreated', new BoardApi(game, board, boardState));
	});
</script>

<section class="main-wrap">
	<div class="main-board">
		<div bind:this={boardElement} />
	</div>
</section>
