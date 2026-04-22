<script setup lang="ts">
import type { UserType } from "../service/user.service";
import Pagination from "./ui/Pagination.vue";
import Skeleton from "./ui/Skeleton.vue";
import TextButton from "./ui/TextButton.vue";
import { HandleMask } from "./ui/utils/mask";

defineProps<{
  users: UserType[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
}>();
defineEmits<{
  (e: "on-delete", value: { id: string }): void;
  (e: "on-edit", value: { id: string; user: UserType }): void;
  (e: "on-prev"): void;
  (e: "on-next"): void;
}>();
const convertDate = (date: string) => date.split("-").reverse().join("/");
</script>
<template>
  <div class="w-full h-full overflow-auto">
    <table class="w-full rounded-2xl shadow-xl">
      <thead class="w-full bg-gray-200 rounded-t-2xl">
        <tr class="w-full h-8 rounded-t-2xl">
          <th class="rounded-tl-2xl border-r border-gray-300 text-center">
            Name
          </th>
          <th class="border-r border-gray-300">CPF</th>
          <th class="border-r border-gray-300">Birth Date</th>
          <th class="border-r border-gray-300">Email</th>
          <th class="border-r border-gray-300">Phone</th>
          <th class="rounded-tr-2xl">Actions</th>
        </tr>
      </thead>
      <tbody class="rounded-b-2xl min-h-8 h-auto">
        <tr v-if="(users && users.length === 0) || loading" class="h-8">
          <th
            v-for="index in 6"
            :key="index"
            :class="{
              'border-r border-gray-300 px-2': true,
              'border-none': index === 6,
            }"
          >
            <Skeleton></Skeleton>
          </th>
        </tr>
        <tr
          v-else
          v-for="(user, index) in users"
          :key="user._id"
          :class="{
            'bg-light-table-secondary': index % 2 === 0,
            'bg-light-table-primary': index % 2 !== 0,
            'w-full h-8 border-b border-t border-gray-200': true,
          }"
        >
          <td class="border-r border-gray-200 text-center">{{ user.name }}</td>
          <td class="border-r border-gray-200 text-center">
            {{ HandleMask(user.cpf, "xxx.xxx.xxx-xx") }}
          </td>
          <td class="border-r border-gray-200 text-center">
            {{ convertDate(user.birthDate) }}
          </td>
          <td class="border-r border-gray-200 text-center">{{ user.email }}</td>
          <td class="border-r border-gray-200 text-center">
            {{ HandleMask(user.phone, "(xx) xxxxx-xxxx") }}
          </td>
          <td class="text-center">
            <text-button
              text="Edit"
              variant="primary"
              @click="$emit('on-edit', { id: user._id, user })"
            />
            <span class="text-gray-300 font-light">|</span>
            <text-button
              text="Delete"
              variant="danger"
              @click="$emit('on-delete', { id: user._id })"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :total-pages="totalPages"
      :current-page="currentPage"
      @on-next="() => $emit('on-next')"
      @on-prev="() => $emit('on-prev')"
    />
  </div>
</template>
<style scoped></style>
