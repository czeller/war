<script>
export default {
	computed: {
		imgUrl: function() {
			if (!this.revealed) return '/cardback.png'; //todo: move this to a subfolder

			var value = this.value == '10' ? '0' : this.value;
			return 'https://deckofcardsapi.com/static/img/' + value + this.suit + '.png';
		}
	},
	props: {
		value: {
			required: true,
			type: String
		},
		suit: {
			required: true,
			type: String
		},
		revealed: {
			default: false
		}
	},
	watch: {},
	methods: {
	},
}
</script>

<template>
	<div class="card">
		<img v-bind:src="imgUrl" />
	</div>
</template>