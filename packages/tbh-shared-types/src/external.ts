/**
 * External payment response from ML API
 * This is poorly defined as It's used mostly for storing and type discovery
 */
export interface ExternalPaymentResponse {
  id: number;
  card: any;
  order: Record<string, unknown>;
  payer: {
    id: string;
    type: string | null;
    email: string;
    phone: {
      number: string | null;
      area_code: string | null;
      extension: string | null;
    };
    last_name: string | null;
    first_name: string | null;
    entity_type: string | null;
    identification: {
      type: string;
      number: string;
    };
  };
  taxes: {
    type: string;
    value: number;
  }[];
  status: string;

  issuer_id: string;
  net_amount: number;
  currency_id: string;
  description: string | null;
  fee_details: {
    type: string;
    amount: number;
    fee_payer: string;
  }[];
  date_created: string;
  installments: number;
  taxes_amount: number;
  date_approved: string;
  status_detail: string;
  payment_method: Record<string, unknown>;
  charges_details: {
    id: string;
    name: string;
    type: string;
    amounts: {
      original: number;
      refunded: number;
    };
    accounts: {
      to: string;
      from: string;
    };
    metadata: {
      reason: string;
      source: string;
    };
    client_id: number;
    [key: string]: unknown;
  }[];
  date_last_updated: string;
  transaction_amount: number;
}

/**
 * Copied from mercadopago@2.7.0 npm package
 *
 * Since this would be consumed by client too, It's best to create a type copy here
 * for just the needed types.
 */
export declare type PaymentCreateRequest = {
  additional_info?: any;
  application_fee?: number;
  binary_mode?: boolean;
  callback_url?: string;
  campaign_id?: string;
  capture?: boolean;
  coupon_amount?: number;
  coupon_code?: string;
  date_of_expiration?: string;
  description?: string;
  differential_pricing_id?: number;
  external_reference?: string;
  installments?: number;
  issuer_id?: number;
  metadata?: any;
  notification_url?: string;
  payment_method_id?: string;
  payment_method?: any;
  statement_descriptor?: string;
  token?: string;
  transaction_amount?: number;
  three_d_secure_mode?: string;
  payer?: any;
  forward_data?: any;
  point_of_interaction?: any;
  sponsor_id?: number;
  transaction_details?: any;
};
