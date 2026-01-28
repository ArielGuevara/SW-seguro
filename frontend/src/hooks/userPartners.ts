import { useEffect, useState } from "react";
import type { Partner } from "../models/partner";
import { PartnerService } from "../services/partner.service";

export function usePartners() {
  const [data, setData] = useState<Partner[] | null>(null);

  useEffect(() => {
    PartnerService.getAll().then(setData).catch(console.error);
  }, []);

  return { partners: data };
}
