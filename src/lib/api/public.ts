import { API_URL, apiClient } from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  PublicCategory,
  PublicCourse,
  PublicCourseDetail,
  PublicCoursesQuery,
  PublicMentor,
} from "@/types";

/** Yuklangan faylni to'liq havolaga aylantiradi */
export function fileUrl(
  folder: "images" | "videos" | "files",
  name: string | null | undefined,
): string | null {
  if (!name) return null;
  return `${API_URL.replace(/\/api\/v1$/, "")}/uploads/${folder}/${name}`;
}

export async function getPublicCourses(
  query: PublicCoursesQuery = {},
): Promise<PaginatedResponse<PublicCourse>> {
  const { data } = await apiClient.get<PaginatedResponse<PublicCourse>>(
    "/public/courses",
    { params: query },
  );
  return data;
}

export async function getPublicCourse(
  id: number,
): Promise<ApiResponse<PublicCourseDetail>> {
  const { data } = await apiClient.get<ApiResponse<PublicCourseDetail>>(
    `/public/courses/${id}`,
  );
  return data;
}

export async function getPublicCategories(): Promise<
  ApiResponse<PublicCategory[]>
> {
  const { data } =
    await apiClient.get<ApiResponse<PublicCategory[]>>("/public/categories");
  return data;
}

export async function getPublicMentors(): Promise<ApiResponse<PublicMentor[]>> {
  const { data } =
    await apiClient.get<ApiResponse<PublicMentor[]>>("/public/mentors");
  return data;
}
