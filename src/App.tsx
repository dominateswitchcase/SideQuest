import { useState, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "home" | "category" | "preferences" | "recommendations"
  | "place-detail" | "directions" | "checkin" | "success"
  | "surprise-loading" | "surprise-result"
  | "explore" | "saved" | "profile"

type NavTab = "home" | "explore" | "saved" | "profile"

interface Place {
  id: string
  name: string
  category: string
  distance: string
  price: string
  rating: number
  reviews: number
  status: string
  badge: string | null
  description: string
  image: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PLACES: Record<string, Place> = {
  cafeX: {
    id: "cafeX", name: "Café X", category: "Cafe", distance: "1.4 km",
    price: "₱200–₱300", rating: 4.6, reviews: 128, status: "Open now",
    badge: "Best Match",
    description: "A cozy local cafe offering affordable drinks, food, and a relaxed atmosphere.",
    image: "https://images.unsplash.com/photo-1776100222020-e35983af66a2?w=800&h=400&fit=crop&auto=format",
  },
  brewCorner: {
    id: "brewCorner", name: "Brew Corner", category: "Cafe", distance: "1.8 km",
    price: "₱150–₱250", rating: 4.5, reviews: 94, status: "Open now", badge: null,
    description: "Artisanal brews and quick bites in a laid-back neighborhood setting.",
    image: "https://images.unsplash.com/photo-1682988463820-d6bb563679c2?w=800&h=400&fit=crop&auto=format",
  },
  dailyCup: {
    id: "dailyCup", name: "The Daily Cup", category: "Cafe", distance: "2.0 km",
    price: "₱200–₱300", rating: 4.4, reviews: 76, status: "Open now", badge: null,
    description: "Your neighborhood go-to for morning coffee and all-day light meals.",
    image: "https://images.unsplash.com/photo-1776703808255-42a98f22547f?w=800&h=400&fit=crop&auto=format",
  },
  localBites: {
    id: "localBites", name: "Local Bites", category: "Food", distance: "0.8 km",
    price: "₱100–₱200", rating: 4.5, reviews: 210, status: "Open now", badge: null,
    description: "Authentic Filipino street food and homestyle cooking at honest prices.",
    image: "https://images.unsplash.com/photo-1593870682262-8c9f6a9bb225?w=800&h=400&fit=crop&auto=format",
  },
  viewpointPark: {
    id: "viewpointPark", name: "Viewpoint Park", category: "Scenic", distance: "2.0 km",
    price: "Free", rating: 4.8, reviews: 342, status: "Open now", badge: null,
    description: "A hilltop park offering panoramic views of Naga City and the surrounding mountains.",
    image: "https://images.unsplash.com/photo-1758729770542-16a6c2db4117?w=800&h=400&fit=crop&auto=format",
  },
}

const CAFE_RECS = [PLACES.cafeX, PLACES.brewCorner, PLACES.dailyCup]
const POPULAR = [PLACES.cafeX, PLACES.localBites, PLACES.viewpointPark]
const SURPRISE_ALTS = [PLACES.brewCorner, PLACES.viewpointPark, PLACES.localBites]

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconMapPin({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconStar({ size = 14, filled = true }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#F28C38" : "none"} stroke="#F28C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconHome({ active = false }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#16B8A6" : "none"} stroke={active ? "#16B8A6" : "#667370"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconCompass({ active = false }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#16B8A6" : "#667370"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={active ? "#16B8A6" : "none"} />
    </svg>
  )
}

function IconBookmark({ active = false }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#16B8A6" : "none"} stroke={active ? "#16B8A6" : "#667370"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}

function IconUser({ active = false }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#16B8A6" : "#667370"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconArrowLeft({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function IconDice({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      <circle cx="8" cy="16" r="1.2" fill="currentColor" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" />
    </svg>
  )
}

function IconNavigation({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  )
}

function IconCheck({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconCoffee({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 010 8h-1" />
      <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  )
}

function IconUtensils({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  )
}

function IconMountain({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 20 10 4 17 14 21 20 3 20" />
      <polyline points="14 8 17 14" />
    </svg>
  )
}

function IconCamera({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function IconActivity({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function IconLandmark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7 12 2" />
    </svg>
  )
}

function IconSave({ size = 18, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#16B8A6" : "none"} stroke="#16B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}

function IconSearch({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconClock({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#16B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconTrophy({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 20 12 20 16 20" />
      <line x1="12" y1="20" x2="12" y2="16" />
      <path d="M16 4H8v8a4 4 0 008 0V4z" />
      <path d="M16 4h4v2a4 4 0 01-4 4" />
      <path d="M8 4H4v2a4 4 0 004 4" />
    </svg>
  )
}

function IconX({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconSettings({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

function IconChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ─── Reusable UI ──────────────────────────────────────────────────────────────

function SQMark({ size = 32 }: { size?: number }) {
  const r = size * 0.18
  return (
    <div
      style={{
        width: size, height: size, borderRadius: r,
        background: "#16B8A6",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ color: "#fff", fontWeight: 700, fontSize: size * 0.38, letterSpacing: "-0.02em", lineHeight: 1 }}>SQ</span>
    </div>
  )
}

function PrimaryBtn({ label, onClick, full = true, small = false }: { label: string; onClick: () => void; full?: boolean; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: full ? "100%" : "auto",
        background: "#16B8A6",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: small ? "10px 20px" : "14px 20px",
        fontSize: small ? 14 : 15,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "-0.01em",
        transition: "background 0.15s",
      }}
      onMouseOver={e => (e.currentTarget.style.background = "#0F8F83")}
      onMouseOut={e => (e.currentTarget.style.background = "#16B8A6")}
    >
      {label}
    </button>
  )
}

function SecondaryBtn({ label, onClick, full = true }: { label: string; onClick: () => void; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: full ? "100%" : "auto",
        background: "transparent",
        color: "#16B8A6",
        border: "1.5px solid #16B8A6",
        borderRadius: 10,
        padding: "13px 20px",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "-0.01em",
        transition: "background 0.15s",
      }}
      onMouseOver={e => (e.currentTarget.style.background = "#E6F8F5")}
      onMouseOut={e => (e.currentTarget.style.background = "transparent")}
    >
      {label}
    </button>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none", padding: "4px 0",
        cursor: "pointer", color: "#172322", display: "flex", alignItems: "center", gap: 6,
        fontSize: 14, fontWeight: 500,
      }}
    >
      <IconArrowLeft size={18} />
    </button>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isOpen = status === "Open now"
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.02em",
      color: isOpen ? "#0F8F83" : "#667370",
      background: isOpen ? "#E6F8F5" : "#F0F4F2",
      borderRadius: 5, padding: "2px 7px",
    }}>{status}</span>
  )
}

function RatingChip({ rating }: { rating: number }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, fontWeight: 600, color: "#172322" }}>
      <IconStar size={12} />
      {rating}
    </span>
  )
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div style={{
      width: 44, height: 24, borderRadius: 12,
      background: on ? "#16B8A6" : "#CBD5D2",
      position: "relative", transition: "background 0.2s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, left: on ? 23 : 3, width: 18, height: 18,
        borderRadius: 9, background: "#fff", transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }} />
    </div>
  )
}

function PlaceCard({ place, onPress }: { place: Place; onPress: () => void }) {
  return (
    <div
      onClick={onPress}
      style={{
        background: "#fff", borderRadius: 12, overflow: "hidden",
        border: "1px solid #E2E8E6", cursor: "pointer",
        flexShrink: 0,
        transition: "transform 0.12s",
      }}
      onMouseOver={e => (e.currentTarget.style.transform = "scale(1.01)")}
      onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ position: "relative" }}>
        <img src={place.image} alt={place.name} style={{ width: "100%", height: 120, objectFit: "cover", display: "block", background: "#E6F8F5" }} />
        {place.badge && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            background: "#F28C38", color: "#fff",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
            borderRadius: 5, padding: "3px 8px",
          }}>{place.badge}</span>
        )}
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#172322", marginBottom: 4 }}>{place.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#667370" }}>{place.category}</span>
          <span style={{ fontSize: 12, color: "#667370" }}>·</span>
          <span style={{ fontSize: 12, color: "#667370" }}>{place.distance}</span>
          <span style={{ fontSize: 12, color: "#667370" }}>·</span>
          <span style={{ fontSize: 12, color: "#667370" }}>{place.price}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <RatingChip rating={place.rating} />
          <StatusBadge status={place.status} />
        </div>
      </div>
    </div>
  )
}

