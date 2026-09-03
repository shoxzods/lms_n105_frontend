"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { apiErrorMessage } from "@/lib/apiError";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isPending?: boolean;
  error?: unknown;
  /** Tahrirlash rejimi uchun — oldindan to'ldirilgan nom */
  initialName?: string;
}

export function CategoryFormModal({
  open,
  onClose,
  onSubmit,
  isPending,
  error,
  initialName = "",
}: CategoryFormModalProps) {
  const isEdit = initialName !== "";
  const [name, setName] = useState(initialName);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setTouched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const nameInvalid = touched && name.trim().length < 2;

  function handleClose() {
    setTouched(false);
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (name.trim().length < 2) return;
    onSubmit(name.trim());
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "Tahrirlash" : "Qo'shish"}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="category_name"
          label="Kategoriya nomi"
          placeholder="Kiriting"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameInvalid ? "Kamida 2 ta belgi kiriting" : null}
          autoFocus
        />

        {error ? (
          <p className="text-sm font-medium text-danger-500">
            {apiErrorMessage(error)}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isPending}
          className="self-start min-w-[120px]"
          leftIcon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
        >
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </form>
    </Modal>
  );
}
