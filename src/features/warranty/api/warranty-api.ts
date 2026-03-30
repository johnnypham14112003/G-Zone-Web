import api from '@/lib/axios-api';

export interface WarrantyClaimRequest {
  issueDescription: string;
  customerId: string;
  orderDetailId: string;
}

export interface WarrantyClaimUpdateRequest {
  claimStatus?: string;
  resolutionNotes?: string;
  repairCost?: number;
  processedByStaffId?: string;
  status?: string;
}

export interface WarrantyClaimResponse {
  claimId: string;
  claimNumber: string;
  issueDescription: string;
  claimStatus: string;
  claimDate: string;
  resolutionDate: string | null;
  resolutionNotes: string | null;
  repairCost: number;
  createdAt: string;
  updatedAt: string | null;
  status: string;
  customerId: string;
  processedByStaffId: string | null;
  orderDetailId: string;
}

export const warrantyApi = {
  createClaim: async (data: WarrantyClaimRequest) => {
    const payload = {
      "issue-description": data.issueDescription,
      "customer-id": data.customerId,
      "order-detail-id": data.orderDetailId
    };
    const response = await api.post<{ statusCode: number; message: string; data: WarrantyClaimResponse }>('/warranty-claims', payload);
    return response.data;
  },

  getClaims: async (params?: { pageNumber?: number; pageSize?: number; customerId?: string }) => {
    const queryParams: any = {};
    if (params) {
      if (params.pageNumber !== undefined) queryParams.pageNumber = params.pageNumber;
      if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize;
      if (params.customerId !== undefined) queryParams.customerId = params.customerId;
    }
    const response = await api.get('/warranty-claims', { params: queryParams });
    const payload = response.data?.data;
    
    // Convert from KebabCase to CamelCase
    const mapClaimFromBackend = (item: any): WarrantyClaimResponse => ({
      claimId: item["claim-id"],
      claimNumber: item["claim-number"],
      issueDescription: item["issue-description"],
      claimStatus: item["claim-status"],
      claimDate: item["claim-date"],
      resolutionDate: item["resolution-date"],
      resolutionNotes: item["resolution-notes"],
      repairCost: item["repair-cost"] || 0,
      createdAt: item["created-at"],
      updatedAt: item["updated-at"],
      status: item.status,
      customerId: item["customer-id"],
      processedByStaffId: item["processed-by-staff-id"],
      orderDetailId: item["order-detail-id"]
    });

    return {
      statusCode: response.data["status-code"] || response.data.statusCode,
      message: response.data.message,
      data: {
        dataList: (payload?.["data-list"] || []).map(mapClaimFromBackend),
        totalCount: payload?.["total-count"] || 0,
        pageIndex: payload?.["page-index"] || params?.pageNumber || 1,
        pageSize: payload?.["page-size"] || params?.pageSize || 10
      }
    };
  },

  updateClaim: async (id: string, data: WarrantyClaimUpdateRequest) => {
    const payload = {
      "claim-status": data.claimStatus,
      "resolution-notes": data.resolutionNotes,
      "repair-cost": data.repairCost,
      "processed-by-staff-id": data.processedByStaffId,
      status: data.status
    };
    const response = await api.put<{ statusCode: number; message: string; data: WarrantyClaimResponse }>(`/warranty-claims/${id}`, payload);
    return response.data;
  }
};
