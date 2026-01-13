import { NextRequest } from "next/server";
import { fetchDocuments, uploadDocument } from "@/lib/supabase-service";
import { documentQuerySchema } from "@/lib/validations/documents";
import {
  withApiMiddleware,
  createErrorResponse,
  createSuccessResponse,
  validateMethod,
  RateLimitPresets,
} from "@/lib/api-helpers";

async function handleGet(req: NextRequest) {
  const methodError = validateMethod(req, ["GET"]);
  if (methodError) return methodError;

  const searchParams = req.nextUrl.searchParams;

  const query = documentQuerySchema.parse({
    beneficiary_id: searchParams.get("beneficiary_id"),
  });

  if (!query.beneficiary_id) {
    return createErrorResponse(
      new Error("Beneficiary ID gerekli"),
      "Beneficiary ID gerekli",
      400,
    );
  }

  const result = await fetchDocuments(query.beneficiary_id);

  return createSuccessResponse(result);
}

async function handlePost(req: NextRequest) {
  const methodError = validateMethod(req, ["POST"]);
  if (methodError) return methodError;

  const formData = await req.formData();

  const file = formData.get("file") as File;
  const beneficiaryId = formData.get("beneficiary_id") as string;
  const documentType = formData.get("document_type") as string;

  if (!file || !beneficiaryId || !documentType) {
    return createErrorResponse(
      new Error("Dosya, beneficiary ID ve document type gerekli"),
      "Dosya, beneficiary ID ve document type gerekli",
      400,
    );
  }

  const result = await uploadDocument(file, beneficiaryId, documentType as any);

  return createSuccessResponse(result, 201);
}

export const GET = withApiMiddleware(handleGet, {
  defaultErrorMessage: "Dokümanlar getirilemedi",
  rateLimit: RateLimitPresets.lenient,
});

export const POST = withApiMiddleware(handlePost, {
  defaultErrorMessage: "Doküman yüklenemedi",
  rateLimit: RateLimitPresets.standard,
});
