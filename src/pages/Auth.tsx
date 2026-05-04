import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";

const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(100),
});

const signupSchema = loginSchema.extend({
  full_name: z.string().trim().min(2).max(100),
});

export default function Auth() {
  const { user, role, loading } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  if (!loading && user) {
    return <Navigate to={role === "admin" ? "/admin" : "/"} replace />;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) { toast.error("Invalid email or password"); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    nav("/");
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      full_name: fd.get("full_name"),
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: parsed.data.full_name },
      },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created! Signing you in…");
    nav("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative py-16 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-8 w-full max-w-md"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Radio className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-display font-bold">Welcome</h1>
            </div>

            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label className="label-caps mb-2 block">Email</Label>
                    <Input name="email" type="email" required />
                  </div>
                  <div>
                    <Label className="label-caps mb-2 block">Password</Label>
                    <Input name="password" type="password" required minLength={6} />
                  </div>
                  <Button disabled={busy} className="w-full rounded-full bg-primary hover:bg-primary/90">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label className="label-caps mb-2 block">Full name</Label>
                    <Input name="full_name" required />
                  </div>
                  <div>
                    <Label className="label-caps mb-2 block">Email</Label>
                    <Input name="email" type="email" required />
                  </div>
                  <div>
                    <Label className="label-caps mb-2 block">Password</Label>
                    <Input name="password" type="password" required minLength={6} />
                  </div>
                  <Button disabled={busy} className="w-full rounded-full bg-primary hover:bg-primary/90">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
