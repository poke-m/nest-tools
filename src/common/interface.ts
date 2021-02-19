/**
 * response entity
 */
export interface ResponseEntity<T> {
  data?: T;
  code?: number;
  errorCode?: string;
  message?: string;
  requestId?: string;
  timestamp?: number;
}

/**
 * http code status info
 */
export interface StatusInfo {
  zh: string;
  en: string;
  code: number;
  errorCode: string;
}

/**
 * http code status options
 */
export interface HttpStatusOptions {
  language?: 'zh' | 'en';
  status?: Map<number, StatusInfo>;
}
