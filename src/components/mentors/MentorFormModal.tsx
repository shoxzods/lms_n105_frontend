"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FileInput } from "@/components/ui/FileInput";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { mentorProfileOf } from "@/api/mentors";
import type { Mentor } from "@/types";

const PHONE_PATTERN = /^\+998\d{9}$/;

export function MentorFormModal({
  open,
  mentor,
  isPending,
  errorMessage,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mentor?: Mentor | null;
  isPending: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (form: FormData) => void;
}) {
  const isEdit = Boolean(mentor);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [job, setJob] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [telegram, setTelegram] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;

    const profile = mentor ? mentorProfileOf(mentor) : null;

    setFullName(mentor?.full_name ?? "");
    setPhone(mentor?.phone ?? "+998");
    setEmail(mentor?.email ?? "");
    setPassword("");
    setJob(profile?.job ?? "");
    setExperience(profile?.experience != null ? String(profile.experience) : "");
    setDescription(profile?.description ?? "");
    setTelegram(profile?.telegram ?? "");
    setFile(null);
    setTouched(false);
  }, [open, mentor]);

  const nameInvalid = touched && fullName.trim().length < 3;
  const phoneInvalid = touched && !PHONE_PATTERN.test(phone);
  const emailInvalid = touched && !email.includes("@");
  const passwordInvalid = touched && !isEdit && password.length < 6;

  /* Backend ijtimoiy tarmoq maydonlarini `@IsUrl()` bilan tekshiradi */
  const telegramInvalid =
    touched && telegram.trim().length > 0 && !telegram.startsWith("http");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (fullName.trim().length < 3) return;
    if (!PHONE_PATTERN.test(phone)) return;
    if (!email.includes("@")) return;
    if (!isEdit && password.length < 6) return;
    if (telegramInvalid) return;

    const form = new FormData();
    form.append("full_name", fullName.trim());
    form.append("phone", phone);
    form.append("email", email.trim());

    /* Tahrirlashda parol maydoni backendda umuman yo'q */
    if (!isEdit) form.append("password", password);

    if (job.trim()) form.append("job", job.trim());
    if (experience) form.append("experience", experience);
    if (description.trim()) form.append("description", description.trim());
    if (telegram.trim()) form.append("telegram", telegram.trim());
    if (file) form.append("file", file);

    onSubmit(form);
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "Mentorni tahrirlash" : "Mentor qo'shish"}
      onClose={onClose}
      width={480}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="mentor-name"
          label="To&rsquo;liq ism"
          requiredMark
          placeholder="Ism Familiya"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={nameInvalid ? "Kamida 3 ta belgi" : null}
        />

        <Input
          id="mentor-phone"
          label="Telefon raqami"
          requiredMark
          inputMode="tel"
          placeholder="+998 90 123 45 67"
          value={phone}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").replace(/^998/, "");
            setPhone("+998" + digits.slice(0, 9));
          }}
          error={phoneInvalid ? "Telefon raqam to'liq emas" : null}
        />

        <Input
          id="mentor-email"
          label="Email"
          requiredMark
          type="email"
          placeholder="mentor@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailInvalid ? "Email noto'g'ri" : null}
        />

        {!isEdit && (
          <Input
            id="mentor-password"
            label="Parol"
            requiredMark
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordInvalid ? "Kamida 6 ta belgi" : null}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="mentor-job"
            label="Kasbi"
            placeholder="Frontend dasturchi"
            value={job}
            onChange={(e) => setJob(e.target.value)}
          />

          <Input
            id="mentor-experience"
            label="Tajribasi (yil)"
            inputMode="numeric"
            placeholder="5"
            value={experience}
            onChange={(e) => setExperience(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <Input
          id="mentor-telegram"
          label="Telegram havolasi"
          placeholder="https://t.me/username"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          error={telegramInvalid ? "To'liq havola kiriting: https://t.me/..." : null}
        />

        <Textarea
          id="mentor-description"
          label="Qisqacha ma&rsquo;lumot"
          placeholder="Kiriting"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <FileInput
          id="mentor-file"
          label={isEdit ? "Rasmni almashtirish" : "Rasm"}
          accept="image/*"
          onChange={(files) => setFile(files?.[0] ?? null)}
        />

        {errorMessage && (
          <p className="text-sm font-medium text-danger-500">{errorMessage}</p>
        )}

        <div className="flex justify-start pt-1">
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? "Saqlanmoqda..." : "✓ Saqlash"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
