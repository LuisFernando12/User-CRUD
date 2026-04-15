import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import {
  userService,
  type CreateUserDTO,
  type UpdateUserDTO,
} from "../service/user.service";

export const useUserStore = defineStore("user", () => {
  const queryClient = useQueryClient();
  const { data: usersData, isLoading: isUsersDataLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await userService.getUsers(),
  });
  const invalidUserQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["users"],
    });
    queryClient.refetchQueries({
      queryKey: ["users"],
    });
  };
  const onCreateUser = async (user: CreateUserDTO) => {
    try {
      const userCreated = await userService.createUser(user);
      if (!userCreated) {
        return false;
      }
      invalidUserQueries();
      return true;
    } catch (error) {
      return false;
    }
  };
  const onUpdateUser = async (id: string, user: UpdateUserDTO) => {
    try {
      const userUpdated = await userService.updateUser(id, user);
      if (!userUpdated) {
        return false;
      }
      invalidUserQueries();
      return true;
    } catch (error) {
      return false;
    }
  };
  const onDeleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      invalidUserQueries();
      return true;
    } catch (error) {
      return false;
    }
  };
  return {
    usersData,
    isUsersDataLoading,
    onCreateUser,
    onUpdateUser,
    onDeleteUser,
  };
});
