<script setup lang="ts">
import { computed } from "vue";
import { HandleMask } from "./utils/mask";

const { type, placeholder, value, mask } = defineProps<{
  type: HTMLInputElement["type"];
  placeholder: string;
  value?: string;
  mask?: string;
  maxLength?: number;
}>();

const emit = defineEmits<{
  (e: "update:value", value: string): void;
}>();
const displayValue = computed(() => {
  if (!mask || value === "") return value || "";
  return HandleMask(value || "", mask);
});
const inputEvent = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (
    target.classList.contains("focus:ring-red-500") &&
    !target.classList.contains("focus:ring-blue-500")
  ) {
    target.classList.remove("focus:ring-red-500");
    target.classList.add("focus:ring-blue-500");
  }

  let value = target.value;
  if (mask) {
    value = value.replace(/\D/g, "");
  }
  emit("update:value", value);
  return;
};
</script>
<template>
  <input
    :type="type"
    :placeholder="placeholder"
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    :value="displayValue"
    @input="inputEvent"
    :maxLength="maxLength || (mask && mask.length) || ''"
  />
</template>
