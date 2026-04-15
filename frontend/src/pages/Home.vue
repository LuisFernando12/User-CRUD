<script setup lang="ts">
import { computed, ref } from "vue";
import { toast } from "vue3-toastify";
import ModalCreateUser from "../components/ModalCreateUser.vue";
import Table from "../components/Table.vue";
import Button from "../components/ui/Button.vue";
import type { CreateUserDTO } from "../service/user.service";
import { useUserStore } from "../store/user.store";
const showCreateUserModal = ref(false);
const userStore = useUserStore();
const users = computed(() => userStore.usersData);
const onCreate = async (user: CreateUserDTO) => {
  const userCreated = await userStore.onCreateUser(user);
  if (userCreated) {
    toast.success("User created successfully !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } else {
    toast.error("Error creating user !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  showCreateUserModal.value = false;
};
</script>
<template>
  <div class="flex flex-col items-center h-screen w-screen gap-6">
    <p
      class="font-bold text-zinc-600 text-2xl w-full text-center bg-blue-300 h-14 rounded-b-2xl py-3"
    >
      User CRUD application.
    </p>
    <div
      class="w-2/3 h-2/4 bg-white rounded-2xl flex flex-col items-center py-3"
    >
      <div class="flex flex-col w-full py-3">
        <Button
          text="Create User"
          class="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 font-medium self-end ml-4"
          @click="showCreateUserModal = true"
        />
      </div>
      <Table :users="users || []"></Table>
    </div>
    <ModalCreateUser
      :show="showCreateUserModal"
      @onSave="onCreate"
      :onCancel="
        () => {
          showCreateUserModal = false;
        }
      "
    />
  </div>
</template>
