export const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'goals', label: 'Goals' },
  { id: 'insights', label: 'Insights' },
]

export const appCopy = {
  publicShell: {
    eyebrow: 'XPS finance OS',
    badge: 'Professional budgeting workspace',
    headline: 'Plan cash flow like a team, not a template.',
    copy:
      'XPS starts with secure auth, then lands you in a multi-page finance workspace for budgets, transactions, savings goals, and month-end insight.',
    metrics: [
      { value: '4', label: 'workspace views' },
      { value: '24h', label: 'sync cadence' },
      { value: 'Live', label: 'Supabase auth' },
    ],
    themeNote:
      'Built to feel more like a financial control room and less like a starter app.',
    planLabel: 'Workspace includes',
    planSteps: [
      'Connect accounts and categories',
      'Track fixed bills against runway',
      'Flag overspend before month-end',
    ],
    sideNoteLabel: 'After sign-in',
    sideNoteCopy:
      'Move between dashboard, transactions, goals, and insights without leaving the app shell. The data is still mocked, but the information architecture is now real.',
  },
  workspace: {
    brand: 'XPS',
    title: 'Finance workspace',
    copy: 'Authenticated with Supabase and shaped for real budget operations.',
    profileCopy:
      'Workspace access is live and the shell is ready for connected financial data.',
    headerPills: [
      { label: 'March close in 12 days' },
      { label: 'Net cash runway: healthy', subtle: true },
    ],
  },
  dashboard: {
    introLabel: 'Primary account',
    introCopy:
      'This page anchors the workspace with budget health, runway, and recent moves.',
    activityLabel: 'Recent activity',
    activityTitle: 'What needs attention this week',
    activityCopy:
      'Shaped for real transactions, forecast alerts, and automated rule output.',
    activityFeed: [
      {
        title: 'Rent envelope locked',
        detail: 'Protected from discretionary spend',
        amount: '$1,450',
      },
      {
        title: 'Groceries trending low',
        detail: 'Current pace finishes $86 under plan',
        amount: '-$86',
      },
      {
        title: 'Emergency fund transfer',
        detail: 'Scheduled for Friday sweep',
        amount: '$120',
      },
    ],
  },
  transactions: {
    label: 'Transaction flow',
    title: 'Latest movement across categories',
    copy: 'Replace this sample ledger with synced cards, bills, and transfer events.',
  },
  goals: {
    label: 'Savings goals',
    title: 'Protect long-term money from short-term noise',
    copy:
      'Each goal can later map to envelopes, rules, and automated contribution schedules.',
  },
  insights: {
    label: 'Insights',
    title: 'Summaries that explain where the month is heading',
    copy:
      'These cards can later be generated from actual cash flow and category behavior.',
  },
}

export const dashboardStats = [
  {
    label: 'Monthly budget',
    value: '$4,200',
    detail: 'Target envelope across essentials and flex.',
  },
  {
    label: 'Spent so far',
    value: '$1,740',
    detail: '41% of plan, pacing below forecast.',
  },
  {
    label: 'Left to allocate',
    value: '$2,460',
    detail: 'Enough headroom for recurring bills and goals.',
  },
]

export const transactionRows = [
  {
    merchant: 'Union Market',
    category: 'Groceries',
    date: 'Mar 18',
    amount: '$84.10',
    status: 'Cleared',
  },
  {
    merchant: 'Horizon Power',
    category: 'Utilities',
    date: 'Mar 17',
    amount: '$128.42',
    status: 'Scheduled',
  },
  {
    merchant: 'Northstar Gym',
    category: 'Health',
    date: 'Mar 15',
    amount: '$65.00',
    status: 'Cleared',
  },
  {
    merchant: 'City Transit',
    category: 'Transport',
    date: 'Mar 14',
    amount: '$42.00',
    status: 'Cleared',
  },
]

export const goalCards = [
  {
    name: 'Emergency fund',
    progress: '72%',
    amount: '$7,200 / $10,000',
    note: 'On pace to complete in 4 months.',
  },
  {
    name: 'Summer travel',
    progress: '46%',
    amount: '$920 / $2,000',
    note: 'Protected from day-to-day spend.',
  },
  {
    name: 'Laptop replacement',
    progress: '31%',
    amount: '$465 / $1,500',
    note: 'Needs a larger monthly contribution.',
  },
]

export const insightCards = [
  {
    title: 'Cash flow is healthy',
    copy:
      'Bills and subscriptions land inside a stable runway with room to save.',
  },
  {
    title: 'Dining is your biggest flex risk',
    copy:
      'Current pace is 18% above target and could erase grocery gains.',
  },
  {
    title: 'Savings automation is working',
    copy:
      'Transfers are consistent, which reduces manual catch-up at month end.',
  },
]
