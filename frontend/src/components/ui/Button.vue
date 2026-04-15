<script setup lang="ts">
const props = defineProps<{
  text: string;
  class: string;
}>();
const { class: buttonClass } = props;
</script>
<template>
  <button :class="buttonClass + ' focus:outline-none cursor-pointer'">
    {{ text }}
  </button>
</template>
