<script setup lang="ts">
import TextButton from "./TextButton.vue";
const emit = defineEmits<{
  (e: "onCancel"): void;
  (e: "onConfirm"): void;
}>();
defineProps<{
  description: string;
  show: boolean;
  class?: string;
}>();
</script>
<template>
  <div
    class="absolute w-full h-full flex top-0 left-0 justify-center items-center"
    v-if="show"
  >
    <div
      class="min-w-1/5 w-auto max-w-2/5 min-h-1/5 h-auto max-h-1/3 shadow-xl bg-white rounded-2xl flex flex-col gap-8 justify-center"
    >
      <div
        class="h-8 -mt-8 rounded-t-2xl w-full bg-blue-500 text-white flex justify-center items-center"
      >
        User Delete
      </div>
      <div class="px-6 flex flex-col gap-8">
        <p class="text-base w-full text-justfy flex items-center font-bold">
          {{ description }}
        </p>
        <div class="flex justify-end items-end self-end w-full gap-2">
          <text-button
            text="Cancel"
            class="text-gray-500 hover:text-gray-800"
            @click="() => $emit('onCancel')"
          />
          <text-button
            text="Confirm"
            class="text-blue-500 hover:text-blue-800"
            @click="$emit('onConfirm')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
