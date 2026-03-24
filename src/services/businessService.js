import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

/**
 * Create or update business information.
 * - If the user already has a business record → updates the latest one.
 * - If not → creates a new one.
 * - Also syncs up_users.business_id with the latest business record id.
 * Supports partial update (only fields sent in body are updated).
 *
 * POST /api/business
 * @param {Object} data - Business data fields
 * @returns {Promise<Object>} - API response
 */
const createOrUpdateBusiness = async (data) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(
            `${API_URL}/business`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            throw error;
        } else if (error.request) {
            throw new Error("No response from server");
        } else {
            throw new Error("Error creating/updating business");
        }
    }
};

/**
 * Get the latest business information for the authenticated user.
 *
 * GET /api/business/me
 * @returns {Promise<Object>} - API response with business data
 */
const getMyBusiness = async () => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.get(
            `${API_URL}/business/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            throw error;
        } else if (error.request) {
            throw new Error("No response from server");
        } else {
            throw new Error("Error fetching business info");
        }
    }
};

export { createOrUpdateBusiness, getMyBusiness };
