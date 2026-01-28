import { useEffect, useState } from "react";
import type { Account } from "../models/account";
import { AccountService } from "../services/account.service";

export function useAccountsByPartner({ id }: { id: string | undefined }) {
  const [data, setData] = useState<Account[] | null>(null);

  useEffect(() => {
    if (!id) return;

    AccountService.getByPartnerId(id).then(setData).catch(console.error);
  }, [id]);

  return {
    accounts: data,
  };
}
