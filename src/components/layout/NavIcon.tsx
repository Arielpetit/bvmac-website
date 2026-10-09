import {
  Activity, BarChart3, BookA, Boxes, Briefcase, Building2, CalendarDays, Clock, Compass, FileBarChart, FileSignature, FileText,
  Gauge, Globe2, GraduationCap, History, Images, Info, Landmark, Layers, LineChart, ListChecks, Megaphone, Mic, Network,
  Newspaper, Percent, PieChart, PlayCircle, Receipt, Rocket, Scale, ScrollText, ShieldCheck, Tags, Users, Vault, Workflow,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Activity, BarChart3, BookA, Boxes, Briefcase, Building2, CalendarDays, Clock, Compass, FileBarChart, FileSignature, FileText,
  Gauge, Globe2, GraduationCap, History, Images, Info, Landmark, Layers, LineChart, ListChecks, Megaphone, Mic, Network,
  Newspaper, Percent, PieChart, PlayCircle, Receipt, Rocket, Scale, ScrollText, ShieldCheck, Tags, Users, Vault, Workflow,
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Info;
  return <Icon aria-hidden="true" className={className} strokeWidth={1.6} />;
}
