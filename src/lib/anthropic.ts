import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!client) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error("ANTHROPIC_API_KEY environment variable is required");
    }
    client = new Anthropic({
      apiKey: key,
      dangerouslyAllowBrowser: true,
    });
  }
  return client;
}

export function getModel(): string {
  return process.env.ANTHROPIC_MODEL || "claude-3-7-sonnet-20250219";
}

export async function generateChatResponse(
  history: { role: 'user' | 'model' | 'assistant', parts?: { text: string }[], content?: string }[],
  message: string
) {
  const ai = getAnthropic();

  const messages: Anthropic.MessageParam[] = history.map((h) => ({
    role: (h.role === 'model' || (h.role as string) === 'assistant') ? 'assistant' : 'user',
    content: h.parts ? h.parts.map(p => p.text).join('\n') : ((h as any).content || '')
  }));
  messages.push({
    role: 'user',
    content: message
  });

  const response = await ai.messages.create({
    model: getModel(),
    max_tokens: 1024,
    system: "You are MX, an AI assistant helping a user (Jen) build a financial prototype app. You are currently in the 'Vision Chat' phase. Your goal is to ask clarifying questions about what features they want in their app, such as account aggregation, spending insights, savings goals, etc. Keep your responses concise, helpful, and conversational. Do not output markdown code blocks unless necessary. Guide the user towards building a prototype.",
    messages
  });

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  return textBlock?.text || "";
}

const updateUITool: Anthropic.Tool = {
  name: "updateUI",
  description: "Update the UI state of the prototype based on user requests.",
  input_schema: {
    type: "object",
    properties: {
      showSpendingInsights: {
        type: "boolean",
        description: "Whether to show or hide the Spending Insights section."
      },
      showRecentTransactions: {
        type: "boolean",
        description: "Whether to show or hide the Recent Transactions section."
      },
      showBalanceCard: {
        type: "boolean",
        description: "Whether to show or hide the Total Balance card."
      },
      showQuickActions: {
        type: "boolean",
        description: "Whether to show or hide the Quick Actions row (Link Account, Insights, Goals, Transfer)."
      },
      showBottomNav: {
        type: "boolean",
        description: "Whether to show or hide the bottom navigation bar."
      },
      greetingText: {
        type: "string",
        description: "The greeting text at the top of the app (e.g., 'Welcome back', 'Good morning')."
      },
      balanceLabel: {
        type: "string",
        description: "The label for the balance card (e.g., 'Total Balance', 'Available Balance')."
      },
      themeColor: {
        type: "string",
        description: "The primary theme color in hex format (e.g., #2563eb for blue, #2d5f3f for green)."
      },
      accentColor: {
        type: "string",
        description: "The secondary/accent color in hex format."
      },
      fontFamily: {
        type: "string",
        description: "The font family to use: 'sans', 'serif', or 'mono'."
      },
      borderRadius: {
        type: "string",
        description: "The border radius for cards and buttons: 'none', 'sm', 'md', 'lg', or 'full'."
      },
      cardStyle: {
        type: "string",
        description: "The visual style of cards: 'flat' (no shadow/border), 'shadow' (drop shadow), or 'bordered' (outline)."
      },
      headerStyle: {
        type: "string",
        description: "The style of the top header: 'default', 'minimal', or 'prominent'."
      },
      layoutStyle: {
        type: "string",
        description: "The overall spacing and layout density: 'default', 'compact', or 'spacious'."
      },
      prototypeTemplate: {
        type: "string",
        description: "The primary structure/layout of the application based on the use case. Choose from: 'standard' (for typical banking dashboards), 'loan-origination' (for loan applications/progress), 'account-opening' (for onboarding flows), or 'financial-wellness' (for goal tracking and insights)."
      },
      message: {
        type: "string",
        description: "A short, friendly message confirming the changes made to the user."
      }
    },
    required: ["message"]
  }
};

export async function refineUI(message: string, currentState: any) {
  const ai = getAnthropic();

  const response = await ai.messages.create({
    model: getModel(),
    max_tokens: 1024,
    system: "You are MX, an AI assistant helping a user refine a financial prototype app. Use the updateUI tool to apply the requested changes. If the user asks for something outside the scope of the tool, explain what you can do.",
    tools: [updateUITool],
    tool_choice: { type: "auto" },
    messages: [
      {
        role: "user",
        content: `The user wants to refine the UI. Current state: ${JSON.stringify(currentState)}. User request: "${message}"`
      }
    ]
  });

  for (const block of response.content) {
    if (block.type === 'tool_use' && block.name === 'updateUI') {
      const updates = block.input as any;
      return {
        success: true,
        updates,
        message: updates.message
      };
    }
  }

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  return {
    success: false,
    message: textBlock?.text || "I couldn't figure out how to apply that change."
  };
}

export async function buildUIConfiguration(history: { role: 'user' | 'model' | 'assistant', parts?: { text: string }[], content?: string }[]) {
  const ai = getAnthropic();

  const messages: Anthropic.MessageParam[] = history.map((h) => ({
    role: (h.role === 'model' || (h.role as string) === 'assistant') ? 'assistant' : 'user',
    content: h.parts ? h.parts.map(p => p.text).join('\n') : ((h as any).content || '')
  }));
  messages.push({
    role: 'user',
    content: "Based on our conversation, please generate the initial UI configuration for the prototype."
  });

  const response = await ai.messages.create({
    model: getModel(),
    max_tokens: 1024,
    system: "You are MX, an AI assistant. You have just finished a conversation with the user about their desired financial app prototype. Use the updateUI tool to generate the initial UI configuration based on their preferences. Set appropriate values for all properties based on what was discussed. If something wasn't mentioned, use reasonable defaults.",
    tools: [updateUITool],
    tool_choice: { type: "tool", name: "updateUI" },
    messages
  });

  for (const block of response.content) {
    if (block.type === 'tool_use' && block.name === 'updateUI') {
      return block.input as any;
    }
  }

  return null;
}
