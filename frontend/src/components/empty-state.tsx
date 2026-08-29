"use client";

import React from "react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: "no-supporters" | "no-transactions" | "no-results" | "default";
}

export function EmptyState({
  title,
  description,
  icon,
  ctaLabel,
  ctaHref,
  variant = "default",
}: EmptyStateProps) {
  const getDefaultIcon = () => {
    switch (variant) {
      case "no-supporters":
        return (
          <svg
            className="mx-auto mb-6 h-20 w-20 text-gray-300 dark:text-gray-600/80 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        );
      case "no-transactions":
        return (
          <svg
            className="mx-auto mb-6 h-20 w-20 text-gray-300 dark:text-gray-600/80 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "no-results":
        return (
          <svg
            className="mx-auto mb-6 h-20 w-20 text-gray-300 dark:text-gray-600/80 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="mx-auto mb-6 h-20 w-20 text-gray-300 dark:text-gray-600/80 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-gray-50/50 dark:bg-white/[0.02]">
      {icon || getDefaultIcon()}
      <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-sm text-gray-500 dark:text-sky/60">
        {description}
      </p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-mint px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2 dark:focus:ring-offset-ocean"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
