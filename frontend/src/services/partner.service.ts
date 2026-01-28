import {
  createPartnerApi,
  getAllPartnersApi,
  getPartnerByIdApi,
} from "../api/partner.api";
import type { Partner, PartnerRequestDTO } from "../models/partner";

export class PartnerService {
  static async getAll(): Promise<Partner[]> {
    const response = await getAllPartnersApi();
    const data = response.data;
    return data;
  }

  static async getById(id: string): Promise<Partner> {
    const response = await getPartnerByIdApi(id);
    const data = response.data;
    return data;
  }

  static async create(dto: PartnerRequestDTO): Promise<Partner> {
    const response = await createPartnerApi(dto);
    const data = response.data;
    return data;
  }
}
