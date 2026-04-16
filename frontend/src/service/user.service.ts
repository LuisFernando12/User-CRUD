import z from "zod";
import { api } from "../config/api";

const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  cpf: z.string(),
  birthDate: z.string(),
  phone: z.string(),
});
const UpdateUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  cpf: z.string(),
  birthDate: z.string(),
  phone: z.string(),
});
export type UserType = z.infer<typeof UserSchema>;
export type CreateUserDTO = Omit<UserType, "_id">;
export type UpdateUserDTO = Partial<CreateUserDTO>;
const createUser = async (user: CreateUserDTO): Promise<UserType> => {
  try {
    const { data } = await api.post("/user", user);
    return UserSchema.parse(data);
  } catch (error) {
    console.error("Error creating user:", error);
    throw Error("Failed to create user");
  }
};
const getUsers = async (): Promise<UserType[]> => {
  try {
    const { data } = await api.get("/user");
    return UserSchema.array().parse(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw Error("Failed to fetch users");
  }
};
const getUserById = async (id: string): Promise<UserType> => {
  try {
    const { data } = await api.get(`/user/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw Error("Failed to fetch user");
  }
};
const updateUser = async (
  id: string,
  user: UpdateUserDTO,
): Promise<{ affected: number }> => {
  try {
    user = UpdateUserSchema.strip().parse(user);
    const { data } = await api.put(`/user/${id}`, user);
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw Error("Failed to update user");
  }
};
const deleteUser = async (id: string): Promise<void> => {
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
