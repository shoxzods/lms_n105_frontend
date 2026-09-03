"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { useMe, useUpdateMe } from "@/hooks/useMe";
import { apiErrorMessage } from "@/lib/apiError";
import { avatarUrl } from "@/lib/format";

type Tab = "personal" | "security" | "notifications";

const TABS: [Tab, string][] = [
  ["personal", "Shaxsiy ma'lumotlar"],
  ["security", "Xavfsizlik"],
  ["notifications", "Bildirishnomalar"],
];

const PHONE_PATTERN = /^\+998\d{9}$/;

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 rounded-xl border border-line bg-card p-6">
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("personal");
  const [success, setSuccess] = useState<string | null>(null);

  const { me, tokenUser, isLoading, isError, error, canFetch } = useMe();
  const update = useUpdateMe();

  /* --- Shaxsiy ma'lumotlar --- */
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setFullName(me?.full_name ?? tokenUser?.full_name ?? "");
    setPhone(me?.phone ?? "");
    setEmail(me?.email ?? "");
  }, [me, tokenUser]);

  const nameInvalid = touched && fullName.trim().length < 3;
  const phoneInvalid = touched && !PHONE_PATTERN.test(phone);

  function savePersonal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (fullName.trim().length < 3) return;
    if (!PHONE_PATTERN.test(phone)) return;

    update.mutate(
      {
        full_name: fullName.trim(),
        phone,
        ...(email.trim() ? { email: email.trim() } : {}),
      },
      {
        onSuccess: () => {
          update.reset();
          setSuccess("Ma'lumotlar saqlandi");
        },
      },
    );
  }

  const avatar = avatarUrl(me?.file ?? null);

  return (
    <>
      <PageHeader title="Profil sozlamalari" breadcrumb={[]} />

      <div className="flex w-full max-w-[1600px] flex-col gap-6 px-6 pb-8 lg:flex-row">
        {/* Chapdagi tablar */}
        <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto lg:w-[200px] lg:flex-col">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`cursor-pointer whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-card text-page-fg shadow-sm"
                  : "text-ink-500 hover:bg-card"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "personal" && (
          <Card>
            {isError && (
              <p className="mb-4 text-sm font-medium text-danger-500">
                {apiErrorMessage(error)}
              </p>
            )}

            {!canFetch && (
              <p className="mb-4 text-sm font-medium text-ink-500">
                Sizning rolingiz uchun profil ma&rsquo;lumotini olish
                endpointi hali yo&rsquo;q — tokendagi ism ko&rsquo;rsatilyapti.
              </p>
            )}

            <form onSubmit={savePersonal} className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt=""
                    width={56}
                    height={56}
                    unoptimized
                    className="size-14 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-14 items-center justify-center rounded-full bg-hover text-lg font-semibold text-ink-500">
                    {(fullName || "?").charAt(0).toUpperCase()}
                  </span>
                )}

                {/*
                  Rasmni almashtirish/o'chirish uchun backendda yo'l yo'q:
                  `PATCH /users/:id` da fayl qabul qilinmaydi.
                */}
                <button
                  type="button"
                  disabled
                  title="Rasm almashtirish uchun backendda endpoint yo'q"
                  className="cursor-not-allowed rounded-lg bg-table-head px-4 py-2 text-sm font-medium text-ink-500"
                >
                  O&rsquo;chirish
                </button>
              </div>

              <Input
                id="me-name"
                label="To&rsquo;liq ism"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isLoading ? "Yuklanmoqda..." : "Ism Familiya"}
                error={nameInvalid ? "Kamida 3 ta belgi" : null}
              />

              <Input
                id="me-phone"
                label="Telefon"
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value
                    .replace(/\D/g, "")
                    .replace(/^998/, "");
                  setPhone("+998" + digits.slice(0, 9));
                }}
                placeholder="+998 91 791 11 22"
                error={phoneInvalid ? "Telefon raqam to'liq emas" : null}
              />

              <Input
                id="me-email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />

              {update.isError && (
                <p className="text-sm font-medium text-danger-500">
                  {apiErrorMessage(update.error)}
                </p>
              )}

              <div className="flex justify-start">
                <Button
                  type="submit"
                  disabled={update.isPending}
                  className="min-w-[120px]"
                >
                  {update.isPending ? "..." : "✓ Saqlash"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {tab === "security" && <SecurityTab />}

        {tab === "notifications" && <NotificationsTab />}
      </div>

      <SuccessDialog
        open={success !== null}
        message={success ?? ""}
        onClose={() => setSuccess(null)}
      />
    </>
  );
}

/* ==================== Xavfsizlik ==================== */

/**
 * DIQQAT: backendda parol almashtirish endpointi YO'Q.
 * `UpdateAdminDto` `password` ni ataylab chiqarib tashlaydi
 * (`OmitType(CreateAdminDto, ["password"])`), `auth` modulida ham
 * bunday yo'l yo'q. Forma tayyor — endpoint qo'shilishi bilan ulanadi.
 */
function SecurityTab() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState(false);

  const nextInvalid = touched && next.length < 6;
  const confirmInvalid = touched && confirm !== next;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (!current || next.length < 6 || confirm !== next) return;

    // TODO: PATCH /auth/change-password — backend tayyor bo'lgach
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          id="pass-current"
          label="Joriy parol"
          type="password"
          placeholder="••••••••"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          error={touched && !current ? "Joriy parolni kiriting" : null}
        />

        <Input
          id="pass-new"
          label="Yangi parol"
          type="password"
          placeholder="••••••••"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          error={nextInvalid ? "Kamida 6 ta belgi" : null}
        />

        <Input
          id="pass-confirm"
          label="Yangi parolni tasdiqlang"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={confirmInvalid ? "Parollar mos kelmadi" : null}
        />

        <div className="flex justify-start">
          <Button type="submit" className="min-w-[120px]">
            ✓ Saqlash
          </Button>
        </div>
      </form>
    </Card>
  );
}

/* ==================== Bildirishnomalar ==================== */

/**
 * DIQQAT: `schema.prisma` da bildirishnoma sozlamasi uchun ustun yo'q.
 * Tanlov brauzerda saqlanadi — serverga yuborilmaydi.
 */
function NotificationsTab() {
  const [enabled, setEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem("lms_email_notify") === "1");
    } catch {
      // brauzer ruxsat bermasa — o'chiq holicha qoladi
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      localStorage.setItem("lms_email_notify", enabled ? "1" : "0");
    } catch {
      // saqlab bo'lmasa ham ko'rinish o'zgaradi
    }

    setSaved(true);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <h2 className="text-base font-bold text-page-fg">
          Pochta bildirishnomalari
        </h2>

        <label className="flex cursor-pointer items-center gap-3">
          <span
            onClick={() => setEnabled((v) => !v)}
            className={`relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              enabled ? "bg-brand-500" : "bg-hover"
            }`}
          >
            <span
              className={`absolute size-4 rounded-full bg-white transition-transform ${
                enabled ? "translate-x-4.5" : "translate-x-0.5"
              }`}
            />
          </span>

          <span className="text-sm font-medium text-page-fg">
            Bildirishnomalarni qabul qilish
          </span>
        </label>

        <p className="text-xs text-ink-500">
          Bu sozlama hozircha faqat shu brauzerda saqlanadi — bazada
          bildirishnoma ustuni yo&rsquo;q.
        </p>

        <div className="flex justify-start">
          <Button type="submit" className="min-w-[120px]">
            ✓ Saqlash
          </Button>
        </div>

        {saved && (
          <p className="text-sm font-medium text-[#027a48]">Saqlandi</p>
        )}
      </form>
    </Card>
  );
}
