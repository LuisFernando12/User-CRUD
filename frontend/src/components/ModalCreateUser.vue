<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { toast } from "vue3-toastify";
import type { CreateUserDTO, UserType } from "../service/user.service";
import Button from "./ui/Button.vue";
import { useTextField } from "./ui/composable/useTextField";
import TextField from "./ui/TextField.vue";
import { ValidCPF } from "./ui/utils/valid-cpf";
import { ValidEmail } from "./ui/utils/valid-email";
const emailInputRef = ref<HTMLInputElement>();
const cpfInputRef = ref<HTMLInputElement>();
const textFieldComposable = useTextField();
const emit = defineEmits<{
  (e: "onSave", user: CreateUserDTO & { _id?: string }): void;
}>();
const { show, onCancel, user } = defineProps<{
  show: boolean;
  onCancel: () => void;
  user?: UserType | null;
  mode: "create" | "update";
}>();
const userRef = ref<CreateUserDTO & { _id?: string }>(
  user || {
    name: "",
    email: "",
    cpf: "",
    birthDate: "",
    phone: "",
  },
);

const onSaveUser = (userSave: CreateUserDTO & { _id?: string }) => {
  if (!ValidEmail(userSave.email)) {
    toast.warn("Invalid email!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    textFieldComposable.setTextFieldError(emailInputRef.value!);
    return;
  }
  if (!ValidCPF(userSave.cpf)) {
    toast.warn("Invalid CPF, Please check your CPF and try again!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    textFieldComposable.setTextFieldError(cpfInputRef.value!);
    return;
  }
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
const disabledButton = computed(() => {
  return Object.values(userRef.value).some(
    (value) => String(value).trim() === "",
  );
});
</script>
<template>
  <div
    class="w-full h-full bg-black/70 flex justify-center py-3 gap-3 absolute top-0 left-0"
    v-if="show"
  >
    <div class="w-2/5 h-3/5 flex flex-col gap-4 bg-white rounded-2xl">
      <div
        class="w-full h-10 bg-blue-500 rounded-t-2xl text-center text-white py-1"
      >
        <p class="font-bold text-xl self-center bg-blue">
          {{ mode === "create" ? "Create User" : "Update User" }}
        </p>
      </div>
      <div class="w-full flex flex-col p-6 gap-5">
        <TextField
          type="text"
          name="name"
          placeholder="Name"
          :value="userRef.name"
          @update:value="(value) => (userRef.name = value)"
        />
        <TextField
          type="text"
          name="cpf"
          placeholder="CPF"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :value="userRef.cpf"
          @update:value="(value) => (userRef.cpf = value)"
          mask="xxx.xxx.xxx-xx"
          @load:value="(value) => (cpfInputRef = value)"
        />
        <TextField
          type="date"
          name="birthDate"
          placeholder="Birth Date"
          :value="userRef.birthDate"
          @update:value="(value) => (userRef.birthDate = value)"
        />
        <TextField
          type="email"
          name="email"
          placeholder="Email"
          :value="userRef.email"
          @update:value="(value) => (userRef.email = value)"
          @load:value="(value) => (emailInputRef = value)"
        />
        <TextField
          type="text"
          name="phone"
          placeholder="Phone"
          :value="userRef.phone"
          @update:value="(value) => (userRef.phone = value)"
          mask="(xx) xxxxx-xxxx"
        />
        <div class="self-end flex gap-2 mt-10">
          <Button text="Cancel" @click="onCancel()" variant="secondary" />
          <Button
            :text="mode === 'update' ? 'Update' : 'Create'"
            @click="onSaveUser(userRef)"
            :disabled="disabledButton"
          />
        </div>
      </div>
    </div>
  </div>
</template>
