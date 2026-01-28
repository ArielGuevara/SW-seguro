import type { Partner, PartnerRequestDTO } from "../models/partner";
import { createAxiosInstance } from "./api";

const partnersApi = createAxiosInstance(import.meta.env.VITE_API_PARTNERS_URL);

export function getAllPartnersApi() {
  return partnersApi.get<Partner[]>("");
}

export function getPartnerByIdApi(id: string) {
  return partnersApi.get<Partner>(`${id}`);
}

export function createPartnerApi(dto: PartnerRequestDTO) {
  return partnersApi.post<Partner>("", dto);
}
