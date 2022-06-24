<script>
	// @ts-nocheck

	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let todos = [];
	let value = '';

	onMount(async () => {
		await fetchPosts();
	});

	async function fetchPosts() {
		const { data, error } = await supabase.from('todos').select('*').order('id');
		if (error) {
			console.error(error);
			return;
		}
		todos = data;
	}

	async function handleSubmit(event) {
		const {
			data: [newPost],
			error
		} = await supabase.from('todos').insert([{ content: value }]);
		if (error) {
			console.error(error);
			return;
		}
		todos = [...todos, newPost];
		event.target.reset();
	}

	let editing = null;
	let editingValue = '';
	let editingInput = null;

	$: if (editing) setEditing(editing);
	$: editingInput ? editingInput.focus() : null;

	function setEditing(editing) {
		editingValue = editing.content;
	}

	async function handleEditSubmit(event) {
		const { data, error } = await supabase
			.from('todos')
			.update({ content: editingValue })
			.eq('id', editing.id);
		if (error) {
			console.error(error);
		} else {
			console.log('New post:', data);
		}
		fetchPosts();
		event.target.reset();
		editing = null;
	}

	async function deletePost({ id }) {
		const { data, error } = await supabase.from('todos').delete().eq('id', id);
		if (data) {
			todos = todos.filter((e) => e.id !== id);
		} else {
			console.error(error);
		}
	}
</script>

{#if editing}
	<div on:click|self={() => (editing = null)} class="modal modal-open">
		<div class="modal-box">
			<form on:submit|preventDefault={handleEditSubmit} class="flex flex-col gap-4">
				<label for="edit"> Editing Post </label>
				<input
					bind:this={editingInput}
					id="edit"
					type="text"
					class="input input-bordered"
					bind:value={editingValue}
					required
				/>
				<button type="submit" class="btn btn-success btn-xs">Confirm</button>
			</form>
		</div>
	</div>
{/if}

<h1 class="mx-auto w-fit py-4 text-3xl font-black">Svelte-Kit + Supabase CRUD</h1>
<ul class="mx-auto flex max-w-xl flex-col gap-2 p-4">
	{#each todos as todo}
		<li class="rounded-box flex items-center justify-between gap-4 bg-base-200 px-6 py-2">
			<p class="break-all">{todo.content}</p>
			<div class="flex">
				<button class="btn btn-xs" on:click={() => (editing = todo)}> Edit </button>
				<button class="btn btn-error btn-xs" on:click={() => deletePost(todo)}>Delete</button>
			</div>
		</li>
	{/each}
</ul>
<form class="mx-auto w-fit" on:submit|preventDefault={handleSubmit}>
	<input class="input input-bordered" type="text" bind:value required />
	<button class="btn" type="submit">Add</button>
</form>
