import React from 'react';
import { 
  LayoutGrid, Bot, MessageSquare, Mail, Globe, Link as LinkIcon, 
  MapPin, Zap, Smartphone, ShoppingBag, PenTool, Activity, Users, 
  TrendingUp, BarChart3, Rocket, Target, Facebook, Instagram, 
  Linkedin, Twitter, Download, Star, RotateCcw
} from 'lucide-react';

// --- Categories ---
export const categories = [
  { name: "Overview", icon: LayoutGrid, color: "text-gray-500" },
  { name: "Optimisation", icon: BarChart3, color: "text-blue-500" },
  { name: "Growth", icon: Rocket, color: "text-purple-500" },
  { name: "Reach", icon: Target, color: "text-orange-500" },
];

// --- Services ---
export const services = [
  // Optimisation
  { icon: LayoutGrid, title: "SEO Platform", category: "Optimisation", id: "seo" },
  { icon: Bot, title: "AEO / LLM Opt", category: "Optimisation", id: "aeo" },
  { icon: Smartphone, title: "App Store Opt", category: "Optimisation", id: "aso" },
  
  // Growth
  { icon: MessageSquare, title: "Social Media Mgmt", category: "Growth", id: "social" },
  { icon: Globe, title: "Multilingual SEO", category: "Growth", id: "multi-seo" },
  { icon: Zap, title: "Free Zone Tools", category: "Growth", id: "free-zone" },

  // Reach
  { icon: Mail, title: "Email & SMS", category: "Reach", id: "email" },
  { icon: MapPin, title: "Directories", category: "Reach", id: "directories" },
  { icon: ShoppingBag, title: "Marketplaces", category: "Reach", id: "marketplaces" },
  { icon: PenTool, title: "Blog Engine", category: "Reach", id: "blog" },
  { icon: LinkIcon, title: "Backlinks", category: "Reach", id: "backlinks" },
];

// --- Stats ---
export const stats = [
  { label: "Active Campaigns", value: "12", trend: "+2", color: "text-green-500", icon: Activity },
  { label: "Total Reach", value: "85.2k", trend: "+15%", color: "text-icy-main", icon: Users },
  { label: "Est. ROI", value: "340%", trend: "+12%", color: "text-purple-500", icon: TrendingUp },
];

// --- Mock Data: Optimisation ---
export const trafficData = [
  { name: 'Mon', traffic: 4000, impressions: 2400 },
  { name: 'Tue', traffic: 3000, impressions: 1398 },
  { name: 'Wed', traffic: 2000, impressions: 9800 },
  { name: 'Thu', traffic: 2780, impressions: 3908 },
  { name: 'Fri', traffic: 1890, impressions: 4800 },
  { name: 'Sat', traffic: 2390, impressions: 3800 },
  { name: 'Sun', traffic: 3490, impressions: 4300 },
];

export const historicalData = [
  { name: 'Jan', rank: 12, clicks: 450, impressions: 12000 },
  { name: 'Feb', rank: 10, clicks: 520, impressions: 15000 },
  { name: 'Mar', rank: 8, clicks: 600, impressions: 18500 },
  { name: 'Apr', rank: 5, clicks: 750, impressions: 22000 },
  { name: 'May', rank: 4, clicks: 890, impressions: 28000 },
  { name: 'Jun', rank: 3, clicks: 1100, impressions: 35000 },
];

export const keywords = [
  { term: "ai seo tools", rank: 3, change: "+2", vol: "12k" },
  { term: "growth agency", rank: 5, change: "+1", vol: "5.4k" },
  { term: "aeo optimization", rank: 1, change: "0", vol: "800" },
  { term: "local seo services", rank: 8, change: "-1", vol: "22k" },
];

export const queries = [
  { query: "how to optimize for chatgpt", clicks: 432, impressions: 1205 },
  { query: "best digital marketing agency", clicks: 320, impressions: 890 },
  { query: "increase organic traffic", clicks: 210, impressions: 650 },
  { query: "seo vs aeo", clicks: 150, impressions: 400 },
];

// --- Mock Data: ASO ---
export const asoKeywords = [
  { term: "fitness tracker", rank: 2, traffic: "High", opportunity: 85 },
  { term: "workout planner", rank: 5, traffic: "Med", opportunity: 92 },
  { term: "gym log", rank: 12, traffic: "Low", opportunity: 60 },
  { term: "health coach", rank: 1, traffic: "High", opportunity: 45 },
];

