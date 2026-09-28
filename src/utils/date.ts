/**
 * Date helper utilities for KOBIS Daily Box Office
 */

// Get YYYY-MM-DD string for a Date object in local time
export function formatDateToInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convert YYYY-MM-DD to YYYYMMDD
export function formatInputToTargetDt(inputDate: string): string {
  return inputDate.replace(/-/g, '');
}

// Convert YYYYMMDD to YYYY-MM-DD
export function formatTargetDtToInput(targetDt: string): string {
  if (!targetDt || targetDt.length !== 8) return '';
  return `${targetDt.slice(0, 4)}-${targetDt.slice(4, 6)}-${targetDt.slice(6, 8)}`;
}

// Get yesterday's Date object (since box office is only available up to yesterday)
export function getYesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
}

// Get max allowed date string for date picker (Yesterday: YYYY-MM-DD)
export function getMaxAllowedDateString(): string {
  return formatDateToInput(getYesterday());
}

// Check if a date string (YYYY-MM-DD) is valid and before today
export function isBeforeToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const selected = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
}

// Format YYYYMMDD to Korean display date (e.g. 2026년 9월 27일 일요일)
export function formatKoreanDate(targetDt: string): string {
  if (!targetDt || targetDt.length !== 8) return '';
  const y = targetDt.slice(0, 4);
  const m = targetDt.slice(4, 6);
  const d = targetDt.slice(6, 8);
  const dateObj = new Date(`${y}-${m}-${d}T00:00:00`);
  
  const dayOfWeekNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayOfWeek = dayOfWeekNames[dateObj.getDay()];

  return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일 (${dayOfWeek})`;
}

// Numbers formatting (e.g., 1234567 -> 1,234,567)
export function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString('ko-KR');
}

// Currency formatting (e.g., 1845210000 -> 18억 4,521만원)
export function formatKoreanCurrency(amountStr: string | number): string {
  const num = typeof amountStr === 'string' ? parseInt(amountStr, 10) : amountStr;
  if (isNaN(num) || num === 0) return '0원';

  if (num >= 100000000) {
    const uk = Math.floor(num / 100000000);
    const man = Math.round((num % 100000000) / 10000);
    if (man === 0) return `${uk.toLocaleString('ko-KR')}억원`;
    return `${uk.toLocaleString('ko-KR')}억 ${man.toLocaleString('ko-KR')}만원`;
  } else if (num >= 10000) {
    const man = Math.floor(num / 10000);
    return `${man.toLocaleString('ko-KR')}만원`;
  }
  return `${num.toLocaleString('ko-KR')}원`;
}
