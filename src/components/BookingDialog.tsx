"use client";
import React, { useState, useEffect } from "react";
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function BookingDialog({ trigger }: { trigger?: React.ReactNode }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('booking');

  // Update name when session becomes available
  useEffect(() => {
    if (session?.user?.name && !name) {
      setName(session.user.name);
    }
  }, [session?.user?.name, name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !name || !phone) {
      toast.error(t('fillRequiredFields'));
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(t('viewingScheduled'));
      setOpen(false);
      setDate(undefined);
      setName("");
      setPhone("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">{t('scheduleViewing')}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm w-full !z-1000">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('selectDateTime')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="mb-1 block">{t('selectDate')}</Label>
            <DateTimePicker hourCycle={12} value={date} onChange={setDate} className="w-full" />
          </div>
          <div>
            <Label className="mb-1 block">{t('yourEmail')}</Label>
            <Input value={session?.user?.email || ""} disabled className="blur-[0.5px] bg-gray-50 text-gray-900 select-none" />
          </div>
          <div>
            <Label className="mb-1 block">{t('yourName')}</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder={t('yourName')} required />
          </div>
          <div>
            <Label className="mb-1 block">{t('yourPhone')}</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" required />
          </div>
          
          {/* Booking Summary */}
          {(date || name || phone) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-semibold text-blue-900">{t('bookingSummary')}</h4>
              <div className="text-sm text-blue-800 space-y-1">
                {date && (
                  <p><span className="font-medium">{t('dateTime')}:</span> {date.toLocaleString()}</p>
                )}
                {name && (
                  <p><span className="font-medium">{t('name')}:</span> {name}</p>
                )}
                {phone && (
                  <p><span className="font-medium">{t('phone')}:</span> {phone}</p>
                )}
                {session?.user?.email && (
                  <p><span className="font-medium">{t('email')}:</span> {session.user.email}</p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">{t('cancel')}</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('scheduling') : t('scheduleViewing')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 