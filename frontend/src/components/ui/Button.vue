<script setup lang="ts">
const StyleButton = {
  outlined:
    "text-blue-500 border border-blue-500 px-3 py-2 rounded-lg font-medium self-end ml-4 cursor-pointer hover:border-blue-600 hover:text-blue-600",
  "outlined-danger":
    "text-red-500 border border-red-500 px-3 py-2 rounded-lg font-medium self-end ml-4 cursor-pointer hover:border-red-600 hover:text-red-600",
  default:
    "bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 font-medium self-end ml-4 cursor-pointer",
  danger:
    "bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 font-medium self-end ml-4 cursor-pointer",
  secondary:
    "bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 self-end mt-4 ml-2",
} as const;
const props = defineProps<{
  text: string;
  variant?: keyof typeof StyleButton;
}>();
const emit = defineEmits<{
  (e: "onClick"): void;
}>();
</script>
<template>
  <button :class="StyleButton[variant || 'default']" type="button">
    {{ text }}
  </button>
</template>
