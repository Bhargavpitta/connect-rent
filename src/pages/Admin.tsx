import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CheckCircle2, Clock, Truck, TrendingUp, Search, Trash2, Download, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import "./Admin.css";

type Req = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  quantity: number;
  address: string;
  delivery_date: string;
  delivery_time: string;
  duration: number;
  purpose: string;
  notes: string | null;
  emergency_contact: string;
  company_name: string | null;
  status: string;
  created_at: string;
};

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--tertiary))", "hsl(var(--muted-foreground))"];

export default function Admin() {
  const { user, role, loading } = useAuth();
  const [rows, setRows] = useState<Req[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Req | null>(null);

  useEffect(() => {
    if (role !== "admin") return;
    fetchRows();
  }, [role]);

  const fetchRows = async () => {
    setFetching(true);
    const { data, error } = await supabase.from("rental_requests").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as Req[]);
    setFetching(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (role !== "admin") return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="text-muted-foreground mt-2">Your account doesn't have admin privileges.</p>
      </div>
    </div>
  );

  const filtered = rows.filter((r) => {
    if (status !== "all" && r.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.phone.includes(q);
    }
    return true;
  });

  const stats = useMemo(() => {
    const total = rows.length;
    const delivered = rows.filter((r) => r.status === "delivered").length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const inTransit = rows.filter((r) => r.status === "in_transit").length;
    return { total, delivered, pending, inTransit };
  }, [rows]);

  const monthly = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      const m = format(parseISO(r.created_at), "MMM");
      map[m] = (map[m] || 0) + 1;
    });
    const order = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return order.filter((m) => map[m]).map((m) => ({ month: m, count: map[m] }));
  }, [rows]);

  const daily = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      const d = format(parseISO(r.created_at), "MMM d");
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map).slice(-10).map(([day, count]) => ({ day, count }));
  }, [rows]);

  const pieData = [
    { name: "Delivered", value: stats.delivered },
    { name: "In Transit", value: stats.inTransit },
    { name: "Pending", value: stats.pending },
  ].filter((d) => d.value > 0);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("rental_requests").update({ status: newStatus }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    fetchRows();
    setSelected(null);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("rental_requests").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Request deleted");
    fetchRows();
    setSelected(null);
  };

  const exportCsv = () => {
    const headers = ["Name","Phone","Email","Quantity","Delivery Date","Status","Purpose","Address"];
    const lines = filtered.map((r) => [r.full_name, r.phone, r.email, r.quantity, r.delivery_date, r.status, r.purpose, r.address.replace(/,/g, ";")].join(","));
    const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `rental-requests-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        <div className="container relative py-10 space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold">Fleet Overview</h1>
            <p className="text-muted-foreground mt-1">Real-time status of your communication inventory.</p>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<TrendingUp />} label="Total Requests" value={stats.total} accent="primary" />
            <StatCard icon={<CheckCircle2 />} label="Delivered" value={stats.delivered} accent="tertiary" />
            <StatCard icon={<Clock />} label="Pending" value={stats.pending} accent="primary" />
            <StatCard icon={<Truck />} label="In Transit" value={stats.inTransit} accent="tertiary" />
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="glass rounded-2xl p-6 lg:col-span-2">
              <h3 className="font-semibold mb-4">Monthly Requests Analytics</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Order Status</h3>
              {pieData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">No data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Daily Bookings</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="glass rounded-2xl p-6">
            <div className="flex flex-wrap gap-3 items-end justify-between mb-5">
              <h3 className="text-xl font-semibold">Rental Requests</h3>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name/email/phone" className="pl-9 w-60" />
                </div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
              </div>
            </div>

            {fetching ? (
              <div className="py-20 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No requests found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-border">
                      <th className="label-caps py-3">Name</th>
                      <th className="label-caps py-3">Contact</th>
                      <th className="label-caps py-3">Qty</th>
                      <th className="label-caps py-3">Delivery</th>
                      <th className="label-caps py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} onClick={() => setSelected(r)} className="border-b border-border/50 hover:bg-primary/5 cursor-pointer transition">
                        <td className="py-4">
                          <div className="font-medium">{r.full_name}</div>
                          <div className="text-xs text-muted-foreground">{r.company_name ?? "—"}</div>
                        </td>
                        <td className="py-4">
                          <div>{r.phone}</div>
                          <div className="text-xs text-muted-foreground">{r.email}</div>
                        </td>
                        <td className="py-4 font-semibold">{r.quantity}</td>
                        <td className="py-4">{format(parseISO(r.delivery_date), "MMM d, yyyy")}</td>
                        <td className="py-4"><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="glass-strong max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selected.full_name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Detail label="Phone" value={selected.phone} />
                <Detail label="Email" value={selected.email} />
                <Detail label="Emergency" value={selected.emergency_contact} />
                <Detail label="Company" value={selected.company_name || "—"} />
                <Detail label="Quantity" value={String(selected.quantity)} />
                <Detail label="Duration" value={`${selected.duration} days`} />
                <Detail label="Delivery Date" value={format(parseISO(selected.delivery_date), "PPP")} />
                <Detail label="Time" value={selected.delivery_time} />
                <Detail label="Purpose" value={selected.purpose} />
                <Detail label="Status" value={selected.status} />
                <div className="col-span-2"><Detail label="Address" value={selected.address} /></div>
                {selected.notes && <div className="col-span-2"><Detail label="Notes" value={selected.notes} /></div>}
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                {selected.status !== "in_transit" && (
                  <Button variant="outline" onClick={() => updateStatus(selected.id, "in_transit")}>
                    <Truck className="h-4 w-4 mr-1" /> Mark In Transit
                  </Button>
                )}
                {selected.status !== "delivered" && (
                  <Button onClick={() => updateStatus(selected.id, "delivered")} className="bg-tertiary text-tertiary-foreground hover:bg-tertiary/90">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Delivered
                  </Button>
                )}
                <Button variant="destructive" onClick={() => remove(selected.id)} className="ml-auto">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: "primary" | "tertiary" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover rounded-2xl p-5">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${accent === "primary" ? "bg-primary/15 text-primary" : "bg-tertiary/15 text-tertiary"}`}>
        {icon}
      </div>
      <p className="label-caps">{label}</p>
      <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    delivered: "bg-tertiary/20 text-tertiary border-tertiary/40",
    pending: "bg-orange-500/15 text-orange-500 border-orange-500/30",
    in_transit: "bg-primary/20 text-primary border-primary/40",
  };
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${map[status] ?? "bg-muted text-muted-foreground"}`}>{status.replace("_", " ")}</span>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-caps mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
