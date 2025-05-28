import { PaymentCreateRequest } from 'mercadopago/dist/clients/payment/create/types';
import { Card } from 'mercadopago/dist/clients/payment/commonTypes';

export interface ExternalPaymentResponse {
  id: number;
  card: Card;
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

export type ExternalPaymentData = PaymentCreateRequest;
