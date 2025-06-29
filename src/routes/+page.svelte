<script lang="ts">
	import { onMount } from 'svelte';
	import NoteEditor from '$lib/components/NoteEditor.svelte';
	import NoteList from '$lib/components/NoteList.svelte';
	import { notesStore } from '$lib/stores/notesStore';

	let selectedNoteId: string | null = null;
	let searchQuery = '';

	onMount(() => {
		// Загружаем заметки из localStorage при запуске
		notesStore.loadFromStorage();
	});

	// После загрузки заметок, если ни одна не выбрана, выделяем первую заметку
	$: if ($notesStore.length > 0 && !selectedNoteId) {
		selectedNoteId = $notesStore[0].id;
	}

	function handleNoteSelect(noteId: string) {
		selectedNoteId = noteId;
	}

	function handleNoteCreate() {
		const newNote = notesStore.createNote();
		selectedNoteId = newNote.id;
	}

	function handleNoteDelete(noteId: string) {
		notesStore.deleteNote(noteId);
		if (selectedNoteId === noteId) {
			selectedNoteId = null;
		}
	}

	function handleNoteUpdate(noteId: string, content: string, title: string) {
		notesStore.updateNote(noteId, { content, title });
	}

	$: filteredNotes = $notesStore.filter(note =>
		note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		note.content.toLowerCase().includes(searchQuery.toLowerCase())
	);
</script>

<svelte:head>
	<title>Заметки</title>
	<meta name="description" content="Простое приложение для создания и управления заметками" />
</svelte:head>

<main class="app">
	<header class="header">
		<h1>📝 Заметки</h1>
		<div class="search-container">
			<input
				type="text"
				placeholder="Поиск заметок..."
				bind:value={searchQuery}
				class="search-input"
			/>
		</div>
	</header>

	<div class="container">
		<aside class="sidebar">
			<div class="sidebar-header">
				<button on:click={handleNoteCreate} class="create-btn">
					➕ Новая заметка
				</button>
			</div>
			<NoteList
				notes={filteredNotes}
				selectedNoteId={selectedNoteId}
				on:noteSelect={({ detail }) => handleNoteSelect(detail)}
				on:noteDelete={({ detail }) => handleNoteDelete(detail)}
			/>
		</aside>

		<main class="content">
			{#if selectedNoteId}
				{@const selectedNote = $notesStore.find(note => note.id === selectedNoteId!)}
				{#if selectedNote}
					{#key selectedNote.id}
						<NoteEditor
							note={selectedNote}
							on:update={({ detail }) => handleNoteUpdate(selectedNoteId!, detail.content, detail.title)}
						/>
					{/key}
				{/if}
			{:else}
				<div class="empty-state">
					<div class="empty-icon">📝</div>
					<h2>Добро пожаловать в приложение заметок!</h2>
					<p>Создайте свою первую заметку, нажав кнопку "Новая заметка"</p>
				</div>
			{/if}
		</main>
	</div>
</main>

<style>
	.app {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #181A20;
	}

	.header {
		background: #1F2128;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #23242b;
	}

	.header h1 {
		color: #fff;
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		letter-spacing: 0.01em;
	}

	.search-container {
		position: relative;
	}

	.search-input {
		background: #23242b;
		border: none;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		color: #e0e0e0;
		font-size: 0.95rem;
		width: 220px;
		transition: background 0.2s;
	}

	.search-input::placeholder {
		color: #555a6a;
	}

	.search-input:focus {
		outline: 2px solid #35384a;
		background: #23242b;
	}

	.container {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.sidebar {
		width: 270px;
		background: #191A1F;
		border-right: 1px solid #23242b;
		display: flex;
		flex-direction: column;
	}

	.sidebar-header {
		padding: 1rem;
		border-bottom: 1px solid #23242b;
	}

	.create-btn {
		width: 100%;
		background: #23242b;
		border: none;
		border-radius: 6px;
		padding: 0.7rem;
		color: #e0e0e0;
		font-size: 0.95rem;
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
		font-weight: 500;
		box-shadow: 0 1px 2px 0 rgba(0,0,0,0.04);
	}

	.create-btn:hover {
		background: #26272d;
		color: #fff;
	}

	.content {
		flex: 1;
		background: #181A20;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #888ca0;
		text-align: center;
		padding: 2rem;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		opacity: 0.7;
	}

	.empty-state h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.2rem;
		font-weight: 500;
		color: #e0e0e0;
	}

	.empty-state p {
		margin: 0;
		opacity: 0.7;
		font-size: 1rem;
	}

	@media (max-width: 768px) {
		.header {
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;
		}
		.search-input {
			width: 100%;
		}
		.container {
			flex-direction: column;
			height: 100%;
		}
		.sidebar {
			width: 100%;
			height: auto;
			min-height: 180px;
			border-right: none;
			border-bottom: 1px solid #23242b;
		}
		.content {
			flex: 1;
			min-height: 0;
			max-height: 100vh;
			overflow-y: auto;
			padding-bottom: 80px;
		}
	}

	@media (max-width: 480px) {
		.header {
			padding: 0.5rem;
		}
		.sidebar-header {
			padding: 0.5rem;
		}
		.create-btn {
			padding: 0.5rem;
			font-size: 1rem;
		}
		.empty-state {
			padding: 1rem;
		}
	}
</style>
