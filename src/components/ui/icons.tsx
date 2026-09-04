import Image from "next/image";

/**
 * Figma dan eksport qilingan assetlar (public/icons, public/images).
 *
 * Har bir ikonka dizayndagi TASHQI QUTI ichida turadi va ichki rasm o'z
 * o'lchamini saqlaydi — Figma da ham shunday: 24px quti ichida 17.5px vektor.
 * Shuning uchun `box` va `w`/`h` alohida beriladi.
 */
function FigmaIcon({
  src,
  w,
  h,
  box,
  className = "",
}: {
  src: string;
  w: number;
  h: number;
  /** Tashqi kvadrat quti (px) */
  box: number;
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${className}`}
      style={{ width: box, height: box }}
    >
      <Image src={src} alt="" width={w} height={h} aria-hidden />
    </span>
  );
}

/* ---------- Login sahifasi ---------- */

export const DeviceMobileIcon = () => (
  <FigmaIcon src="/icons/device-mobile.svg" w={9.5} h={13.5} box={16} />
);

export const EyeOffIcon = ({ dimmed = false }: { dimmed?: boolean }) => (
  <FigmaIcon
    src="/icons/eye-off.svg"
    w={13.5}
    h={13.5}
    box={16}
    className={`transition-opacity ${dimmed ? "opacity-40" : "opacity-100"}`}
  />
);

/* ---------- Sidebar ---------- */

export const SidebarCollapseIcon = () => (
  <FigmaIcon src="/icons/sidebar-collapse.svg" w={17.5} h={17.5} box={24} />
);

export const LayoutGridIcon = () => (
  <FigmaIcon src="/icons/layout-grid.svg" w={17.5} h={17.5} box={24} />
);

export const UsersIcon = () => (
  <FigmaIcon src="/icons/users.svg" w={19.5} h={19.5} box={24} />
);

export const BookIcon = () => (
  <FigmaIcon src="/icons/book-2.svg" w={15.5} h={17.5} box={24} />
);

/* ---------- Topbar ---------- */

export const BadgeCheckIcon = () => (
  <FigmaIcon src="/icons/badge-check.svg" w={22} h={22} box={24} />
);

export const BellIcon = () => (
  <FigmaIcon src="/icons/bell.svg" w={17.5} h={19.5} box={24} />
);

export const SettingsIcon = () => (
  <FigmaIcon src="/icons/settings-2.svg" w={19.5} h={21.5} box={24} />
);

/* chevron-down dizaynda uch xil o'lchamda uchraydi */

export const ChevronDown18 = ({ className = "" }: { className?: string }) => (
  <FigmaIcon
    src="/icons/chevron-down-18.svg"
    w={11}
    h={6.5}
    box={18}
    className={className}
  />
);

export const ChevronDown16 = ({ className = "" }: { className?: string }) => (
  <FigmaIcon
    src="/icons/chevron-down-16.svg"
    w={9.5}
    h={5.5}
    box={16}
    className={className}
  />
);

export const ChevronDown14 = ({ className = "" }: { className?: string }) => (
  <FigmaIcon
    src="/icons/chevron-down-14.svg"
    w={9}
    h={5.5}
    box={14}
    className={className}
  />
);

/* ---------- Jadval ---------- */

export const CirclePlusIcon = () => (
  <FigmaIcon src="/icons/circle-plus.svg" w={19.5} h={19.5} box={24} />
);

export const SearchIcon = () => (
  <FigmaIcon src="/icons/search.svg" w={18.75} h={18.75} box={24} />
);

export const FilterIcon = () => (
  <FigmaIcon src="/icons/filter.svg" w={10.67} h={10.67} box={16} />
);

export const CaretSortIcon = () => (
  <FigmaIcon src="/icons/caret-sort.svg" w={8.25} h={4.97} box={12} />
);

export const ChevronDownSm = ({ className = "" }: { className?: string }) => (
  <FigmaIcon
    src="/icons/chevron-down-sm.svg"
    w={9.33}
    h={5.33}
    box={16}
    className={className}
  />
);

/** Butun tugma sifatida eksport qilingan — ichki o'lchami 18x18 */
export const EditPencilIcon = () => (
  <FigmaIcon src="/icons/edit-pencil.svg" w={18} h={18} box={18} />
);

export const TrashIcon = () => (
  <FigmaIcon src="/icons/trash.svg" w={18} h={18} box={18} />
);

/* ---------- Boshqa ---------- */

export const DotIcon = () => (
  <Image src="/icons/dot.svg" alt="" width={8} height={8} aria-hidden />
);

export const UserIcon = () => (
  <FigmaIcon src="/icons/user.svg" w={12} h={18} box={24} />
);

export function ThemedLogo({ className = "" }: { className?: string }) {
  return <Logo className={className} />;
}

export function Logo({
  variant = "dark",
  className = "",
}: {
  /** "dark" — oq fon uchun (login), "light" — qora sidebar uchun */
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <Image
      src={variant === "light" ? "/images/logo-white.svg" : "/images/logo.svg"}
      alt="IT Live Academy"
      width={120}
      height={33}
      style={{ width: "auto", height: "auto" }}
      className={className}
      priority
    />
  );
}
