<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue3-toastify";
import type { UserType } from "../service/user.service";
import { useUserStore } from "../store/user.store";
import ModalCreateUser from "./ModalCreateUser.vue";
import ConfirmDialog from "./ui/ConfirmDialog.vue";
import TextButton from "./ui/TextButton.vue";
import { HandleMask } from "./ui/utils/mask";

const userStore = useUserStore();
defineProps<{
  users: UserType[];
}>();
const showModalCreateUser = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const userRef = ref<UserType>();
const onEdit = (user: UserType) => {
  showModalCreateUser.value = true;
  userRef.value = { ...user };
};
const onUpdate = async (user: Partial<UserType>) => {
  const { _id: id, ...rest } = user;
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
const onDelete = (id: string) => {
  userRef.value = { _id: id } as UserType;
  showConfirmDialog.value = true;
};
const onConfirmDelete = async () => {
  if (!userRef.value?._id) {
    toast.error("User not found !", {
      position: toast.POSITION.TOP_RIGHT,
    });
    console.error("User not found, missing id !");
    showConfirmDialog.value = false;
    return;
  }
  const userDeleted = await userStore.onDeleteUser(userRef.value?._id);
  if (!userDeleted) {
    toast.error("Error deleting user !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } else {
    toast.success("User deleted successfully !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  showConfirmDialog.value = false;
};
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
      <tbody class="rounded-b-2xl">
        <tr v-if="users.length === 0">
          <td colspan="6" class="text-center py-4">No users found.</td>
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
              class="text-blue-500 hover:text-blue-600"
              @click="onEdit(user)"
            />
            <span class="text-gray-300 font-light">|</span>
            <text-button
              text="Delete"
              class="text-red-500 hover:text-red-600"
              @click="onDelete(user._id)"
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
      title="Delete User"
      description="Do you really want to delete the user?"
      @onCancel="() => (showConfirmDialog = false)"
      @onConfirm="onConfirmDelete"
    />
  </div>
</template>
<style scoped></style>
