/**
 * Resolves a Phosphor icon by name so content files can reference icons as
 * strings. One icon family across the whole project (Phosphor), strokeWidth
 * standardised via the `weight` prop.
 */
import {
  Drop,
  ArrowsDownUp,
  Rows,
  SquaresFour,
  MagnifyingGlass,
  Leaf,
  CalendarCheck,
  House,
  Star,
  ShieldCheck,
  Images,
  Tag,
  Handshake,
  ChatCircleText,
  Clock,
  Lightning,
  Receipt,
  BellRinging,
  Waves,
  CurrencyGbp,
  CalendarPlus,
  Broom,
  Camera,
  SmileyWink,
  Phone,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";

// The icon component type isn't re-exported from the package root, so derive it.
type PhosphorIcon = typeof Drop;

const map: Record<string, PhosphorIcon> = {
  Drop,
  ArrowsDownUp,
  Rows,
  SquaresFour,
  MagnifyingGlass,
  Leaf,
  CalendarCheck,
  House,
  Star,
  ShieldCheck,
  Images,
  Tag,
  Handshake,
  ChatCircleText,
  Clock,
  Lightning,
  Receipt,
  BellRinging,
  Waves,
  CurrencyGbp,
  CalendarPlus,
  Broom,
  Camera,
  SmileyWink,
  Phone,
  MapPin,
};

export function Icon({
  name,
  size = 24,
  weight = "duotone",
  className,
}: {
  name: string;
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
}) {
  const Cmp = map[name] ?? Drop;
  return <Cmp size={size} weight={weight} className={className} aria-hidden />;
}
