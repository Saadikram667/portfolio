import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Check, Copy, Send } from 'lucide-react';
import { sendContactMessage } from '../lib/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Tell me a bit more (at least 10 characters).'),
  website: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactTerminal({
  email,
  compact = false,
}: {
  email: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', website: '' },
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      const res = await sendContactMessage(values);
      toast.success(res.message);
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Transmission failed.');
    }
  }

  async function copyEmail() {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success(`Copied ${email}`);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div
      className={`rounded-3xl overflow-hidden bg-[#150A0E] text-[#F4E8D8] terminal-card-frame ${
        compact ? '' : 'w-full'
      }`}
    >
      <div className="px-5 py-3.5 bg-[#201016] border-b border-[#4A2933] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E03150]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9B44A]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#7A555C]" />
          <span className="ml-2 text-xs font-mono text-[#C2AAAB]">connect.sh</span>
        </div>

        {email && (
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D9B44A] hover:underline truncate"
          >
            {copied ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{email}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
        <p className="text-xs font-mono text-[#C2AAAB]">
          $ ./connect.sh --send-message
        </p>

        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register('website')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-mono text-[#C2AAAB] mb-1.5">
              name
            </label>
            <input
              id="contact-name"
              placeholder="Your name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0609] border border-[#4A2933] focus:border-[#D9B44A] text-sm text-[#F4E8D8] placeholder:text-[#8E7378] outline-none"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs font-mono text-[#E03150] mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-xs font-mono text-[#C2AAAB] mb-1.5">
              email
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="you@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0609] border border-[#4A2933] focus:border-[#D9B44A] text-sm text-[#F4E8D8] placeholder:text-[#8E7378] outline-none"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs font-mono text-[#E03150] mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-xs font-mono text-[#C2AAAB] mb-1.5">
            message
          </label>
          <textarea
            id="contact-message"
            rows={4}
            placeholder="Share project scope, timeline, or role details..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0609] border border-[#4A2933] focus:border-[#D9B44A] text-sm text-[#F4E8D8] placeholder:text-[#8E7378] outline-none resize-y"
            {...register('message')}
          />
          {errors.message && (
            <p className="text-xs font-mono text-[#E03150] mt-1">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl btn-primary-cta font-semibold text-sm disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Transmitting...' : 'Send Transmission'}</span>
        </button>
      </form>
    </div>
  );
}