import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { ContactForm } from "@/components/site/ContactForm";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "@/constants/contact";

export const metadata: Metadata = {
  title: "Bog‘lanish — IT Live Academy",
  description: "IT Live Academy bilan bog‘lanish",
};

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.8a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3 6l9 6 9-6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

const CARDS = [
  { icon: <PhoneIcon />, title: "Telefon", value: CONTACT_PHONE },
  { icon: <MailIcon />, title: "Elektron pochta", value: CONTACT_EMAIL },
  { icon: <PinIcon />, title: "Manzil", value: CONTACT_ADDRESS },
];

export default function ContactPage() {
  return (
    <section className="bg-muted py-12">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-brand-500">
            Bog&rsquo;lanish
          </span>
          <h1 className="text-2xl font-bold text-page-fg sm:text-3xl">
            Savollaringiz bo&rsquo;lsa murojaat qiling
          </h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-4 rounded-lg bg-card p-5"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-500 text-white">
                {card.icon}
              </span>

              <span className="flex flex-col gap-1">
                <span className="text-[15px] font-bold text-page-fg">
                  {card.title}
                </span>
                <span className="text-sm text-ink-500">{card.value}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-card px-6 py-10">
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <span className="text-sm font-semibold text-brand-500">
              Bog&rsquo;lanish
            </span>
            <h2 className="text-xl font-bold text-page-fg sm:text-2xl">
              Savollaringiz bo&rsquo;lsa murojaat qiling
            </h2>
          </div>

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
