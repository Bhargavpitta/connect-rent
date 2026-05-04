import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./RentForm.css";

const schema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{10,15}$/, "Enter a valid mobile number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  quantity: z.coerce.number().int().min(1, "At least 1 unit").max(1000),
  address: z.string().trim().min(10, "Provide a complete address").max(500),
  delivery_date: z.string().min(1, "Required"),
  delivery_time: z.string().min(1, "Required"),
  duration: z.coerce.number().int().min(1).max(365),
  purpose: z.enum(["Event", "Security", "Construction", "Other"]),
  notes: z.string().max(1000).optional().or(z.literal("")),
  emergency_contact: z.string().trim().regex(/^\+?[0-9\s-]{10,15}$/, "Enter a valid emergency number"),
  company_name: z.string().max(150).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function RentForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { purpose: "Event", duration: 1 },
  });

  const purpose = watch("purpose");

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const { error } = await supabase.from("rental_requests").insert({
      full_name: data.full_name,
      phone: data.phone,
      email: data.email,
      quantity: data.quantity,
      address: data.address,
      delivery_date: data.delivery_date,
      delivery_time: data.delivery_time,
      duration: data.duration,
      purpose: data.purpose,
      notes: data.notes || null,
      emergency_contact: data.emergency_contact,
      company_name: data.company_name || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit request. Please try again.");
      return;
    }
    toast.success("Request submitted! We'll contact you within 30 minutes.");
    setDone(true);
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-bg opacity-30" />

        <div className="container relative py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold">Rental Request Form</h1>
            <p className="mt-3 text-muted-foreground">
              Secure high-performance communication systems for your next mission. Professional grade equipment, ready for dispatch.
            </p>
          </motion.div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong max-w-xl mx-auto rounded-3xl p-10 text-center"
            >
              <CheckCircle2 className="h-16 w-16 text-tertiary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Request received</h2>
              <p className="text-muted-foreground mb-6">Our team will reach out within 30 minutes to confirm your booking.</p>
              <Button onClick={() => setDone(false)} className="rounded-full">Submit another request</Button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit(onSubmit)}
              className="glass-strong rounded-3xl p-6 md:p-10 max-w-4xl mx-auto space-y-8"
            >
              <Section title="Personal Information">
                <Field label="Full Name" error={errors.full_name?.message}>
                  <Input placeholder="John Doe" {...register("full_name")} />
                </Field>
                <Field label="Company / Organization" error={errors.company_name?.message}>
                  <Input placeholder="Optional" {...register("company_name")} />
                </Field>
                <Field label="Mobile Number" error={errors.phone?.message}>
                  <Input placeholder="+91 98765 43210" {...register("phone")} />
                </Field>
                <Field label="Emergency Contact" error={errors.emergency_contact?.message}>
                  <Input placeholder="+91 98765 00000" {...register("emergency_contact")} />
                </Field>
                <Field label="Email Address" full error={errors.email?.message}>
                  <Input type="email" placeholder="john.doe@organization.com" {...register("email")} />
                </Field>
              </Section>

              <Section title="Rental Specifications">
                <Field label="Units Required" error={errors.quantity?.message}>
                  <Input type="number" placeholder="Quantity" {...register("quantity")} />
                </Field>
                <Field label="Purpose of Use" error={errors.purpose?.message}>
                  <Select value={purpose} onValueChange={(v) => setValue("purpose", v as FormData["purpose"], { shouldValidate: true })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Delivery Date" error={errors.delivery_date?.message}>
                  <Input type="date" {...register("delivery_date")} />
                </Field>
                <Field label="Delivery Time" error={errors.delivery_time?.message}>
                  <Input type="time" {...register("delivery_time")} />
                </Field>
                <Field label="Duration (Days)" error={errors.duration?.message}>
                  <Input type="number" placeholder="e.g. 5" {...register("duration")} />
                </Field>
                <Field label="Delivery Address" full error={errors.address?.message}>
                  <Textarea rows={3} placeholder="Full location with landmark" {...register("address")} />
                </Field>
                <Field label="Additional Notes" full error={errors.notes?.message}>
                  <Textarea rows={3} placeholder="Frequency requirements, special accessories, etc." {...register("notes")} />
                </Field>
              </Section>

              <div className="space-y-3">
                <Button type="submit" disabled={submitting} className="w-full rounded-2xl h-14 text-base bg-primary hover:bg-primary/90 shadow-glow">
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Submit Request <Send className="ml-2 h-4 w-4" /></>}
                </Button>
                <p className="text-center text-xs text-muted-foreground">Professional review typically takes 15–30 minutes.</p>
              </div>
            </motion.form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-caps mb-4">{title}</p>
      <div className="grid md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function Field({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="label-caps mb-2 block">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
