<script setup lang="ts">
const props = defineProps<{
  text: string;
  class: string;
}>();
const { class: buttonClass } = props;
</script>

<template>
  <button
    :class="
      buttonClass +
      ' focus:outline-none cursor-pointer px-1 py-1 rounded-lg hover:bg-zinc-50'
    "
  >
    {{ text }}
  </button>
</template>
