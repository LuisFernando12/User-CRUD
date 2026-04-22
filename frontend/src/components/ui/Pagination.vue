<script lang="ts" setup>
import { ArrowBigLeftIcon, ArrowBigRightIcon } from "@lucide/vue";
const emit = defineEmits<{
  (e: "on-prev"): void;
  (e: "on-next"): void;
}>();
const props = defineProps<{
  totalPages: number;
  currentPage: number;
}>();
const prev = () => {
  emit("on-prev");
};
const next = () => {
  emit("on-next");
};
</script>
<template>
  <div
    class="w-full h-8 rounded-b-2xl bg-light-table-secondary shadow-xl flex items-center gap-2 overflow-hidden"
  >
    <div v-if="totalPages > 0" class="w-[56%] text-end">
      <span
        class="text-sm font-medium bg-light-table-primary px-3 py-1 rounded-2xl"
      >
        Total Pages:
        <span
          class="text-xs font-extrabold rounded-full bg-light-table-secondary px-3 py-0.5"
        >
          {{ totalPages }}
        </span>
      </span>
    </div>
    <div class="w-[42%] h-auto flex gap-2 items-center justify-end">
      <ArrowBigLeftIcon @click="prev" color="#9da9b3" class="cursor-pointer" />
      <div>{{ currentPage }}</div>
      <ArrowBigRightIcon @click="next" color="#9da9b3" class="cursor-pointer" />
    </div>
  </div>
</template>
