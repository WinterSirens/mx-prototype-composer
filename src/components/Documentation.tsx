import { Code, Server, Layout } from 'lucide-react';
import Sidebar from './Sidebar';

interface Props {
  onTabChange: (tab: string) => void;
}

export default function Documentation({ onTabChange }: Props) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-composer-light">
      <Sidebar activeItem="Documentation" onTabChange={onTabChange} />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <Server className="text-[#2d5f3f]" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Backend Grounding (MX Docs)</h1>
            </div>
            
            <div className="prose prose-sm max-w-none text-gray-600">
              <p className="mb-6">The grounding engine must not hallucinate MX endpoints. This section maps each V1 capability to its real, documented MX API so that any AI building or verifying the scaffold code has a source-of-truth reference.</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">9.1 Architecture Overview</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6 font-mono text-xs space-y-2">
                <div><strong>Development (sandbox):</strong> https://int-api.mx.com</div>
                <div><strong>Production:</strong> https://api.mx.com</div>
                <div className="pt-2 border-t border-gray-200"><strong>Authentication:</strong> Basic Access Authentication on every request. Header: Authorization: Basic &lt;Base64(client_id:api_key)&gt; TLS 1.2+ required.</div>
                <div><strong>Accept header:</strong> Accept: application/vnd.mx.api.v1+json</div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">9.2 Capability 1: Account Aggregation — MX Connect Widget</h3>
              <p>Members link their external bank accounts. The Connect widget handles the credential flow, OAuth redirects, and MFA prompts.</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mt-3 mb-6 text-xs">
{`POST https://int-api.mx.com/users/{user_guid}/widget_urls
{
  "widget_url": {
    "widget_type": "connect_widget",
    "use_cases": ["PFM"]
  }
}`}
              </pre>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">9.3 Capability 2: Spending Insights — Insights API</h3>
              <p>After accounts are linked and transactions aggregated, members see their spending broken down by category and month.</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mt-3 mb-6 text-xs">
{`GET /users/{user_guid}/insights
Authorization: Basic <Base64(client_id:api_key)>
Accept: application/vnd.mx.api.v1+json`}
              </pre>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">9.4 Capability 3: Savings Goals — Goals API</h3>
              <p>Members set savings goals (Emergency Fund, Vacation, Home Down Payment). When a payroll deposit hits, the auto-save rule contributes a percentage to each goal.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <Layout className="text-[#2d5f3f]" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Frontend Component Map (MUI)</h1>
            </div>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p>Maps every screen to its Material UI v6 components so a React engineer or AI coding tool has a concrete component list, not just a visual description.</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mt-4 mb-4 text-xs">
{`npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

import { createTheme, ThemeProvider } from '@mui/material/styles';

const composerTheme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: '#2d5f3f' }, // Cascade forest green
    secondary: { main: '#d4a574' }, // Cascade warm tan
    background: { default: '#f7f8fa', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
  }
});`}
              </pre>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <Code className="text-[#2d5f3f]" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Scaffold Code Starters</h1>
            </div>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p>Copy-paste ready code for the three V1 MX capabilities. These are the "scaffold code" sections that go into the delivery handoff package.</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">11.1 MX Connect Widget — Web SDK Embed</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mt-3 mb-6 text-xs">
{`// MX CONNECT WIDGET -- Account Aggregation
// SCAFFOLDED: requires MX API key — see docs.mx.com/api-reference/platform-api/reference/request-widget-url
async function getMxConnectWidgetUrl(userGuid) {
  const response = await fetch(
    \`https://int-api.mx.com/users/\${userGuid}/widget_urls\`,
    {
      method: 'POST',
      headers: {
        'Authorization': \`Basic \${btoa(\`\${CLIENT_ID}:\${API_KEY}\`)}\`,
        'Accept': 'application/vnd.mx.api.v1+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        widget_url: {
          widget_type: 'connect_widget',
          use_cases: ['PFM'],
        },
      }),
    }
  );
  const data = await response.json();
  return data.widget_url.url;
}

// MX CONNECT WIDGET -- Event Listener & Aggregation
window.addEventListener('message', async function(event) {
  // In production, verify event.origin matches MX widget URL
  const data = event.data;
  
  if (data && data.type === 'mx/connect/memberConnected') {
    const memberGuid = data.metadata.member_guid;
    console.log('Member connected successfully!', memberGuid);
    
    // Step 7: Trigger Aggregation
    // SCAFFOLDED: requires MX API key — see docs.mx.com/api-reference/platform-api/reference/aggregate-member
    await fetch(
      \`https://int-api.mx.com/users/\${USER_GUID}/members/\${memberGuid}/aggregate\`,
      {
        method: 'POST',
        headers: {
          'Authorization': \`Basic \${btoa(\`\${CLIENT_ID}:\${API_KEY}\`)}\`,
          'Accept': 'application/vnd.mx.api.v1+json'
        }
      }
    );
    
    // Poll for completion, then update application state
    // close modal, and refresh data
  }
});`}
              </pre>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">11.2 Account Aggregation — Accounts & Transactions</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mt-3 mb-6 text-xs">
{`// MX ACCOUNT AGGREGATION -- Fetch Accounts
// SCAFFOLDED: requires MX API key — see docs.mx.com/api-reference/platform-api/reference/list-user-accounts
async function getAccounts(userGuid) {
  const response = await fetch(
    \`https://int-api.mx.com/users/\${userGuid}/accounts\`,
    {
      headers: {
        'Authorization': \`Basic \${btoa(\`\${CLIENT_ID}:\${API_KEY}\`)}\`,
        'Accept': 'application/vnd.mx.api.v1+json',
      },
    }
  );
  const data = await response.json();
  return data.accounts; // Fields: guid, name, balance, available_balance, type, institution_code, member_guid, is_hidden, currency_code, connection_status
}

// MX ACCOUNT AGGREGATION -- Fetch Transactions
// SCAFFOLDED: requires MX API key — see docs.mx.com/api-reference/platform-api/reference/list-transactions-by-account
async function getTransactions(userGuid, accountGuid) {
  const response = await fetch(
    \`https://int-api.mx.com/users/\${userGuid}/accounts/\${accountGuid}/transactions\`,
    {
      headers: {
        'Authorization': \`Basic \${btoa(\`\${CLIENT_ID}:\${API_KEY}\`)}\`,
        'Accept': 'application/vnd.mx.api.v1+json',
      },
    }
  );
  const data = await response.json();
  return data.transactions; // Fields: guid, amount, date, description, original_description, category, top_level_category, is_income, is_direct_deposit, is_subscription, type, status, account_guid
}`}
              </pre>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">11.3 Savings Goals — Tracking API</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mt-3 mb-6 text-xs">
{`// MX SAVINGS GOALS -- Fetch Goals
// SCAFFOLDED: requires MX API key — see docs.mx.com/api-reference/platform-api/reference/list-goals
async function getGoals(userGuid) {
  const response = await fetch(
    \`https://int-api.mx.com/users/\${userGuid}/goals\`,
    {
      headers: {
        'Authorization': \`Basic \${btoa(\`\${CLIENT_ID}:\${API_KEY}\`)}\`,
        'Accept': 'application/vnd.mx.api.v1+json',
      },
    }
  );
  const data = await response.json();
  return data.goals; // Fields: guid, name, meta_type_name, goal_type_name, track_type_name, amount, current_amount, is_complete, position, user_guid
}

// MX SAVINGS GOALS -- Create Goal
// SCAFFOLDED: requires MX API key — see docs.mx.com/api-reference/platform-api/reference/create-goal
async function createGoal(userGuid, goalData) {
  // Example meta_type_name values: "Emergency Fund", "Vacation", "Home Down Payment"
  const response = await fetch(
    \`https://int-api.mx.com/users/\${userGuid}/goals\`,
    {
      method: 'POST',
      headers: {
        'Authorization': \`Basic \${btoa(\`\${CLIENT_ID}:\${API_KEY}\`)}\`,
        'Accept': 'application/vnd.mx.api.v1+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goal: goalData })
    }
  );
  const data = await response.json();
  return data.goal;
}`}
              </pre>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">11.4 Financial Insights — Proactive Feed</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mt-3 mb-2 text-xs">
{`// MX FINANCIAL INSIGHTS -- Fetch User Insights
// SCAFFOLDED: requires MX API key — see docs.mx.com/api-reference/platform-api/reference/list-insights
async function getInsights(userGuid) {
  const response = await fetch(
    \`https://int-api.mx.com/users/\${userGuid}/insights\`,
    {
      method: 'GET',
      headers: {
        'Authorization': \`Basic \${btoa(\`\${CLIENT_ID}:\${API_KEY}\`)}\`,
        'Accept': 'application/vnd.mx.api.v1+json'
      }
    }
  );
  const data = await response.json();
  return data.insights;
}

// Example Mock Response
/*
{
  "insights": [
    {
      "guid": "INS-123",
      "title": "Paycheck Deposited",
      "description": "Your paycheck of $3,240.00 from Pacific Health Systems has been deposited.",
      "template": "PaycheckDeposit",
      "micro_title": "Deposit",
      "micro_description": "Pacific Health Systems",
      "is_dismissed": false,
      "has_been_displayed": true,
      "active_at": "2026-04-09T08:00:00Z"
    },
    {
      "guid": "INS-456",
      "title": "Subscription Price Increase",
      "description": "Your Spotify subscription increased from $10.99 to $11.99 this month.",
      "template": "SubscriptionPriceIncrease",
      "micro_title": "Increase",
      "micro_description": "Spotify",
      "is_dismissed": false,
      "has_been_displayed": true,
      "active_at": "2026-04-08T10:00:00Z"
    },
    {
      "guid": "INS-789",
      "title": "Monthly Category Total",
      "description": "You spent $840 on Groceries this month.",
      "template": "MonthlyCategoryTotal",
      "micro_title": "Groceries",
      "micro_description": "$840 spent",
      "is_dismissed": false,
      "has_been_displayed": true,
      "active_at": "2026-04-01T00:00:00Z"
    }
  ]
}
*/`}
              </pre>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
