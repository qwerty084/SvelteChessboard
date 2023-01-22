<script lang="ts">
	import type BoardConfig from '$lib/types/BoardTypes';
	import '$lib/assets/board.css';
	import Chessboard from '$lib/components/Chessboard.svelte';
	import type { BoardApi } from '$lib/classes/BoardApi';

	let boardApi: BoardApi | null = null;
	const boardConfig: BoardConfig = {
		movable: {
			free: false
		}
	};

	const moves = ['e4', 'e5', 'Qh5', 'Nc6', 'Bc4', 'Nf6', 'Qxf7#'];
</script>

<button on:click={() => boardApi?.resetBoard()}>Reset Board</button>
<button on:click={() => boardApi?.undoLastMove()}>Undo Move</button>
<button on:click={() => moves.forEach((move) => boardApi?.move(move))}>Move</button>
<button on:click={() => console.log(boardApi?.getMaterialCount())}>Material</button>
<button on:click={async () => console.log(await boardApi?.getOpeningName())}>Opening</button>

<Chessboard
	on:boardCreated={(evt) => (boardApi = evt.detail)}
	on:checkmate={(evt) => alert(evt.detail)}
	{boardConfig}
/>

<style>
	:global(html) {
		background-color: #222;
	}
</style>
