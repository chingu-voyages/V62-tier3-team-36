export type RevenueTrendItem = {
  month: string;
  revenue: number;
};

export type RevenueByCategoryItem = {
  category: string;
  revenue: number;
  units: number;
};

export type RevenueByRegionItem = {
  region: string;
  revenue: number;
  units: number;
};

export type TopProductItem = {
  product: string;
  revenue: number;
  units: number;
};

export type UploadRecord = {
  order_id: string;
  order_date: string;
  product: string;
  category: string;
  region: string;
  units: number;
  revenue: number;
};

export type UploadAnalysis = {
  total_revenue?: number;
  total_units?: number;
  total_orders?: number;
  aov?: number;
  growth?: number;
  top_products?: TopProductItem[];
  revenue_by_category?: RevenueByCategoryItem[];
  revenue_by_region?: RevenueByRegionItem[];
  revenue_trend?: RevenueTrendItem[];
};

export type UploadDetail = {
  upload_id: string;
  file_name: string;
  status: string;
  uploaded_at: string;
  valid_rows: number;
  invalid_rows: number;
  row_errors: Array<{ row: number; error: string }>;
  analysis: UploadAnalysis | null;
  records?: UploadRecord[];
};