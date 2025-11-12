import api from "../api";
import type { PartnerOffer } from "../../discounts/types.ts";

const discountLogger = {
    info: (message: string, data?: any) =>
        console.log(`[DISCOUNT-SERVICE] [INFO] ${new Date().toISOString()}: ${message}`, data || ''),
    error: (message: string, error?: any) =>
        console.error(`[DISCOUNT-SERVICE] [ERROR] ${new Date().toISOString()}: ${message}`, error || ''),
};

class DiscountService {
    async getPartners(cityId?: number): Promise<PartnerOffer[]> {
        discountLogger.info("Fetching partners started", { cityId });

        try {
            // Используем cityId только если он есть
            const url = cityId ? `/api/v1/partners/?city_id=${cityId}` : `/api/v1/partners/`;
            discountLogger.info("Request URL", url);

            const response = await api.get(url);

            discountLogger.info("Raw response", response);

            // Проверяем возможные варианты структуры данных
            let data: any[] = [];

            if (Array.isArray(response.data)) {
                data = response.data;
            } else if (Array.isArray(response.data.results)) {
                data = response.data.results;
            } else if (Array.isArray(response.data.partners)) {
                data = response.data.partners;
            } else {
                discountLogger.info("Unexpected response structure", response.data);
            }


            discountLogger.info("Data array length", data.length);

            const partners = data.map((partner: any): PartnerOffer => ({
                ...partner, // возвращаем все данные как есть
                discount: partner.discount ? partner.discount.toString() : undefined
            }));


            discountLogger.info("Final partners array", partners);

            return partners;
        } catch (error: any) {
            discountLogger.error("Failed to fetch partners", error?.response?.data || error);
            return [];
        }
    }
}

export default new DiscountService();
