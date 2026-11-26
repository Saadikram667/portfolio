import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Send, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { sendContactMessage } from '../lib/api';

interface ContactTerminalProps {
  email?: string;
}

export function ContactTerminal({ email }: ContactTerminalProps) {
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return;

    const cleanName = name.trim();
    const cleanEmail = senderEmail.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (cleanName.length < 2 || !cleanEmail || cleanMessage.length < 3) {
      setStatus('error');
      setFeedbackMsg('Please enter your name, a valid email, and a short message.');
      return;
    }

    setSubmitting(true);
    setStatus('idle');
    setFeedbackMsg('');

    try {
      const result = await sendContactMessage({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject || 'Portfolio Inquiry',
        message: cleanMessage,
        website: honeypot,
      });

      setStatus('success');
      setFeedbackMsg(result.message);
      setName('');
      setSenderEmail('');
      setSubject('');
      setMessage('');
      toast.success(result.message);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.';
      setStatus('error');
      setFeedbackMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-full rounded-3xl overflow-hidden bg-[#150A0E] text-[#F4E8D8] terminal-card-frame">
      {/* Terminal Top Bar */}
      <div className="px-4 sm:px-5 py-3 bg-[#201016] border-b border-[#4A2933] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E03150] shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9B44A] shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#7A555C] shrink-0" />
          <span className="ml-1.5 text-xs font-mono text-[#C2AAAB] truncate flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#D9B44A] shrink-0" />
            <span>connect.sh</span>
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 shrink-0">● ready</span>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} noValidate className="p-4 sm:p-6 space-y-4">
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5 min-w-0">
            <span className="block text-xs font-mono text-[#D9B44A]">$ name *</span>
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-w-0 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0B0507] border border-[#4A2933] focus:border-[#D9B44A] focus:outline-none text-base sm:text-sm text-[#F4E8D8] placeholder:text-[#7A555C]"
            />
          </label>

          <label className="block space-y-1.5 min-w-0">
            <span className="block text-xs font-mono text-[#D9B44A]">$ email *</span>
            <input
              type="email"
              name="email"
              inputMode="email"
              required
              autoComplete="email"
              placeholder="you@domain.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full min-w-0 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0B0507] border border-[#4A2933] focus:border-[#D9B44A] focus:outline-none text-base sm:text-sm text-[#F4E8D8] placeholder:text-[#7A555C]"
            />
          </label>
        </div>

        <label className="block space-y-1.5 min-w-0">
          <span className="block text-xs font-mono text-[#D9B44A]">$ subject</span>
          <input
            type="text"
            name="subject"
            placeholder="Internship, freelance project, or collaboration"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full min-w-0 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0B0507] border border-[#4A2933] focus:border-[#D9B44A] focus:outline-none text-base sm:text-sm text-[#F4E8D8] placeholder:text-[#7A555C]"
          />
        </label>

        <label className="block space-y-1.5 min-w-0">
          <span className="block text-xs font-mono text-[#D9B44A]">$ message *</span>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Tell me what you're building or looking for..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-w-0 px-3.5 py-2.5 rounded-xl bg-[#0B0507] border border-[#4A2933] focus:border-[#D9B44A] focus:outline-none text-base sm:text-sm text-[#F4E8D8] placeholder:text-[#7A555C] resize-y"
          />
        </label>

        {status === 'success' && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs sm:text-sm text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{feedbackMsg || 'Message received! I’ll get back to you shortly.'}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/50 border border-[#E03150]/50 text-xs sm:text-sm text-red-200">
            <AlertCircle className="w-4 h-4 text-[#E03150] shrink-0 mt-0.5" />
            <span>
              {feedbackMsg}{' '}
              {email && (
                <a href={`mailto:${email}`} className="underline text-[#D9B44A]">
                  Email directly
                </a>
              )}
            </span>
          </div>
        )}

        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-burgundy hover:bg-crimson text-[#FBF4E9] border border-burgundy hover:border-crimson text-sm font-semibold transition-colors disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Sending...' : 'Send Message'}</span>
          </button>

          {email && (
            <a
              href={`mailto:${email}`}
              className="text-center sm:text-right text-xs font-mono text-[#BDA5A7] hover:text-[#D9B44A] transition-colors break-all"
            >
              or email {email}
            </a>
          )}
        </div>
      </form>
    </div>
  );
}