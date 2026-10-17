export type RevenueTrendItem = {
  month: string;
  revenue: number;
};

export type RevenueBySegmentItem = {
  customer_segment: string;
  revenue: number;
  units: number;
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
export type RevenueByProductItem={
  product:string;
  revenue:number;
  units:number;
}
export type TopProductItem = {
  product: string;
  revenue: number;
  units: number;
};

export type TopCustomerItem = {
  customer_id: string;
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
  revenue_by_segment?: RevenueBySegmentItem[];
  revenue_trend?: RevenueTrendItem[];
  profit_margin?: number | null;
  growth_rate?: number;
  total_customers?: number;
  top_customers?: TopCustomerItem[];
  upload_id?: string;

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
  profit_margin?: number | null;
  growth_rate?: number;
  total_customers?: number;
  total_orders?: number;
  total_revenue?: number;
  aov?: number;
  total_units?: number;
};