function RecoCard({ place, onPress }: { place: Place; onPress: () => void }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, overflow: "hidden",
      border: "1px solid #E2E8E6", marginBottom: 12,
    }}>
      <div style={{ position: "relative" }}>
        <img src={place.image} alt={place.name} style={{ width: "100%", height: 140, objectFit: "cover", display: "block", background: "#E6F8F5" }} />
        {place.badge && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: "#F28C38", color: "#fff",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
            borderRadius: 5, padding: "3px 8px",
          }}>{place.badge}</span>
        )}
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#172322", marginBottom: 2 }}>{place.name}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#667370" }}>{place.category}</span>
              <span style={{ fontSize: 13, color: "#667370" }}>·</span>
              <span style={{ fontSize: 13, color: "#667370" }}>{place.distance} away</span>
            </div>
          </div>
          <RatingChip rating={place.rating} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "#172322", fontWeight: 500 }}>{place.price}</span>
          <StatusBadge status={place.status} />
        </div>
        <PrimaryBtn label="View Place" onClick={onPress} small />
      </div>
    </div>
  )
}

function SavedCard({ place, onRemove }: { place: Place; onRemove: () => void }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, overflow: "hidden",
      border: "1px solid #E2E8E6", display: "flex", marginBottom: 10,
    }}>
      <img src={place.image} alt={place.name} style={{ width: 80, height: 80, objectFit: "cover", flexShrink: 0, background: "#E6F8F5" }} />
      <div style={{ flex: 1, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#172322", marginBottom: 3 }}>{place.name}</div>
          <div style={{ fontSize: 12, color: "#667370", marginBottom: 4 }}>{place.category} · {place.distance}</div>
          <RatingChip rating={place.rating} />
        </div>
        <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "#16B8A6", padding: 4 }}>
          <IconSave size={18} filled />
        </button>
      </div>
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ active, onNav }: { active: NavTab; onNav: (t: NavTab) => void }) {
  const tabs: { id: NavTab; label: string; Icon: (p: { active: boolean }) => React.ReactElement }[] = [
    { id: "home", label: "Home", Icon: IconHome },
    { id: "explore", label: "Explore", Icon: IconCompass },
    { id: "saved", label: "Saved", Icon: IconBookmark },
    { id: "profile", label: "Profile", Icon: IconUser },
  ]
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#fff", borderTop: "1px solid #E2E8E6",
      display: "flex", paddingBottom: 8, zIndex: 200,
    }}>
      <div style={{ display: "flex", width: "100%", maxWidth: 720, margin: "0 auto" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onNav(t.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, paddingTop: 10, background: "none", border: "none", cursor: "pointer",
            }}
          >
            <t.Icon active={active === t.id} />
            <span style={{ fontSize: 10, fontWeight: 500, color: active === t.id ? "#16B8A6" : "#667370" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Screen: Home ─────────────────────────────────────────────────────────────
function HomeScreen({ onExplore, onSurprise, onNav, onPlace, onProfile }: {
  onExplore: () => void
  onSurprise: () => void
  onNav: (t: NavTab) => void
  onPlace: (id: string) => void
  onProfile: () => void
}) {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>
        {/* Header */}
        <div style={{ padding: "20px 0 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SQMark size={34} />
            <span style={{ fontWeight: 700, fontSize: 17, color: "#172322", letterSpacing: "-0.02em" }}>Sidequest</span>
          </div>
          <button onClick={onProfile} style={{ background: "#E6F8F5", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconUser active />
          </button>
        </div>

        {/* Hero */}
        <div style={{ padding: "8px 0 20px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#172322", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 6 }}>
            Where do you want to go?
          </h1>
          <p style={{ fontSize: 15, color: "#667370", marginBottom: 20, lineHeight: 1.5 }}>
            Discover places worth visiting near you.
          </p>

          {/* Location */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
            background: "#fff", border: "1px solid #E2E8E6",
            borderRadius: 10, padding: "10px 14px", width: "fit-content",
          }}>
            <IconMapPin size={16} color="#16B8A6" />
            <span style={{ fontSize: 14, fontWeight: 500, color: "#172322" }}>Naga City</span>
            <IconChevronRight size={14} />
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 10 }}>
            <PrimaryBtn label="Explore Nearby" onClick={onExplore} full={false} />
            <button
              onClick={onSurprise}
              style={{
                background: "transparent", border: "1.5px solid #E2E8E6",
                borderRadius: 10, padding: "13px 20px",
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 15, fontWeight: 600, color: "#172322",
                cursor: "pointer", transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#16B8A6"; e.currentTarget.style.background = "#E6F8F5" }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#E2E8E6"; e.currentTarget.style.background = "transparent" }}
            >
              <IconDice size={17} />
              Give Me a Sidequest
            </button>
          </div>
        </div>

        {/* Popular */}
        <div style={{ marginTop: 8 }}>
          <div style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#172322" }}>Popular near you</span>
            <button style={{ background: "none", border: "none", fontSize: 13, color: "#16B8A6", fontWeight: 600, cursor: "pointer" }}>See all</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {POPULAR.map(p => (
              <PlaceCard key={p.id} place={p} onPress={() => onPlace(p.id)} />
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" onNav={onNav} />
    </div>
  )
}

// ─── Screen: Category ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "food", label: "Food", Icon: IconUtensils },
  { id: "cafe", label: "Cafe", Icon: IconCoffee },
  { id: "adventure", label: "Adventure", Icon: IconMountain },
  { id: "scenic", label: "Scenic", Icon: IconCamera },
  { id: "tourist", label: "Tourist", Icon: IconLandmark },
  { id: "activities", label: "Activities", Icon: IconActivity },
]

function CategoryScreen({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [selected, setSelected] = useState("cafe")
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F7F9F8" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", padding: "20px 20px 20px" }}>
        <BackBtn onClick={onBack} />
        <div style={{ marginTop: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#172322", letterSpacing: "-0.03em", lineHeight: 1.25, marginBottom: 6 }}>
            What are you in the mood for?
          </h1>
          <p style={{ fontSize: 14, color: "#667370", lineHeight: 1.5 }}>
            Choose a category to narrow down your recommendations.
          </p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="sq-scroll">
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px 90px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {CATEGORIES.map(cat => {
            const isSelected = selected === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                style={{
                  background: isSelected ? "#E6F8F5" : "#fff",
                  border: `1.5px solid ${isSelected ? "#16B8A6" : "#E2E8E6"}`,
                  borderRadius: 12, padding: "18px 14px",
                  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div style={{ color: isSelected ? "#16B8A6" : "#667370" }}>
                  <cat.Icon size={22} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: isSelected ? "#172322" : "#172322" }}>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 20px 24px", background: "#F7F9F8", borderTop: "1px solid #E2E8E6", zIndex: 100 }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <PrimaryBtn label="Continue" onClick={onContinue} />
        </div>
      </div>
    </div>
  )
}

// ─── Screen: Preferences ──────────────────────────────────────────────────────
function PreferencesScreen({ onBack, onFind }: { onBack: () => void; onFind: () => void }) {
  const [budget, setBudget] = useState("₱300")
  const [distance, setDistance] = useState("2 km")
  const [openNow] = useState(true)
  const [rating] = useState("4.0+")

  const budgets = ["₱150", "₱300", "₱500", "₱1,000+"]
  const distances = ["1 km", "2 km", "5 km", "10 km"]

  function ChipGroup({ options, value, onSelect }: { options: string[]; value: string; onSelect: (v: string) => void }): React.ReactElement {
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map(opt => {
          const sel = value === opt
          return (
            <button key={opt} onClick={() => onSelect(opt)} style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500,
              background: sel ? "#16B8A6" : "#fff",
              color: sel ? "#fff" : "#172322",
              border: `1.5px solid ${sel ? "#16B8A6" : "#E2E8E6"}`,
              cursor: "pointer", transition: "all 0.12s",
            }}>{opt}</button>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F7F9F8" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", padding: "20px 20px 20px" }}>
        <BackBtn onClick={onBack} />
        <div style={{ marginTop: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#172322", letterSpacing: "-0.03em", marginBottom: 6 }}>
            Set your preferences
          </h1>
          <p style={{ fontSize: 14, color: "#667370" }}>Tell us what works for you.</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="sq-scroll">
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>
        {/* Budget */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#667370", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 10 }}>Budget</div>
          <ChipGroup options={budgets} value={budget} onSelect={setBudget} />
        </div>

        {/* Distance */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#667370", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 10 }}>Distance</div>
          <ChipGroup options={distances} value={distance} onSelect={setDistance} />
        </div>

        {/* Open Now */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ background: "#fff", border: "1px solid #E2E8E6", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#172322" }}>Open Now</div>
              <div style={{ fontSize: 12, color: "#667370", marginTop: 2 }}>Only show places currently open</div>
            </div>
            <Toggle on={openNow} />
          </div>
        </div>

        {/* Rating */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#667370", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 10 }}>Minimum Rating</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Any", "3.0+", "4.0+", "4.5+"].map(r => (
              <button key={r} style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                background: rating === r ? "#16B8A6" : "#fff",
                color: rating === r ? "#fff" : "#172322",
                border: `1.5px solid ${rating === r ? "#16B8A6" : "#E2E8E6"}`,
                cursor: "pointer",
              }}>{r}</button>
            ))}
          </div>
        </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 20px 24px", background: "#F7F9F8", borderTop: "1px solid #E2E8E6", zIndex: 100 }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <PrimaryBtn label="Find Sidequests" onClick={onFind} />
        </div>
      </div>
    </div>
  )
}

// ─── Screen: Recommendations ──────────────────────────────────────────────────
function RecommendationsScreen({ onBack, onPlace }: { onBack: () => void; onPlace: (id: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F7F9F8" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", padding: "20px 20px 20px" }}>
        <BackBtn onClick={onBack} />
        <div style={{ marginTop: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#172322", letterSpacing: "-0.03em", marginBottom: 6 }}>
            Here are your Sidequests.
          </h1>
          <p style={{ fontSize: 13, color: "#667370", lineHeight: 1.5 }}>
            Cafe recommendations within 2 km, under ₱300, and currently open.
          </p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }} className="sq-scroll">
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px 40px" }}>
        {CAFE_RECS.map(p => (
          <RecoCard key={p.id} place={p} onPress={() => onPlace(p.id)} />
        ))}
        </div>
      </div>
    </div>
  )
}

// ─── Screen: Place Detail ─────────────────────────────────────────────────────
function PlaceDetailScreen({ placeId, onBack, onDirections, onSave, isSaved }: {
  placeId: string
  onBack: () => void
  onDirections: () => void
  onSave: () => void
  isSaved: boolean
}) {
  const place = PLACES[placeId] || PLACES.cafeX
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F7F9F8", overflowY: "auto" }} className="sq-scroll">
      {/* Image */}
      <div style={{ position: "relative" }}>
        <img src={place.image} alt={place.name} style={{ width: "100%", height: 220, objectFit: "cover", display: "block", background: "#E6F8F5" }} />
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: 20, left: 16,
            background: "rgba(255,255,255,0.92)", border: "none",
            borderRadius: 8, width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <IconArrowLeft size={18} />
        </button>
        {place.badge && (
          <span style={{
            position: "absolute", top: 20, right: 16,
            background: "#F28C38", color: "#fff",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
            borderRadius: 6, padding: "4px 10px",
          }}>{place.badge}</span>
        )}
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", width: "100%" }}>
      {/* Info */}
      <div style={{ background: "#fff", padding: "16px 20px 20px", borderBottom: "1px solid #E2E8E6" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#172322", letterSpacing: "-0.02em", marginBottom: 4 }}>{place.name}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <IconStar size={14} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "#172322" }}>{place.rating}</span>
          <span style={{ fontSize: 13, color: "#667370" }}>· {place.reviews} reviews</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#667370", background: "#F7F9F8", borderRadius: 6, padding: "4px 10px" }}>{place.category}</span>
          <span style={{ fontSize: 13, color: "#667370", background: "#F7F9F8", borderRadius: 6, padding: "4px 10px" }}>{place.distance} away</span>
          <span style={{ fontSize: 13, color: "#667370", background: "#F7F9F8", borderRadius: 6, padding: "4px 10px" }}>{place.price}</span>
          <StatusBadge status={place.status} />
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: "16px 20px", background: "#fff", marginTop: 8, borderTop: "1px solid #E2E8E6", borderBottom: "1px solid #E2E8E6" }}>
        <p style={{ fontSize: 14, color: "#172322", lineHeight: 1.6 }}>{place.description}</p>
      </div>

      {/* Match reasons */}
      <div style={{ padding: "16px 20px", background: "#fff", marginTop: 8, borderTop: "1px solid #E2E8E6", borderBottom: "1px solid #E2E8E6" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#172322", marginBottom: 12 }}>Why this is a good match</div>
        {[`Within your 2 km distance`, `Within your ₱300 budget`, "Currently open"].map(r => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: "#E6F8F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ color: "#16B8A6" }}><IconCheck size={12} /></div>
            </div>
            <span style={{ fontSize: 13, color: "#172322" }}>{r}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ padding: "16px 20px 32px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <button onClick={onDirections} style={{
            flex: 1, padding: "13px", borderRadius: 10,
            background: "#fff", border: "1.5px solid #E2E8E6",
            fontSize: 14, fontWeight: 600, color: "#172322",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <IconNavigation size={15} />
            Directions
          </button>
          <button onClick={onSave} style={{
            flex: 1, padding: "13px", borderRadius: 10,
            background: isSaved ? "#E6F8F5" : "#fff",
            border: `1.5px solid ${isSaved ? "#16B8A6" : "#E2E8E6"}`,
            fontSize: 14, fontWeight: 600, color: isSaved ? "#16B8A6" : "#172322",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.15s",
          }}>
            <IconSave size={15} filled={isSaved} />
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
        <PrimaryBtn label="Start Sidequest" onClick={onDirections} />
      </div>
      </div>
    </div>
  )
}

// ─── Screen: Mock Map ─────────────────────────────────────────────────────────
function MockMap() {
  return (
    <svg viewBox="0 0 390 340" style={{ width: "100%", height: "100%", display: "block" }}>
      {/* Base */}
      <rect width="390" height="340" fill="#EEE8D8" />

      {/* Parks/green */}
      <rect x="220" y="40" width="80" height="50" rx="4" fill="#C8DFC0" />
      <text x="260" y="70" textAnchor="middle" fontSize="8" fill="#5A8050" fontFamily="Inter,sans-serif">Riverside Park</text>
      <rect x="30" y="180" width="60" height="40" rx="4" fill="#C8DFC0" />
      <text x="60" y="204" textAnchor="middle" fontSize="8" fill="#5A8050" fontFamily="Inter,sans-serif">Plaza</text>

      {/* Water */}
      <rect x="310" y="200" width="80" height="60" rx="4" fill="#B8D4E8" />
      <text x="350" y="234" textAnchor="middle" fontSize="8" fill="#4A7090" fontFamily="Inter,sans-serif">Bicol River</text>

      {/* City blocks */}
      {[
        [30,30,70,40], [130,30,60,40], [220,110,60,50], [30,100,80,50],
        [140,100,60,50], [300,30,60,60], [30,240,70,50], [140,200,70,50],
        [220,270,70,50], [30,310,50,20], [140,290,60,30],
      ].map(([x,y,w,h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#DDD8CC" stroke="#CCC8BC" strokeWidth="0.5" />
      ))}

      {/* Main roads */}
      <rect x="0" y="80" width="390" height="14" fill="#FAFAFA" stroke="#CCC" strokeWidth="0.5" />
      <text x="70" y="91" fontSize="8" fill="#888" fontFamily="Inter,sans-serif" fontWeight="500">Magsaysay Ave.</text>

      <rect x="0" y="170" width="390" height="14" fill="#FAFAFA" stroke="#CCC" strokeWidth="0.5" />
      <text x="10" y="181" fontSize="8" fill="#888" fontFamily="Inter,sans-serif" fontWeight="500">Panganiban Drive</text>

      <rect x="110" y="0" width="14" height="340" fill="#FAFAFA" stroke="#CCC" strokeWidth="0.5" />
      <rect x="210" y="0" width="14" height="340" fill="#FAFAFA" stroke="#CCC" strokeWidth="0.5" />
      <rect x="295" y="0" width="12" height="200" fill="#FAFAFA" stroke="#CCC" strokeWidth="0.5" />

      {/* Street labels */}
      <text x="150" y="160" fontSize="7" fill="#999" fontFamily="Inter,sans-serif" transform="rotate(-90,150,160)">Elias Angeles</text>
      <text x="248" y="155" fontSize="7" fill="#999" fontFamily="Inter,sans-serif" transform="rotate(-90,248,155)">Peñafrancia Ave.</text>

      {/* Area labels */}
      <text x="60" y="145" textAnchor="middle" fontSize="9" fill="#8C8580" fontFamily="Inter,sans-serif" fontWeight="600">Downtown</text>
      <text x="250" y="150" textAnchor="middle" fontSize="9" fill="#8C8580" fontFamily="Inter,sans-serif" fontWeight="600">City Center</text>

      {/* Route line */}
      <polyline
        points="180,260 180,170 180,80 220,80 280,80 280,130"
        fill="none" stroke="#16B8A6" strokeWidth="3.5" strokeDasharray="7,4"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.85"
      />

      {/* User marker */}
      <circle cx="180" cy="260" r="10" fill="#16B8A6" opacity="0.2" />
      <circle cx="180" cy="260" r="6" fill="#16B8A6" stroke="#fff" strokeWidth="2" />
      <text x="192" y="264" fontSize="9" fill="#0F8F83" fontFamily="Inter,sans-serif" fontWeight="600">You</text>

      {/* Destination marker */}
      <ellipse cx="280" cy="142" rx="6" ry="3" fill="rgba(0,0,0,0.15)" />
      <path d="M280 130 C280 125 273 118 273 112 A7 7 0 0 1 287 112 C287 118 280 125 280 130Z" fill="#F28C38" stroke="#fff" strokeWidth="1.5" />
      <circle cx="280" cy="112" r="3" fill="#fff" />

      {/* Destination label */}
      <rect x="250" y="92" width="56" height="15" rx="4" fill="#172322" opacity="0.85" />
      <text x="278" y="103" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="Inter,sans-serif" fontWeight="600">Café X</text>
    </svg>
  )
}

function DirectionsScreen({ onBack, onArrive }: { onBack: () => void; onArrive: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F7F9F8" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8E6" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 20px 12px", display: "flex", alignItems: "center", gap: 12 }}>
          <BackBtn onClick={onBack} />
          <span style={{ fontSize: 17, fontWeight: 700, color: "#172322" }}>Directions</span>
        </div>
      </div>

      {/* Map */}
      <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", height: 340, overflow: "hidden" }}>
        <MockMap />
      </div>

      {/* Bottom panel */}
      <div style={{ background: "#fff", borderTop: "1px solid #E2E8E6" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 20px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#172322", marginBottom: 4 }}>Café X</div>
            <div style={{ display: "flex", gap: 14 }}>
              <span style={{ fontSize: 13, color: "#667370" }}>1.4 km</span>
              <span style={{ fontSize: 13, color: "#667370" }}>Approximately 6 min</span>
            </div>
          </div>
          <StatusBadge status="Open now" />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <PrimaryBtn label="Start Navigation" onClick={onArrive} />
          <button
            onClick={onArrive}
            style={{
              flex: "none", padding: "13px 18px", borderRadius: 10,
              background: "#F7F9F8", border: "1.5px solid #E2E8E6",
              fontSize: 14, fontWeight: 600, color: "#172322",
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            I&apos;m Here
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

// ─── Screen: Check-in ─────────────────────────────────────────────────────────
function CheckinScreen({ onBack, onScan }: { onBack: () => void; onScan: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F7F9F8" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8E6" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 20px 20px" }}>
          <BackBtn onClick={onBack} />
          <h1 style={{ marginTop: 16, fontSize: 22, fontWeight: 700, color: "#172322", letterSpacing: "-0.03em", marginBottom: 6 }}>
            Complete your Sidequest
          </h1>
          <p style={{ fontSize: 14, color: "#667370", lineHeight: 1.5 }}>
            You&apos;re at Café X. Check in to record your visit and earn points.
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        {/* Scanner */}
        <div style={{
          width: 240, height: 240,
          position: "relative",
          background: "#172322",
          borderRadius: 16, overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          {/* QR code placeholder */}
          <div style={{ width: 140, height: 140, position: "relative" }}>
            {/* Simulated QR pattern */}
            <svg width="140" height="140" viewBox="0 0 140 140">
              <rect width="140" height="140" fill="#172322" />
              {/* Corner squares */}
              <rect x="8" y="8" width="36" height="36" rx="4" fill="none" stroke="#fff" strokeWidth="3" />
              <rect x="14" y="14" width="24" height="24" rx="2" fill="#fff" />
              <rect x="96" y="8" width="36" height="36" rx="4" fill="none" stroke="#fff" strokeWidth="3" />
              <rect x="102" y="14" width="24" height="24" rx="2" fill="#fff" />
              <rect x="8" y="96" width="36" height="36" rx="4" fill="none" stroke="#fff" strokeWidth="3" />
              <rect x="14" y="102" width="24" height="24" rx="2" fill="#fff" />
              {/* Data modules */}
              {[0,1,2,3,4,5,6,7].map(row =>
                [0,1,2,3,4,5,6,7].map(col => {
                  const skip = (row < 3 && col < 3) || (row < 3 && col > 4) || (row > 4 && col < 3)
                  const on = !skip && Math.random() > 0.45
                  return on ? <rect key={`${row}-${col}`} x={54 + col * 8} y={54 + row * 8} width="6" height="6" fill="#fff" /> : null
                })
              )}
              {[...Array(20)].map((_, i) => (
                <rect key={i} x={50 + (i % 5) * 10} y={50 + Math.floor(i / 5) * 10} width="7" height="7" fill={Math.random() > 0.5 ? "#fff" : "#172322"} />
              ))}
            </svg>
          </div>
          {/* Scan frame corners */}
          {[
            [8,8, "topleft"],
            [192,8, "topright"],
            [8,192, "bottomleft"],
            [192,192, "bottomright"],
          ].map(([x,y,pos]) => (
            <div key={pos as string} style={{
              position: "absolute",
              left: x as number, top: y as number,
              width: 28, height: 28,
              borderColor: "#16B8A6",
              borderStyle: "solid",
              borderWidth: 0,
              ...(pos === "topleft" ? { borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 6 } : {}),
              ...(pos === "topright" ? { borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 6 } : {}),
              ...(pos === "bottomleft" ? { borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 6 } : {}),
              ...(pos === "bottomright" ? { borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 } : {}),
            }} />
          ))}
          {/* Scan line */}
          <div className="sq-scan-line" style={{
            position: "absolute", left: 24, right: 24, height: 2,
            background: "#16B8A6", opacity: 0.8,
          }} />
        </div>

        <p style={{ fontSize: 14, color: "#667370", textAlign: "center", marginBottom: 28, lineHeight: 1.5 }}>
          Scan the location QR code to check in.
        </p>
        <PrimaryBtn label="Demo Scan" onClick={onScan} full={false} />
      </div>
    </div>
  )
}

// ─── Screen: Success ──────────────────────────────────────────────────────────
function SuccessScreen({ onAnother, onHome }: { onAnother: () => void; onHome: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F7F9F8", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ maxWidth: 480, width: "100%" }}>
      {/* Check mark */}
      <div style={{
        width: 64, height: 64, borderRadius: 32,
        background: "#E6F8F5",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, color: "#16B8A6",
      }}>
        <IconCheck size={28} />
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#16B8A6", textTransform: "uppercase", marginBottom: 8 }}>
        Sidequest Complete
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#172322", letterSpacing: "-0.03em", marginBottom: 4, textAlign: "center" }}>
        Café X
      </h1>
      <p style={{ fontSize: 14, color: "#667370", marginBottom: 24, textAlign: "center" }}>
        You discovered somewhere new.
      </p>

      {/* Points */}
      <div style={{
        background: "#FFF1E6", borderRadius: 12, padding: "14px 28px",
        display: "flex", alignItems: "center", gap: 10, marginBottom: 28,
        border: "1px solid #F28C38",
      }}>
        <IconTrophy size={20} />
        <span style={{ fontSize: 22, fontWeight: 700, color: "#F28C38" }}>+50 Points</span>
      </div>

      {/* Progress */}
      <div style={{ width: "100%", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#172322" }}>250 / 500 Points</span>
          <span style={{ fontSize: 13, color: "#667370" }}>50%</span>
        </div>
        <div style={{ height: 6, background: "#E2E8E6", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: "50%", height: "100%", background: "#16B8A6", borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 12, color: "#667370", marginTop: 6, textAlign: "center" }}>
          12 Sidequests completed
        </div>
      </div>

      {/* Achievements */}
      <div style={{ width: "100%", marginBottom: 28 }}>
        {[
          { label: "First Sidequest", desc: "Complete your first visit", done: true },
          { label: "Cafe Explorer", desc: "Visit 5 cafes", done: true },
          { label: "Local Explorer", desc: "Visit 10 places", done: false },
        ].map(a => (
          <div key={a.label} style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 10,
            background: "#fff", borderRadius: 10, padding: "10px 14px",
            border: "1px solid #E2E8E6",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 14,
              background: a.done ? "#E6F8F5" : "#F7F9F8",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              color: a.done ? "#16B8A6" : "#CBD5D2",
            }}>
              {a.done ? <IconCheck size={14} /> : <IconTrophy size={14} />}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: a.done ? "#172322" : "#667370" }}>{a.label}</div>
              <div style={{ fontSize: 11, color: "#667370" }}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        <PrimaryBtn label="Find Another Sidequest" onClick={onAnother} />
        <SecondaryBtn label="Back to Explore" onClick={onHome} />
      </div>
      </div>
    </div>
  )
}

// ─── Screen: Surprise Loading ─────────────────────────────────────────────────
function SurpriseLoadingScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#F7F9F8", padding: "40px 20px" }}>
      <div style={{ marginBottom: 24, color: "#16B8A6" }} className="sq-pulse">
        <IconDice size={48} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#172322", letterSpacing: "-0.02em", marginBottom: 8, textAlign: "center" }}>
        Finding something for you...
      </h2>
      <p style={{ fontSize: 14, color: "#667370", textAlign: "center" }}>
        Discovering nearby places that match you.
      </p>
    </div>
  )
}

// ─── Screen: Surprise Result ──────────────────────────────────────────────────
function SurpriseResultScreen({ altIndex, onGo, onTryAnother, onBack }: {
  altIndex: number
  onGo: () => void
  onTryAnother: () => void
  onBack: () => void
}) {
  const place = altIndex === 0 ? PLACES.cafeX : SURPRISE_ALTS[(altIndex - 1) % SURPRISE_ALTS.length]
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F7F9F8" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", width: "100%", padding: "20px 20px 16px" }}>
        <BackBtn onClick={onBack} />
      </div>

      <div style={{ flex: 1, maxWidth: 680, margin: "0 auto", width: "100%", padding: "0 20px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#16B8A6", textTransform: "uppercase", marginBottom: 12 }}>
          Your Sidequest
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E8E6", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          <img src={place.image} alt={place.name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block", background: "#E6F8F5" }} />
          <div style={{ padding: "16px 18px 20px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#172322", letterSpacing: "-0.02em", marginBottom: 10 }}>{place.name}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                { label: `${place.distance} away`, icon: <IconMapPin size={14} color="#667370" /> },
                { label: place.price, icon: null },
                { label: `${place.rating} rating`, icon: <IconStar size={13} /> },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {item.icon}
                  <span style={{ fontSize: 14, color: "#172322" }}>{item.label}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconClock size={14} />
                <span style={{ fontSize: 14, color: "#16B8A6", fontWeight: 500 }}>Currently open</span>
              </div>
            </div>
            <div style={{
              background: "#E6F8F5", borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#0F8F83", lineHeight: 1.5,
            }}>
              Nearby, within your budget, and highly rated.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PrimaryBtn label="Let's Go" onClick={onGo} />
          <SecondaryBtn label="Try Another" onClick={onTryAnother} />
        </div>
      </div>
    </div>
  )
}

// ─── Screen: Explore ──────────────────────────────────────────────────────────
function ExploreScreen({ onNav, onPlace }: { onNav: (t: NavTab) => void; onPlace: (id: string) => void }) {
  const [activeFilter, setActiveFilter] = useState("Nearby")
  const [activeCategory, setActiveCategory] = useState("")
  const filters = ["Nearby", "Open Now", "₱300", "Top Rated"]

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ padding: "20px 0 16px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#172322", marginBottom: 14 }}>Explore</h1>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#fff", border: "1px solid #E2E8E6",
            borderRadius: 10, padding: "10px 14px",
          }}>
            <IconSearch size={16} />
            <span style={{ fontSize: 14, color: "#9AAFAB" }}>Search places</span>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: activeFilter === f ? "#16B8A6" : "#fff",
              color: activeFilter === f ? "#fff" : "#172322",
              border: `1px solid ${activeFilter === f ? "#16B8A6" : "#E2E8E6"}`,
              cursor: "pointer",
            }}>{f}</button>
          ))}
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {CATEGORIES.map(cat => {
            const sel = activeCategory === cat.id
            return (
              <button key={cat.id} onClick={() => setActiveCategory(sel ? "" : cat.id)} style={{
                padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                background: sel ? "#E6F8F5" : "#fff",
                color: sel ? "#0F8F83" : "#667370",
                border: `1px solid ${sel ? "#16B8A6" : "#E2E8E6"}`,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              }}>
                <cat.Icon size={13} />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Recommended */}
        <div style={{ fontSize: 15, fontWeight: 700, color: "#172322", marginBottom: 14 }}>Recommended near you</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {Object.values(PLACES).map(p => (
            <div key={p.id} style={{
              background: "#fff", border: "1px solid #E2E8E6", borderRadius: 12, overflow: "hidden",
              display: "flex", cursor: "pointer",
            }} onClick={() => onPlace(p.id)}>
              <img src={p.image} alt={p.name} style={{ width: 90, height: 90, objectFit: "cover", flexShrink: 0, background: "#E6F8F5" }} />
              <div style={{ flex: 1, padding: "10px 14px" }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#172322", marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#667370", marginBottom: 5 }}>{p.category} · {p.distance} · {p.price}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <RatingChip rating={p.rating} />
                  <StatusBadge status={p.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="explore" onNav={onNav} />
    </div>
  )
}

// ─── Screen: Saved ────────────────────────────────────────────────────────────
function SavedScreen({ onNav, onPlace, saved, onRemove }: {
  onNav: (t: NavTab) => void
  onPlace: (id: string) => void
  saved: string[]
  onRemove: (id: string) => void
}) {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 20px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#172322", marginBottom: 4 }}>Saved</h1>
        <p style={{ fontSize: 13, color: "#667370", marginBottom: 20 }}>Places you want to visit later.</p>

        {saved.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ color: "#CBD5D2", marginBottom: 12 }}><IconBookmark active={false} /></div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#172322", marginBottom: 6 }}>No saved places yet.</div>
            <div style={{ fontSize: 13, color: "#667370", marginBottom: 20 }}>Save places you want to visit later.</div>
            <PrimaryBtn label="Explore" onClick={() => onNav("explore")} full={false} />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {saved.map(id => (
              <SavedCard key={id} place={PLACES[id]} onRemove={() => onRemove(id)} />
            ))}
          </div>
        )}
      </div>

      <BottomNav active="saved" onNav={onNav} />
    </div>
  )
}

// ─── Screen: Profile ──────────────────────────────────────────────────────────
function ProfileScreen({ onNav }: { onNav: (t: NavTab) => void }) {
  const sections = [
    { label: "Saved Places", icon: <IconBookmark active={false} /> },
    { label: "Visit History", icon: <IconMapPin size={20} color="#667370" /> },
    { label: "Preferences", icon: <IconSettings size={20} /> },
    { label: "Settings", icon: <IconSettings size={20} /> },
  ]

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 20px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#172322", marginBottom: 20 }}>Profile</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: "#E6F8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#172322" }}>Sidequest Explorer</div>
            <div style={{ fontSize: 13, color: "#667370" }}>Naga City</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[{ value: "12", label: "Sidequests" }, { value: "650", label: "Points" }, { value: "8", label: "Places Visited" }].map(s => (
            <div key={s.label} style={{ flex: 1, background: "#fff", border: "1px solid #E2E8E6", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#172322" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#667370", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div style={{ background: "#fff", border: "1px solid #E2E8E6", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#172322" }}>650 / 1000 Points</span>
            <span style={{ fontSize: 13, color: "#667370" }}>65%</span>
          </div>
          <div style={{ height: 6, background: "#E2E8E6", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: "65%", height: "100%", background: "#16B8A6", borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 12, color: "#667370", marginTop: 6 }}>350 points to next milestone</div>
        </div>

        {/* Sections */}
        <div style={{ background: "#fff", border: "1px solid #E2E8E6", borderRadius: 12, overflow: "hidden" }}>
          {sections.map((s, i) => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              borderBottom: i < sections.length - 1 ? "1px solid #E2E8E6" : "none", cursor: "pointer",
            }}>
              <div style={{ color: "#667370" }}>{s.icon}</div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#172322" }}>{s.label}</span>
              <IconChevronRight size={16} />
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="profile" onNav={onNav} />
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [selectedPlace, setSelectedPlace] = useState("cafeX")
  const [placeOrigin, setPlaceOrigin] = useState<Screen>("recommendations")
  const [surpriseAlt, setSurpriseAlt] = useState(0)
  const [savedPlaces, setSavedPlaces] = useState<string[]>(["cafeX", "viewpointPark", "localBites"])

  const go = useCallback((s: Screen) => setScreen(s), [])

  const handleNav = (tab: NavTab) => {
    const map: Record<NavTab, Screen> = { home: "home", explore: "explore", saved: "saved", profile: "profile" }
    go(map[tab])
  }

  const handleSurprise = () => {
    go("surprise-loading")
    setTimeout(() => go("surprise-result"), 1800)
  }

  const handleTryAnother = () => {
    setSurpriseAlt(n => n + 1)
    go("surprise-loading")
    setTimeout(() => go("surprise-result"), 1200)
  }

  const handlePlace = (id: string, origin: Screen = screen as Screen) => {
    setSelectedPlace(id)
    setPlaceOrigin(origin)
    go("place-detail")
  }

  const handleToggleSave = (id: string) => {
    setSavedPlaces(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  function renderScreen() {
    switch (screen) {
      case "home":
        return (
          <HomeScreen
            onExplore={() => go("category")}
            onSurprise={handleSurprise}
            onNav={handleNav}
            onPlace={id => handlePlace(id, "home")}
            onProfile={() => go("profile")}
          />
        )
      case "category":
        return <CategoryScreen onBack={() => go("home")} onContinue={() => go("preferences")} />
      case "preferences":
        return <PreferencesScreen onBack={() => go("category")} onFind={() => go("recommendations")} />
      case "recommendations":
        return <RecommendationsScreen onBack={() => go("preferences")} onPlace={id => handlePlace(id, "recommendations")} />
      case "place-detail":
        return (
          <PlaceDetailScreen
            placeId={selectedPlace}
            onBack={() => go(placeOrigin)}
            onDirections={() => go("directions")}
            onSave={() => handleToggleSave(selectedPlace)}
            isSaved={savedPlaces.includes(selectedPlace)}
          />
        )
      case "directions":
        return <DirectionsScreen onBack={() => go("place-detail")} onArrive={() => go("checkin")} />
      case "checkin":
        return <CheckinScreen onBack={() => go("directions")} onScan={() => go("success")} />
      case "success":
        return <SuccessScreen onAnother={() => go("category")} onHome={() => go("home")} />
      case "surprise-loading":
        return <SurpriseLoadingScreen />
      case "surprise-result": {
        const surprisePlace = surpriseAlt === 0 ? "cafeX" : SURPRISE_ALTS[(surpriseAlt - 1) % SURPRISE_ALTS.length].id
        return (
          <SurpriseResultScreen
            altIndex={surpriseAlt}
            onGo={() => handlePlace(surprisePlace, "surprise-result")}
            onTryAnother={handleTryAnother}
            onBack={() => go("home")}
          />
        )
      }
      case "explore":
        return <ExploreScreen onNav={handleNav} onPlace={id => handlePlace(id, "explore")} />
      case "saved":
        return (
          <SavedScreen
            onNav={handleNav}
            onPlace={id => handlePlace(id, "saved")}
            saved={savedPlaces}
            onRemove={id => setSavedPlaces(s => s.filter(x => x !== id))}
          />
        )
      case "profile":
        return <ProfileScreen onNav={handleNav} />
    }
  }

  return (
    <div key={screen} className="sq-screen" style={{ width: "100%", minHeight: "100vh", background: "#F7F9F8" }}>
      {renderScreen()}
    </div>
  )
}
