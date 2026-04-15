<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import type { CreateUserDTO, IUser } from "../service/user.service";
import Button from "./ui/Button.vue";
import TextField from "./ui/TextField.vue";

const emit = defineEmits<{
  (e: "onSave", user: CreateUserDTO & { id?: number }): void;
}>();
const { show, onCancel, user } = defineProps<{
  show: boolean;
  onCancel: () => void;
  user?: IUser;
}>();
const userRef = ref<CreateUserDTO & { id?: number }>(
  user || {
    name: "",
    email: "",
    cpf: "",
    birthDate: "",
    phone: "",
  },
);
const onSaveUser = (userSave: CreateUserDTO & { id?: number }) => {
  emit("onSave", userSave);
};
onUnmounted(() => {
  userRef.value = {
    name: "",
    email: "",
    cpf: "",
    birthDate: "",
    phone: "",
  };
});
</script>
<template>
  <div
    class="w-full h-full bg-black/70 flex justify-center py-3 gap-3 absolute top-0 left-0"
    v-if="show"
  >
    <div class="w-2/5 h-3/5 flex flex-col gap-4 bg-white rounded-2xl p-6">
      <p class="font-bold text-xl self-center">Create User</p>
      <TextField
        type="text"
        placeholder="Name"
        :value="userRef.name"
        @update:value="(value) => (userRef.name = value)"
      />
      <TextField
        type="text"
        placeholder="CPF"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        :value="userRef.cpf"
      />
      <TextField
        type="date"
        placeholder="Birth Date"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        :value="userRef.birthDate"
      />
      <TextField
        type="email"
        placeholder="Email"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        :value="userRef.email"
      />
      <TextField type="text" placeholder="Phone" :value="userRef.phone" />
      <div class="self-end flex gap-2">
        <Button
          text="Cancel"
          class="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 self-end mt-4 ml-2"
          @click="onCancel()"
        />
        <Button
          :text="userRef.id ? 'Update' : 'Create'"
          class="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 self-end mt-4"
          @click="onSaveUser(userRef)"
        />
      </div>
    </div>
  </div>
</template>
