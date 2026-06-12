/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Booking {
  id: string;
  name: string;
  phone: string;
  apartmentName: string;
  dong: string;
  ho: string;
  pyeong: string; // m² & pyeong conversion
  bookingDate: string;
  bookingTime: string;
  memo?: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  createdAt: string;
}

export type InspectionCategory = 'visual' | 'tool' | 'equipment';

export interface InspectionItem {
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  zoomImageUrl?: string;
  description: string;
  defectType: string;
  impactScore: number; // 1 to 5 scale
  inspectorNote: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badge: string;
}

