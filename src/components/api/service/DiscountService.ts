import api from "../api";
import type { PartnerOffer } from "../../discounts/types.ts";

const discountLogger = {
    info: (message: string, data?: unknown) =>
        console.log(`[DISCOUNT-SERVICE] [INFO] ${new Date().toISOString()}: ${message}`, data || ''),
    error: (message: string, error?: unknown) =>
        console.error(`[DISCOUNT-SERVICE] [ERROR] ${new Date().toISOString()}: ${message}`, error || ''),
};

interface PartnersResponse {
    partners?: PartnerOffer[];
    results?: PartnerOffer[];
}

const getErrorPayload = (error: unknown) => {
    if (typeof error === "object" && error !== null && "response" in error) {
        return (error as { response?: { data?: unknown } }).response?.data;
    }
    return error;
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
            let data: PartnerOffer[] = [];
            const responseData = response.data as PartnersResponse | PartnerOffer[];

            if (Array.isArray(responseData)) {
                data = responseData;
            } else if (Array.isArray(responseData.results)) {
                data = responseData.results;
            } else if (Array.isArray(responseData.partners)) {
                data = responseData.partners;
            } else {
                discountLogger.info("Unexpected response structure", response.data);
            }


            discountLogger.info("Data array length", data.length);

            const partners = data.map((partner): PartnerOffer => ({
                ...partner, // возвращаем все данные как есть
                discount: partner.discount ? partner.discount.toString() : undefined
            }));


            discountLogger.info("Final partners array", partners);

            return partners;
        } catch (error: unknown) {
            discountLogger.error("Failed to fetch partners", getErrorPayload(error));
            return [];
        }
    }

    async getPartnerById(id: number): Promise<PartnerOffer> {
        discountLogger.info(`Fetching partner with ID: ${id}`);
        try {
            const response = await api.get(`/api/v1/partners/${id}`);
            discountLogger.info(`Partner data received:`, response.data);
            return response.data;
        } catch (error: unknown) {
            discountLogger.error(`Error fetching partner ${id}:`, getErrorPayload(error));
            throw error;
        }
    }

}

export default new DiscountService();
