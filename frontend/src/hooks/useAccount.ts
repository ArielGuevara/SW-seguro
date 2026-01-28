import type { AccountRequestDTO } from "../models/account";
import { AccountService } from "../services/account.service";

export function useAccount() {
  const createAccount = async (dto: AccountRequestDTO) => {
    await AccountService.create(dto);
  };

  return {
    createAccount,
  };
}
