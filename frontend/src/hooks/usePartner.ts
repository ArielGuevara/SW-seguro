import { useEffect, useState } from "react";
import type { Partner, PartnerRequestDTO } from "../models/partner";
import { PartnerService } from "../services/partner.service";

export function usePartner(
  { id }: { id: string | undefined } = { id: undefined },
) {
  const [partner, setPartner] = useState<Partner | null>(null);

  const createPartner = async (data: PartnerRequestDTO) => {
    await PartnerService.create(data);
  };

  useEffect(() => {
    if (!id) return;

    PartnerService.getById(id).then(setPartner).catch(console.error);
  }, [id]);

  return {
    partner,
    createPartner,
  };
}
