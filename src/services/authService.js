import axios from "axios";

// Base URL for API calls
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

// Authentication service functions
const login = async (cccd, password, recaptchaToken) => {
    const response = await axios.post(
        `${API_URL}/auth/login`,
        {
            "cccd": cccd,
            "password": password,
            "recaptchaToken": recaptchaToken
        }
    );
    return response;
};

const getMe = async (token) => {
    const response = await axios.get(
        `${API_URL}/auth/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response;
}

/**
 * Change user password
 * @param {string} cccd - User's CCCD number
 * @param {string} currentPassword - User's current password
 * @param {string} newPassword - User's new password
 * @param {string} confirmPassword - Confirmation of new password
 * @returns {Promise<Object>} - The response from the API
 */
const changePassword = async (cccd, newPassword, confirmPassword) => {
    try {
        const response = await axios.post(
            `${API_URL}/auth/change-password`,
            {
                "cccd": cccd,
                "new_password": newPassword,
                "confirm_password": confirmPassword
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(error.response.data?.error?.message || "Password change failed");
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error("No response from server");
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error("Error setting up password change request");
        }
    }
};

/**
 * Verify bank account number with bank name and account name
 * @param {string} bankNumber
 * @param {string} bankName
 * @param {string} accountName
 * @returns {Promise<Object>} axios response
 */
const verifyBankNumber = async (bankNumber, bankName, accountName = "ABC") => {
    const response = await axios.post(
        `${API_URL}/auth/verify-bank-number`,
        { bankNumber, bankName, accountName },
        { headers: { 'Content-Type': 'application/json' } }
    );
    return response;
};

const generateQrSession = async (deviceInfo, ipAddress = null) => {
    try {
        const payload = { deviceInfo };
        if (ipAddress) payload.ipAddress = ipAddress;
        const response = await axios.post(
            `${API_URL}/auth/generate-qr`,
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.error?.message || "QR generation failed");
        } else if (error.request) {
            throw new Error("No response from server");
        } else {
            throw new Error("Error setting up QR generate request");
        }
    }
};

const generateQrSessionInfo = async () => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            return null;
        }

        const response = await axios.post(
            `${API_URL}/auth/generate-qr-info`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.error?.message || "QR generation failed");
        } else if (error.request) {
            throw new Error("No response from server");
        } else {
            throw new Error("Error setting up QR generate request");
        }
    }
};

/**
 * Update user information
 * @param {string} token - User's authentication token
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} - The response from the API
 */
const updateUser = async (token, userData) => {
    const response = await axios.put(
        `${API_URL}/auth/update`,
        userData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response;
};

const updateAvatar = async (avatarUrl) => {
    const token = await localStorage.getItem("authToken");
    if (!token) {
        alert("Please login first");
        return null;
    }
    const response = await axios.put(
        `${API_URL}/auth/update`,
        { avt: avatarUrl },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response;
};
export {
    login, getMe, changePassword, verifyBankNumber, generateQrSession, generateQrSessionInfo
    , updateUser, updateAvatar
};