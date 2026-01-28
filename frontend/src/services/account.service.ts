import { createAccountApi, getAccountByPartnerIdApi } from "../api/account.api";
import type { AccountRequestDTO } from "../models/account";

export class AccountService {
  static async getByPartnerId(id: string) {
    const response = await getAccountByPartnerIdApi(id);
    const data = response.data;
    return data;
  }

  static async create(dto: AccountRequestDTO) {
    const response = await createAccountApi(dto);
    const data = response.data;
    return data;
  }
}
