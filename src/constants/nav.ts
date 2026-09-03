import type { ComponentType } from "react";
import { BookIcon, LayoutGridIcon, UsersIcon } from "@/components/ui/icons";
import type { UserRole } from "@/types";

export interface NavChild {
  label: string;
  href: string;
  roles?: UserRole[];
  /** Backend moduli yoki sahifa hali yozilmagan — bosilmaydi */
  disabled?: boolean;
}

export interface NavItem {
  label: string;
  icon: ComponentType;
  href?: string;
  children?: NavChild[];
  roles?: UserRole[];
  disabled?: boolean;
}

const ADMINS: UserRole[] = ["SUPERADMIN", "ADMIN"];

/**
 * Figma "Sidebar admin" (34:812) — guruhlangan menyu.
 *
 * Bu yerda faqat schema.prisma da MODELI BOR bo'limlar turadi.
 * Dizayndagi "Izohlar" olib tashlangan — unga mos model yo'q.
 */
const ADMIN_NAV: NavItem[] = [
  {
    label: "Asosiy",
    icon: LayoutGridIcon,
    href: "/dashboard",
  },
  {
    label: "Foydalanuvchilar",
    icon: UsersIcon,
    children: [
      { label: "Administratorlar", href: "/users/admins" },
      { label: "Mentorlar", href: "/users/mentors" },
      { label: "Assistentlar", href: "/users/assistants" },
      { label: "Studentlar", href: "/users/students" },
    ],
  },
  {
    label: "To‘lovlar",
    icon: BookIcon,
    href: "/payments",
  },
  {
    label: "Materiallar",
    icon: BookIcon,
    children: [
      { label: "Barcha kurslar", href: "/all-courses" },
      { label: "Kategoriyalar", href: "/categories" },
      { label: "Savol-javoblar", href: "/chats" },
      { label: "Natijalar", href: "/results" },
    ],
  },
];

/**
 * Figma "Admin components" — mentor sidebari tekis, to'rtta band:
 * Asosiy · Kurslar · Vazifalar · Testlar
 *
 * Sahifalar hali qurilmagan, backendda ham mentorga tegishli
 * endpointlar yo'q — shuning uchun `disabled`.
 */
const MENTOR_NAV: NavItem[] = [
  { label: "Asosiy", icon: LayoutGridIcon, href: "/dashboard" },
  { label: "Kurslar", icon: BookIcon, href: "/all-courses" },
  { label: "Savol-javoblar", icon: BookIcon, href: "/chats" },
  { label: "Natijalar", icon: BookIcon, href: "/results" },
];

/**
 * Assistent va student uchun dizayn hali yo'q — hozircha faqat
 * "Asosiy". Ekranlari kelganda to'ldiriladi.
 */
const MINIMAL_NAV: NavItem[] = [
  { label: "Mening kurslarim", icon: BookIcon, href: "/my-courses" },
  { label: "Savol-javoblar", icon: BookIcon, href: "/chats" },
];

export function navItemsForRole(role: UserRole | undefined): NavItem[] {
  if (!role) return [];

  if (ADMINS.includes(role)) return ADMIN_NAV;
  if (role === "TEACHER") return MENTOR_NAV;

  return MINIMAL_NAV;
}
