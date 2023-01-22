<script lang="ts">
	import type BoardConfig from '$lib/types/BoardTypes';
	import '$lib/assets/board.css';
	import Chessboard from '$lib/components/Chessboard.svelte';
	import type { BoardApi } from '$lib/classes/BoardApi';

	let boardApi: BoardApi | null = null;
	const boardConfig: BoardConfig = {
		orientation: 'black',
		movable: {
			free: false
		}
	};
</script>

<button on:click={() => boardApi?.resetBoard()}>Reset Board</button>
<button on:click={() => boardApi?.undoLastMove()}>Undo Move</button>

<Chessboard
	on:boardCreated={(evt) => (boardApi = evt.detail)}
	on:checkmate={(evt) => console.log(evt.detail)}
	{boardConfig}
/>

<style>
	:global(html) {
		background-color: #222;
	}
</style>
