import axios from "axios";

// Base URL for API calls
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

const getHeaders = (token) => {
  const authToken = token || localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${authToken}`,
  };
};

export const getConversations = async (token) => {
  const response = await axios.get(`${API_URL}/conversations`, {
    headers: getHeaders(token),
  });
  return response.data;
};

export const getOrCreateConversation = async (userId, token) => {
  const response = await axios.post(
    `${API_URL}/conversations`,
    { userId },
    {
      headers: getHeaders(token),
    }
  );
  return response.data;
};

export const getMessages = async (conversationId, since = '', limit = 50, token) => {
  const params = {};
  if (since) params.since = since;
  if (limit) params.limit = limit;
  const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`, {
    params,
    headers: getHeaders(token),
  });
  return response.data;
};

export const sendMessage = async (conversationId, content, type = 'text', token) => {
  const response = await axios.post(
    `${API_URL}/conversations/${conversationId}/messages`,
    { content, type },
    {
      headers: getHeaders(token),
    }
  );
  return response.data;
};

export const markAsRead = async (conversationId, token) => {
  const response = await axios.post(
    `${API_URL}/conversations/${conversationId}/read`,
    {},
    {
      headers: getHeaders(token),
    }
  );
  return response.data;
};

export const getUnreadCount = async (token) => {
  const response = await axios.get(`${API_URL}/conversations/unread-count`, {
    headers: getHeaders(token),
  });
  return response.data;
};
