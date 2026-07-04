import api from "../api";
import type { PartnerOffer } from "../../discounts/types.ts";

interface PartnersResponse {
    partners?: PartnerOffer[];
    results?: PartnerOffer[];
}

class DiscountService {
    async getPartners(cityId?: number): Promise<PartnerOffer[]> {
        const response = await api.get("/api/v1/partners/", {
            params: cityId ? { city_id: cityId } : undefined,
        });

        let data: PartnerOffer[] = [];
        const responseData = response.data as PartnersResponse | PartnerOffer[];

        if (Array.isArray(responseData)) {
            data = responseData;
        } else if (Array.isArray(responseData.results)) {
            data = responseData.results;
        } else if (Array.isArray(responseData.partners)) {
            data = responseData.partners;
        }

        return data.map((partner): PartnerOffer => ({
            ...partner,
            discount: partner.discount ? partner.discount.toString() : undefined
        }));
    }

    async getPartnerById(id: number): Promise<PartnerOffer> {
        const response = await api.get(`/api/v1/partners/${id}`);
        return response.data;
    }

}

export default new DiscountService();
