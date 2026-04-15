import { api } from "../config/api";

export interface IUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone: string;
}
export type CreateUserDTO = Omit<IUser, "id">;
export type UpdateUserDTO = Partial<CreateUserDTO>;
const createUser = async (user: CreateUserDTO): Promise<IUser> => {
  try {
    const { data } = await api.post("/user", user);
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw Error("Failed to create user");
  }
};
const getUsers = async (): Promise<IUser[]> => {
  try {
    const { data } = await api.get("/user");
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw Error("Failed to fetch users");
  }
};
const getUserById = async (id: number): Promise<IUser> => {
  try {
    const { data } = await api.get(`/user/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw Error("Failed to fetch user");
  }
};
const updateUser = async (id: number, user: UpdateUserDTO): Promise<IUser> => {
  try {
    const { data } = await api.patch(`/user/${id}`, user);
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw Error("Failed to update user");
  }
};
const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/user/${id}`);
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw Error("Error to delete user");
  }
};

export const userService = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
