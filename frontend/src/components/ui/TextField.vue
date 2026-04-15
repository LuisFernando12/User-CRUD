<script setup lang="ts">
defineProps<{
  type: HTMLInputElement["type"];
  placeholder: string;
  value?: string;
}>();
const emit = defineEmits<{
  (e: "update:value", value: string): void;
}>();
</script>
<template>
  <input
    :type="type"
    :placeholder="placeholder"
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    :value="value"
    @change="
      (event: Event) =>
        $emit('update:value', (event.target as HTMLInputElement).value)
    "
  />
</template>
