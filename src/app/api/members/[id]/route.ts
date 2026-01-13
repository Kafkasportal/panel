import { NextRequest } from "next/server"
import { fetchMember, updateMember, deleteMember } from "@/lib/supabase-service"
import { memberUpdateSchema } from "@/lib/validations/members"
import {
  withProtectedApiParams,
  createSuccessResponse,
  createErrorResponse,
  parseJsonBody,
  RateLimitPresets,
} from "@/lib/api-helpers"

async function handleGet(
  _req: NextRequest,
  _user: { id: string; email: string; role: string },
  params: Promise<{ id: string }>
) {
  const { id: idParam } = await params
  const id = Number(idParam)

  if (isNaN(id)) {
    return createErrorResponse(
      new Error("Invalid member ID"),
      "Geçersiz üye ID",
      400
    )
  }

  const result = await fetchMember(id)

  if (!result) {
    return createErrorResponse(
      new Error("Member not found"),
      "Üye bulunamadı",
      404
    )
  }

  return createSuccessResponse(result)
}

async function handlePut(
  req: NextRequest,
  _user: { id: string; email: string; role: string },
  params: Promise<{ id: string }>
) {
  const { id: idParam } = await params
  const id = Number(idParam)

  if (isNaN(id)) {
    return createErrorResponse(
      new Error("Invalid member ID"),
      "Geçersiz üye ID",
      400
    )
  }

  const bodyResult = await parseJsonBody(req)
  if (!bodyResult.success) {
    return bodyResult.error
  }

  const validatedData = memberUpdateSchema.parse(bodyResult.data)
  const result = await updateMember(id, validatedData)

  if (!result) {
    return createErrorResponse(
      new Error("Member not found"),
      "Üye bulunamadı",
      404
    )
  }

  return createSuccessResponse(result)
}

async function handleDelete(
  _req: NextRequest,
  _user: { id: string; email: string; role: string },
  params: Promise<{ id: string }>
) {
  const { id: idParam } = await params
  const id = Number(idParam)

  if (isNaN(id)) {
    return createErrorResponse(
      new Error("Invalid member ID"),
      "Geçersiz üye ID",
      400
    )
  }

  await deleteMember(id)

  return createSuccessResponse({ message: "Üye başarıyla silindi" })
}

export const GET = withProtectedApiParams(handleGet, {
  defaultErrorMessage: "Üye getirilemedi",
  rateLimit: RateLimitPresets.lenient,
  requiredPermissions: ["members.view"],
})

export const PUT = withProtectedApiParams(handlePut, {
  defaultErrorMessage: "Üye güncellenemedi",
  rateLimit: RateLimitPresets.standard,
  requiredPermissions: ["members.edit"],
})

export const DELETE = withProtectedApiParams(handleDelete, {
  defaultErrorMessage: "Üye silinemedi",
  rateLimit: RateLimitPresets.standard,
  requiredPermissions: ["members.delete"],
})