export const competitors = [
  { name: "FitLife Pro", rank: 1, downloads: "50k+", rating: 4.8 },
  { name: "MyGymPal", rank: 3, downloads: "25k+", rating: 4.5 },
  { name: "TrackIt", rank: 6, downloads: "10k+", rating: 4.2 },
];

// --- Mock Data: Social ---
export const socialGrowthData = [
  { name: 'W1', organic: 4000, paid: 2400 },
  { name: 'W2', organic: 3000, paid: 1398 },
  { name: 'W3', organic: 2000, paid: 9800 },
  { name: 'W4', organic: 2780, paid: 3908 },
  { name: 'W5', organic: 1890, paid: 4800 },
  { name: 'W6', organic: 2390, paid: 3800 },
  { name: 'W7', organic: 3490, paid: 4300 },
];

export const scheduledPosts = [
  { platform: 'LinkedIn', content: "Announcing our new AI features... 🚀", time: "Tomorrow, 10:00 AM", status: "Scheduled" },
  { platform: 'Twitter', content: "Growth tip #42: Always optimize for LLMs. 🤖", time: "Tomorrow, 2:00 PM", status: "Scheduled" },
  { platform: 'Instagram', content: "[Image] Behind the scenes at Icycon", time: "Wed, 5:00 PM", status: "Draft" },
];

export const mentions = [
  { user: "@sarah_tech", platform: "Twitter", text: "Just tried Icycon's new SEO tool. Mind blown! 🤯", sentiment: "Positive" },
  { user: "MarketingDaily", platform: "LinkedIn", text: "Top agencies to watch in 2025 featuring Icycon.", sentiment: "Positive" },
  { user: "John Doe", platform: "Facebook", text: "Has anyone used their ASO services?", sentiment: "Neutral" },
];

// --- Mock Data: SEO Specific ---
export const coreWebVitals = [
  { name: 'LCP', value: 2.1, target: 2.5, status: 'Good' },
  { name: 'FID', value: 12, target: 100, status: 'Good' },
  { name: 'CLS', value: 0.05, target: 0.1, status: 'Good' },
];

export const technicalIssues = [
  { issue: "Missing H1 Tags", count: 3, severity: "High" },
  { issue: "404 Errors", count: 12, severity: "Medium" },
  { issue: "Slow Images", count: 45, severity: "Low" },
  { issue: "Duplicate Meta", count: 8, severity: "Medium" },
];

export const backlinkGrowth = [
  { name: 'W1', links: 120 },
  { name: 'W2', links: 135 },
  { name: 'W3', links: 142 },
  { name: 'W4', links: 158 },
  { name: 'W5', links: 180 },
];

// --- Mock Data: Marketplace ---
export const marketplaceSales = [
  { name: 'Mon', amazon: 1200, shopify: 800, walmart: 200 },
  { name: 'Tue', amazon: 1500, shopify: 900, walmart: 300 },
  { name: 'Wed', amazon: 1100, shopify: 1200, walmart: 150 },
  { name: 'Thu', amazon: 1800, shopify: 1000, walmart: 400 },
  { name: 'Fri', amazon: 2200, shopify: 1500, walmart: 500 },
  { name: 'Sat', amazon: 2500, shopify: 1800, walmart: 600 },
  { name: 'Sun', amazon: 2100, shopify: 1600, walmart: 550 },
];

export const marketplaceOrders = [
  { id: "ORD-7829", customer: "Alice Smith", platform: "Amazon", amount: "$142.50", status: "Shipped", date: "2 mins ago" },
  { id: "ORD-7830", customer: "Bob Jones", platform: "Shopify", amount: "$89.99", status: "Processing", date: "15 mins ago" },
  { id: "ORD-7831", customer: "Charlie Day", platform: "Walmart", amount: "$210.00", status: "Pending", date: "1 hour ago" },
  { id: "ORD-7832", customer: "Dana White", platform: "Amazon", amount: "$45.00", status: "Return Req", date: "3 hours ago" },
  { id: "ORD-7833", customer: "Eve Black", platform: "eBay", amount: "$67.25", status: "Shipped", date: "5 hours ago" },
];

export const marketplaceMessages = [
  { user: "Mike Ross", platform: "Amazon", subject: "Item not received", time: "10m ago" },
  { user: "Rachel Green", platform: "Etsy", subject: "Custom order request", time: "1h ago" },
  { user: "Harvey S.", platform: "Shopify", subject: "Refund status?", time: "2h ago" },
];