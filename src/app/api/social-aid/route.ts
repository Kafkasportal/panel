import { NextRequest } from "next/server";
import { fetchApplications } from "@/lib/supabase-service";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  socialAidApplicationSchema,
  socialAidApplicationQuerySchema,
} from "@/lib/validations/social-aid";
import {
  withApiMiddleware,
  createErrorResponse,
  createSuccessResponse,
  parseJsonBody,
  validateMethod,
  RateLimitPresets,
} from "@/lib/api-helpers";

async function handleGet(req: NextRequest) {
  const methodError = validateMethod(req, ["GET"]);
  if (methodError) return methodError;

  const searchParams = req.nextUrl.searchParams;

  const query = socialAidApplicationQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    durum: searchParams.get("durum"),
  });

  const result = await fetchApplications({
    page: Number(query.page),
    limit: Number(query.limit),
    durum: query.durum,
  });

  return createSuccessResponse(result);
}

async function handlePost(req: NextRequest) {
  const methodError = validateMethod(req, ["POST"]);
  if (methodError) return methodError;

  const bodyResult = await parseJsonBody(req);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const validatedData = socialAidApplicationSchema.parse(bodyResult.data);

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("social_aid_applications")
    .insert({
      beneficiary_id: validatedData.beneficiary_id,
      yardim_turu: validatedData.yardim_turu,
      talep_edilen_tutar: validatedData.talep_edilen_tutar,
      gerekce: validatedData.gerekce,
      durum: validatedData.durum || "beklemede",
      basvuru_tarihi: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return createErrorResponse(error, "Başvuru oluşturulamadı", 400);
  }

  return createSuccessResponse(data, 201);
}

export const GET = withApiMiddleware(handleGet, {
  defaultErrorMessage: "Başvurular getirilemedi",
  rateLimit: RateLimitPresets.lenient,
});

export const POST = withApiMiddleware(handlePost, {
  defaultErrorMessage: "Başvuru oluşturulamadı",
  rateLimit: RateLimitPresets.standard,
});
