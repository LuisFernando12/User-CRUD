<script setup lang="ts">
const StyleTextButton = {
  primary: "text-blue-500 hover:text-blue-600",
  danger: "text-red-500 hover:text-red-600",
  secondary: "text-gray-500 hover:text-gray-800",
} as const;
const props = defineProps<{
  text: string;
  variant?: keyof typeof StyleTextButton;
}>();
</script>

<template>
  <button
    :class="
      StyleTextButton[variant || 'primary'] +
      ' focus:outline-none cursor-pointer px-1 py-1 rounded-lg hover:bg-zinc-100'
    "
  >
    {{ text }}
  </button>
</template>
