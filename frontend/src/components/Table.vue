<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue3-toastify";
import type { IUser } from "../service/user.service";
import { useUserStore } from "../store/user.store";
import ModalCreateUser from "./ModalCreateUser.vue";
import ConfirmDialog from "./ui/ConfirmDialog.vue";
import TextButton from "./ui/TextButton.vue";
const userStore = useUserStore();
defineProps<{
  users: IUser[];
}>();
const showModalCreateUser = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const userRef = ref<IUser>();
const onEdit = (user: IUser) => {
  showModalCreateUser.value = true;
  userRef.value = { ...user };
};
const onUpdate = async (user: Partial<IUser>) => {
  const { id, ...rest } = user;
  if (id) {
    const userUpdated = await userStore.onUpdateUser(id, rest);
    if (!userUpdated) {
      toast.error("Error updating user !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    toast.success("User updated successfully !", {
      position: toast.POSITION.TOP_RIGHT,
    });
    showModalCreateUser.value = false;
    return;
  }
  toast.error("User not found !", {
    position: toast.POSITION.TOP_RIGHT,
  });
};
const onDelete = (id: number) => {
  showConfirmDialog.value = true;
};
const convertDate = (date: string) => date.split("-").reverse().join("/");
</script>
<template>
  <div class="w-full h-full overflow-auto">
    <table class="w-full rounded-2xl shadow-xl">
      <thead class="w-full bg-gray-200 rounded-t-2xl">
        <tr class="w-full h-8 rounded-t-2xl">
          <th class="rounded-tl-2xl">ID</th>
          <th>Name</th>
          <th>CPF</th>
          <th>Birth Date</th>
          <th>Email</th>
          <th>Phone</th>
          <th class="rounded-tr-2xl">Actions</th>
        </tr>
      </thead>
      <tbody class="rounded-b-2xl">
        <tr v-if="users.length === 0">
          <td colspan="6" class="text-center py-4">No users found.</td>
        </tr>
        <tr
          v-else
          v-for="(user, index) in users"
          :key="user.id"
          :class="{
            'bg-light-table-secondary': user.id % 2 === 0,
            'bg-light-table-primary': user.id % 2 !== 0,
            'w-full h-8 border-b border-t border-gray-200': true,
            'rounded-b-2xl': index === users.length - 1,
          }"
        >
          <td class="border-r border-gray-200 text-center">
            {{ user.id }}
          </td>
          <td class="border-r border-gray-200 text-center">{{ user.name }}</td>
          <td class="border-r border-gray-200 text-center">{{ user.cpf }}</td>
          <td class="border-r border-gray-200 text-center">
            {{ convertDate(user.birthDate) }}
          </td>
          <td class="border-r border-gray-200 text-center">{{ user.email }}</td>
          <td class="border-r border-gray-200 text-center">{{ user.phone }}</td>
          <td class="text-center">
            <text-button
              text="Edit"
              class="text-blue-500 hover:text-blue-600"
              @click="onEdit(user)"
            />
            <text-button
              text="Delete"
              class="text-red-500 hover:text-red-600"
              @click="onDelete(user.id)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <ModalCreateUser
      v-if="showModalCreateUser"
      :show="showModalCreateUser"
      :user="userRef"
      @onSave="onUpdate"
      :onCancel="
        () => {
          showModalCreateUser = false;
        }
      "
    />
    <ConfirmDialog
      :show="showConfirmDialog"
      description="Do you really want to delete the user?"
      :onCancel="() => (showConfirmDialog = false)"
      :onConfirm="() => {}"
    />
  </div>
</template>
<style scoped></style>
