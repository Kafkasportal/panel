import { NextRequest } from "next/server"
import { fetchMembers, createMember } from "@/lib/supabase-service"
import { memberSchema, memberQuerySchema } from "@/lib/validations/members"
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

  const query = memberQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    search: searchParams.get("search"),
  })

  const result = await fetchMembers({
    page: Number(query.page),
    limit: Number(query.limit),
    search: query.search,
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

  const validatedData = memberSchema.parse(bodyResult.data)
  const result = await createMember(validatedData)

  return createSuccessResponse(result, 201)
}

export const GET = withApiMiddleware(handleGet, {
  defaultErrorMessage: "Üyeler getirilemedi",
  rateLimit: RateLimitPresets.lenient,
})

export const POST = withApiMiddleware(handlePost, {
  defaultErrorMessage: "Üye oluşturulamadı",
  rateLimit: RateLimitPresets.standard,
})
