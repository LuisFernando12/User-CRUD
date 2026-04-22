<script setup lang="ts">
import { computed, ref } from "vue";
import { toast } from "vue3-toastify";
import ModalCreateUser from "../components/ModalCreateUser.vue";
import Table from "../components/Table.vue";
import Button from "../components/ui/Button.vue";
import ConfirmDialog from "../components/ui/ConfirmDialog.vue";
import type { CreateUserDTO, UserType } from "../service/user.service";
import { useUserStore } from "../store/user.store";
const showModalCreateUser = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const mode = ref<"create" | "update">("create");
const userRef = ref<UserType>();
const userStore = useUserStore();
const users = computed(() => userStore.usersData);
const currentPage = ref<number>(1);
const totalPages = computed(() => userStore.usersData?.totalPages || 1);

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
  showModalCreateUser.value = false;
  userRef.value = undefined;
};
const onEdit = (user: UserType) => {
  mode.value = "update";
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
    } else {
      toast.success("User updated successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
  userRef.value = undefined;
  showModalCreateUser.value = false;
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
const onNext = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    userStore.documentsPage = currentPage.value;
  }
};
const onPrev = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    userStore.documentsPage = currentPage.value;
  }
};
</script>
<template>
  <div class="flex flex-col items-center h-screen w-screen gap-6">
    <p
      class="font-bold text-zinc-50 text-2xl w-full text-center bg-blue-500 h-14 rounded-b-2xl py-3"
    >
      User CRUD application.
    </p>
    <div
      class="w-2/3 h-2/3 bg-white rounded-2xl flex flex-col items-center py-3 overflow-hidden"
    >
      <div class="flex flex-col w-full py-3">
        <Button
          text="Create User"
          @click="showModalCreateUser = true"
          variant="default"
        />
      </div>
      <Table
        :users="users?.result || []"
        @on-delete="($event) => onDelete($event.id)"
        @on-edit="($event) => onEdit($event.user)"
        :loading="userStore.isUsersDataLoading"
        @on-next="onNext"
        @on-prev="onPrev"
        :current-page="currentPage"
        :total-pages="totalPages"
      />
    </div>
    <ModalCreateUser
      :mode="mode"
      v-if="showModalCreateUser"
      :show="showModalCreateUser"
      @onSave="
        ($event) => (mode === 'create' ? onCreate($event) : onUpdate($event))
      "
      :user="(mode === 'update' && userRef) || null"
      :onCancel="
        () => {
          showModalCreateUser = false;
          mode = 'create';
          userRef = undefined;
        }
      "
    />
    <ConfirmDialog
      v-if="showConfirmDialog"
      :show="showConfirmDialog"
      title="Delete User"
      description="Do you really want to delete the user?"
      @onCancel="() => (showConfirmDialog = false)"
      @onConfirm="onConfirmDelete"
    />
  </div>
</template>
