import api from "../api";
import type { PartnerOffer } from "./types";

const discountLogger = {
    info: (message: string, data?: any) => console.log(`[DISCOUNT-SERVICE] [INFO] ${new Date().toISOString()}: ${message}`, data || ''),
    error: (message: string, error?: any) => console.error(`[DISCOUNT-SERVICE] [ERROR] ${new Date().toISOString()}: ${message}`, error || ''),
};

class DiscountService {
    async getPartners(cityId?: number): Promise<PartnerOffer[]> {
        discountLogger.info("Fetching partners", { cityId });

        try {
            const finalCityId = cityId ?? 1;
            const response = await api.get(`/api/v1/partners/?city_id=${finalCityId}`);

            const data = Array.isArray(response.data) ? response.data : [];

            return data.map((partner: any): PartnerOffer => ({
                id: partner.id,
                name: partner.name,
                type: partner.partner_description || "Партнер",
                logo: partner.logo_url?.medium || "🏷️",
                discount: partner.discount ? `${partner.discount}%` : undefined,
            }));
        } catch (error: any) {
            discountLogger.error("Failed to fetch partners", error?.response?.data || error);
            return [];
        }
    }
}

export default new DiscountService();
