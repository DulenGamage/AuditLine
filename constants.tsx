
import React from 'react';
import { 
  Home, 
  Car, 
  ShoppingBag, 
  Utensils, 
  Zap, 
  Heart, 
  Briefcase, 
  Coffee,
  Smartphone,
  Shield,
  CreditCard,
  TrendingUp,
  Landmark,
  Plane,
  Gift,
  Film
} from 'lucide-react';

export interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string; // Vibrant hex
  bgClass: string; // Tailwind class for container
  textClass: string; // Tailwind class for icon
}

export const CATEGORIES: Category[] = [
  { id: 'food', label: 'Groceries', icon: <ShoppingBag />, color: '#9171f2', bgClass: 'bg-purple-500/10', textClass: 'text-purple-500' },
  { id: 'transport', label: 'Transport', icon: <Car />, color: '#40a3ff', bgClass: 'bg-blue-500/10', textClass: 'text-blue-500' },
  { id: 'entertainment', label: 'Leisure', icon: <Film />, color: '#00c566', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-500' },
  { id: 'housing', label: 'Rent & Utilities', icon: <Home />, color: '#ff7b2c', bgClass: 'bg-orange-500/10', textClass: 'text-orange-500' },
  { id: 'utilities', label: 'Utilities', icon: <Zap />, color: '#ffc833', bgClass: 'bg-yellow-500/10', textClass: 'text-yellow-500' },
  { id: 'health', label: 'Health', icon: <Heart />, color: '#ff4d4d', bgClass: 'bg-rose-500/10', textClass: 'text-rose-500' },
  { id: 'work', label: 'Work', icon: <Briefcase />, color: '#3d426b', bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-500' },
  { id: 'sub', label: 'Subscriptions', icon: <Smartphone />, color: '#00d1ff', bgClass: 'bg-cyan-500/10', textClass: 'text-cyan-500' },
  { id: 'invest', label: 'Investment', icon: <TrendingUp />, color: '#059669', bgClass: 'bg-teal-500/10', textClass: 'text-teal-500' },
  { id: 'travel', label: 'Travel', icon: <Plane />, color: '#ec4899', bgClass: 'bg-pink-500/10', textClass: 'text-pink-500' },
  { id: 'gift', label: 'Gifts', icon: <Gift />, color: '#f43f5e', bgClass: 'bg-rose-500/10', textClass: 'text-rose-500' },
];

export const INITIAL_INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', color: '#10b981', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-500' },
  { id: 'bonus', label: 'Bonus', color: '#14b8a6', bgClass: 'bg-teal-500/10', textClass: 'text-teal-500' },
  { id: 'interest', label: 'Interest', color: '#6366f1', bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-500' },
];
