import type { Account, AccountRequestDTO } from "../models/account";
import { createAxiosInstance } from "./api";

export const accountsApi = createAxiosInstance(
  import.meta.env.VITE_API_ACCOUNTS_URL,
);

export function getAccountByPartnerIdApi(id: string) {
  return accountsApi.get<Account[]>(`/socio/${id}`);
}

export function createAccountApi(dto: AccountRequestDTO) {
  return accountsApi.post<Account>("", dto);
}
