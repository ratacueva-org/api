import User from "../../modules/users/user.model";
import * as fileUploadService from "../../services/file-upload.service";
import { Address, PaymentMethod } from "../../modules/users/user.model";
import { NotFoundError, UnauthorizedError } from "../../core/errors/custom-errors";

// Profile methods
export const getProfileById = async (id: string) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new NotFoundError("Usuario no encontrado");
  return user;
};

export const updateProfileById = async (
  id: string,
  data: { name?: string; lastName?: string; secondLastName?: string; phone?: string }
) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  Object.assign(user, data);
  await user.save();
  return user;
};

export const changePassword = async (id: string, currentPassword: string, newPassword: string) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new UnauthorizedError("La contraseña actual es incorrecta");

  user.password = newPassword;
  await user.save();
};

export const softDeleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  if (user.isDeleted) {
    throw new UnauthorizedError("Esta cuenta ya ha sido eliminada.");
  }

  user.isDeleted = true;
  await user.save();
};

// Address methods
export const getAddresses = async (userId: string) => {
  const user = await User.findById(userId).select("addresses");
  if (!user) throw new NotFoundError("Usuario no encontrado");
  return user.addresses;
};

export const addAddress = async (userId: string, address: Address) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  if (address.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push(address);
  await user.save();
  return user.addresses;
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  newData: Partial<Address>
) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const address = user.addresses.find((addr: any) => addr._id?.toString() === addressId);
  if (!address) throw new NotFoundError("Dirección no encontrada");

  if (newData.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  Object.assign(address, newData);
  await user.save();
  return address;
};

export const deleteAddress = async (userId: string, addressId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const addressIndex = user.addresses.findIndex((addr: any) => addr._id?.toString() === addressId);
  if (addressIndex === -1) throw new NotFoundError("Dirección no encontrada");

  user.addresses.splice(addressIndex, 1);
  await user.save();
};

export const setDefaultAddress = async (userId: string, addressId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const address = user.addresses.find((addr: any) => addr._id?.toString() === addressId);
  if (!address) throw new NotFoundError("Dirección no encontrada");

  user.addresses.forEach((addr) => (addr.isDefault = false));
  address.isDefault = true;

  await user.save();
  return address;
};

// Payment methods methods
export const getPaymentMethods = async (userId: string) => {
  const user = await User.findById(userId).select("paymentMethods");
  if (!user) throw new NotFoundError("Usuario no encontrado");
  return user.paymentMethods;
};

export const addPaymentMethod = async (userId: string, method: PaymentMethod) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  user.paymentMethods.push(method);
  await user.save();
  return user.paymentMethods;
};

export const updatePaymentMethod = async (
  userId: string,
  methodId: string,
  newData: Partial<PaymentMethod>
) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const method = user.paymentMethods.find((m: any) => m._id?.toString() === methodId);

  if (!method) throw new NotFoundError("Método de pago no encontrado");

  Object.assign(method, newData);
  await user.save();
  return method;
};

export const deletePaymentMethod = async (userId: string, methodId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const methodIndex = user.paymentMethods.findIndex((m: any) => m._id?.toString() === methodId);
  if (methodIndex === -1) throw new NotFoundError("Método de pago no encontrado");

  user.paymentMethods.splice(methodIndex, 1);
  await user.save();
};

export const updateProfilePicture = async (
  userId: string,
  fileBuffer: Buffer,
  originalFileName: string
): Promise<string> => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("Usuario no encontrado.");

  if (user.avatarUrl) {
    const segments = user.avatarUrl.split('/');
    const folderAndId = segments.slice(segments.indexOf('upload') + 2).join('/').split('.')[0];
    const publicId = `ratacueva/users/${folderAndId}`;

    try {
      await fileUploadService.deleteFile(publicId);
    } catch (err) {
      console.warn(`No se pudo eliminar avatar anterior: ${user.avatarUrl}`, err);
    }
  }

  const imageUrl = await fileUploadService.uploadImage(fileBuffer, originalFileName);
  user.avatarUrl = imageUrl;
  await user.save();

  return imageUrl;
};