import { NextRequest } from "next/server"
import { fetchDonations, createDonation } from "@/lib/supabase-service"
import { donationSchema, donationQuerySchema } from "@/lib/validations/donations"
import {
  withApiMiddleware,
  createSuccessResponse,
  parseJsonBody,
  validateMethod,
  RateLimitPresets,
} from "@/lib/api-helpers"

async function handleGet(req: NextRequest) {
  const methodError = validateMethod(req, ["GET"])
  if (methodError) return methodError

  const searchParams = req.nextUrl.searchParams

  const query = donationQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    search: searchParams.get("search"),
    amac: searchParams.get("amac"),
  })

  const result = await fetchDonations({
    page: Number(query.page),
    limit: Number(query.limit),
    search: query.search,
    amac: query.amac,
  })

  return createSuccessResponse(result)
}

async function handlePost(req: NextRequest) {
  const methodError = validateMethod(req, ["POST"])
  if (methodError) return methodError

  const bodyResult = await parseJsonBody(req)
  if (!bodyResult.success) {
    return bodyResult.error
  }

  const validatedData = donationSchema.parse(bodyResult.data)
  const result = await createDonation(validatedData)

  return createSuccessResponse(result, 201)
}

export const GET = withApiMiddleware(handleGet, {
  defaultErrorMessage: "Bağışlar getirilemedi",
  rateLimit: RateLimitPresets.lenient,
})

export const POST = withApiMiddleware(handlePost, {
  defaultErrorMessage: "Bağış oluşturulamadı",
  rateLimit: RateLimitPresets.standard,
})
