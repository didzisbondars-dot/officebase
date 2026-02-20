"use client";

import { useState, useCallback } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { RangeSlider } from "./RangeSlider";
import type { SearchFilters } from "@/types";
import {
  STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  AMENITIES_OPTIONS,
} from "@/types";

interface SearchFiltersProps {
  districts?: string[];
  onFiltersChange: (filters: SearchFilters) => void;
  cities?: string[];
  className?: string;
}

export function SearchFiltersPanel({
  onFiltersChange,
  cities = [],
  className,
}: SearchFiltersProps) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [district, setDistrict] = useState("");
  const [minArea, setMinArea] = useState("");
  const [rentRange, setRentRange] = useState<[number, number]>([0, 20]);
  const [maxArea, setMaxArea] = useState("");

  const applyFilters = useCallback(
    (overrides?: Partial<SearchFilters>) => {
      onFiltersChange({
        query: query || undefined,
        city: city || undefined,
        status: selectedStatus.length ? selectedStatus : undefined,
        propertyType: selectedTypes.length ? selectedTypes : undefined,
        minArea: minArea ? Number(minArea) : undefined,
        maxArea: maxArea ? Number(maxArea) : undefined,
        ...overrides,
      });
    },
    [query, city, selectedStatus, selectedTypes, minArea, maxArea, onFiltersChange]
  );

  const handleQueryChange = (q: string) => {
    setQuery(q);
    onFiltersChange({
      query: q || undefined,
      city: city || undefined,
      status: selectedStatus.length ? selectedStatus : undefined,
      propertyType: selectedTypes.length ? selectedTypes : undefined,
    });
  };

  const toggleStatus = (status: string) => {
    const next = selectedStatus.includes(status)
      ? selectedStatus.filter((s) => s !== status)
      : [...selectedStatus, status];
    setSelectedStatus(next);
    onFiltersChange({
      query: query || undefined,
      city: city || undefined,
      status: next.length ? next : undefined,
      propertyType: selectedTypes.length ? selectedTypes : undefined,
    });
  };

  const toggleType = (type: string) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(next);
    onFiltersChange({
      query: query || undefined,
      city: city || undefined,
      status: selectedStatus.length ? selectedStatus : undefined,
      propertyType: next.length ? next : undefined,
    });
  };

  const clearAll = () => {
    setQuery("");
    setCity("");
    setSelectedStatus([]);
    setSelectedTypes([]);
    setMinArea("");
    setMaxArea("");
    setRentRange([0, 30]);
    onFiltersChange({});
  };

  const hasFilters =
    query || city || selectedStatus.length || selectedTypes.length || minArea || maxArea || rentRange[0] > 0 || rentRange[1] < 20;

  return (
    <div className={cn("bg-white rounded-2xl border border-border p-5", className)}>
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by project name, developer, district..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20 focus:border-[var(--brand-navy)] transition-all"
        />
      </div>

      {/* Quick filters row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* District */}
          <div className="relative">
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                onFiltersChange({
                  query: query || undefined,
                  district: e.target.value || undefined,
                  status: selectedStatus.length ? selectedStatus : undefined,
                  propertyType: selectedTypes.length ? selectedTypes : undefined,
                });
              }}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20 focus:border-[var(--brand-navy)] bg-white transition-all cursor-pointer"
            >
              <option value="">All Areas</option>
              {["Centrs", "Labais krasts", "Pārdaugava", "Skanste", "Vecrīga"].map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

        {/* Status pills */}
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => toggleStatus(status)}
            className={cn(
              "px-3 py-2 text-sm rounded-lg border transition-all",
              selectedStatus.includes(status)
                ? "bg-[var(--brand-navy)] text-white border-[var(--brand-navy)]"
                : "bg-white text-foreground/70 border-border hover:border-[var(--brand-navy)]/40"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Property type */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PROPERTY_TYPE_OPTIONS.map((type) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={cn(
              "px-3 py-2 text-sm rounded-lg border transition-all",
              selectedTypes.includes(type)
                ? "bg-[var(--brand-gold)] text-white border-[var(--brand-gold)]"
                : "bg-white text-foreground/70 border-border hover:border-[var(--brand-gold)]/40"
            )}
          >
            {type}
          </button>
        ))}
      </div>
      {/* Rent rate slider */}
      <div className="mb-6 w-1/2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground/70">Asking Rent Rate</label>
          <span className="text-sm font-semibold text-[var(--brand-navy)]">
            {rentRange[0] === 0 && rentRange[1] === 20
              ? "Any price"
              : `€${rentRange[0]} – €${rentRange[1]}/sqm`}
          </span>
        </div>
        <RangeSlider
          min={0}
          max={20}
          values={rentRange}
          ticks={[5, 7, 10, 12.5, 15, 20]}
          onChange={(next) => {
            setRentRange(next);
            onFiltersChange({
              query: query || undefined,
              district: district || undefined,
              status: selectedStatus.length ? selectedStatus : undefined,
              propertyType: selectedTypes.length ? selectedTypes : undefined,
              minRent: next[0] > 0 ? next[0] : undefined,
              maxRent: next[1] < 20 ? next[1] : undefined,
            });
          }}
        />
      </div>

      {/* Advanced filters */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Advanced Filters
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showAdvanced && "rotate-180")} />
      </button>

      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Min Area (sqm)
              </label>
              <input
                type="number"
                placeholder="0"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                onBlur={() => applyFilters()}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Max Area (sqm)
              </label>
              <input
                type="number"
                placeholder="Any"
                value={maxArea}
                onChange={(e) => setMaxArea(e.target.value)}
                onBlur={() => applyFilters()}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="mt-3 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear all filters
        </button>
      )}
    </div>
  );
}
