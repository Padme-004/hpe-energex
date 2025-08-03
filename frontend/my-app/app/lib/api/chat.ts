export interface ChatMessage {
  text: string;
  sender: "user" | "bot";
}

export interface ChatResponse {
  response: string;
}

export const ChatService = {
  async sendMessage(
    message: string,
    token: string
  ): Promise<ChatResponse> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/forward`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: message }),
      }
    );

    if (response.status === 401) {
      throw new Error("Unauthorized - Please login again");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server responded with ${response.status}: ${errorText}`);
      throw new Error(`Server error: ${response.status}`);
    }

    return response.json();
  },
};