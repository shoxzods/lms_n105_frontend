"use client";

import { useState, type FormEvent } from "react";

const ADMIN_TELEGRAM = process.env.NEXT_PUBLIC_ADMIN_TELEGRAM ?? "";
const PHONE_PATTERN = /^\+998\d{9}$/;

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const nameInvalid = touched && fullName.trim().length < 3;
  const phoneInvalid = touched && !PHONE_PATTERN.test(phone);
  const messageInvalid = touched && message.trim().length < 5;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (fullName.trim().length < 3) return;
    if (!PHONE_PATTERN.test(phone)) return;
    if (message.trim().length < 5) return;

    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-[#ecfdf3] text-3xl">
          ✓
        </span>

        <h3 className="text-xl font-bold text-page-fg">
          Murojaatingiz qabul qilindi
        </h3>

        <p className="max-w-[380px] text-sm leading-5 text-ink-500">
          Tezroq javob olish uchun bizga Telegram orqali ham yozing:
        </p>

        <a
          href={`https://t.me/${ADMIN_TELEGRAM}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
        >
          @{ADMIN_TELEGRAM}
        </a>

        <button
          type="button"
          onClick={() => {
            setSent(false);
            setFullName("");
            setPhone("+998");
            setMessage("");
            setTouched(false);
          }}
          className="cursor-pointer text-sm font-medium text-ink-500 hover:text-page-fg"
        >
          Yana yozish
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-[380px] flex-col gap-4"
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-page-fg">F.I.SH</span>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Kiriting"
          className={`h-10 rounded-md border bg-card px-3.5 text-sm text-page-fg outline-none transition-colors focus:border-brand-500 ${
            nameInvalid ? "border-danger-500" : "border-line"
          }`}
        />
        {nameInvalid && (
          <span className="text-xs text-danger-500">Kamida 3 ta belgi</span>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-page-fg">
          Telefon raqamingiz
        </span>

        <span
          className={`flex h-10 items-center rounded-md border bg-card transition-colors focus-within:border-brand-500 ${
            phoneInvalid ? "border-danger-500" : "border-line"
          }`}
        >
          <span className="flex h-full items-center border-r border-line px-3 text-sm font-medium text-ink-500">
            UZ
          </span>

          <input
            inputMode="tel"
            value={phone}
            onChange={(e) => {
              const digits = e.target.value
                .replace(/\D/g, "")
                .replace(/^998/, "");
              setPhone("+998" + digits.slice(0, 9));
            }}
            placeholder="+998"
            className="h-full flex-1 bg-transparent px-3.5 text-sm text-page-fg outline-none"
          />
        </span>

        {phoneInvalid && (
          <span className="text-xs text-danger-500">
            Telefon raqam to&rsquo;liq emas
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-page-fg">Xabar</span>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`resize-none rounded-md border bg-card px-3.5 py-2.5 text-sm text-page-fg outline-none transition-colors focus:border-brand-500 ${
            messageInvalid ? "border-danger-500" : "border-line"
          }`}
        />
        {messageInvalid && (
          <span className="text-xs text-danger-500">
            Xabar juda qisqa
          </span>
        )}
      </label>

      <button
        type="submit"
        className="mt-2 h-10 cursor-pointer rounded-md bg-brand-500 text-sm font-medium text-white transition-colors hover:bg-brand-600"
      >
        Yuborish
      </button>
    </form>
  );
}
