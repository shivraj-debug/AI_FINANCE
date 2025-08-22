import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "1k+",
    label: "Active Users",
  },
  {
    value: "$1M+",
    label: "Transactions Tracked",
  },
  {
    value: "90%",
    label: "Uptime",
  },
  {
    value: "4.3/5",
    label: "User Rating",
  },
];

// Features Data
export const featuresData = [
  {
  icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
  title: "AI-Driven Analytics",
  description: "Unlock deep insights into your spending with advanced AI reports",
},
{
  icon: <Receipt className="h-8 w-8 text-blue-600" />,
  title: "AI Receipt Reader",
  description: "Snap a photo and let AI instantly extract and categorize your receipts",
},
{
  icon: <PieChart className="h-8 w-8 text-blue-600" />,
  title: "Smart Budgeting",
  description: "Plan, track, and optimize budgets with intelligent suggestions",
},
{
  icon: <CreditCard className="h-8 w-8 text-blue-600" />,
  title: "Unified Accounts",
  description: "View and manage all your bank accounts and cards in one dashboard",
},
{
  icon: <Globe className="h-8 w-8 text-blue-600" />,
  title: "Global Currency Support",
  description: "Seamlessly manage multiple currencies with live exchange rates",
},
{
  icon: <Zap className="h-8 w-8 text-blue-600" />,
  title: "Instant Insights",
  description: "Receive real-time financial tips and recommendations automatically",
},
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Create Your Account",
    description:
      "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Track Your Spending",
    description:
      "Automatically categorize and track your transactions in real-time",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Get Insights",
    description:
      "Receive AI-powered insights and recommendations to optimize your finances",
  },
];

// Testimonials Data
export const testimonialsData = [
{
  name: "Rakesh Thakur",
  role: "Startup Founder",
  image: "https://randomuser.me/api/portraits/men/65.jpg",
  quote:
    "Welth has completely streamlined my company’s financial tracking. The AI-driven reports give me clarity and help me make faster, smarter business decisions.",
},
{
  name: "Ayush Kumar",
  role: "Independent Consultant",
  image: "https://randomuser.me/api/portraits/men/68.jpg",
  quote:
    "With Welth’s smart receipt scanning, I’ve cut down hours of paperwork each week. Everything is organized, accessible, and stress-free.",
},
{
  name: "Khushi Jha",
  role: "Wealth Manager",
  image: "https://randomuser.me/api/portraits/women/68.jpg",
  quote:
    "I suggest Welth to all my clients. The intuitive budget tools and real-time currency conversions make it a must-have for global portfolios.",
},
];
