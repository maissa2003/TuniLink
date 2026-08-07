import api from "./axios";

export interface Document {
  id: number;
  type: "CIN" | "PASSPORT" | "DIPLOMA" | "CV" | "BANK_RIB" | "CONTRACT" | "PAYSLIP" | "WORK_CERTIFICATE" | "LEAVE_APPROVAL";
  fileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
  employee: {
    id: number;
    fullName: string;
    employeeNumber: string;
  };
}


export const getEmployeeDocuments = async (employeeId: number) => {
  const res = await api.get<Document[]>(`/documents/employee/${employeeId}`);
  return res.data;
};

export const uploadDocument = async (employeeId: number, file: File, type: Document['type']) => {
  const formData = new FormData();
  formData.append('employeeId', employeeId.toString());
  formData.append('file', file);
  formData.append('type', type);

  const res = await api.post<Document>('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const downloadDocument = async (documentId: number) => {
  const res = await api.get(`/documents/download/${documentId}`, {
    responseType: 'blob',
  });
  return res.data;
};

export const deleteDocument = async (documentId: number) => {
  const res = await api.delete(`/documents/${documentId}`);
  return res.data;
};

export const getAllDocuments = async () => {
  const res = await api.get<Document[]>('/documents/all');
  return res.data;
};
