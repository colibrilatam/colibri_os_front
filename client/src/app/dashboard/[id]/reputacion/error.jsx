'use client';

import ErrorScreen from "@/components/ErrorScreen";

export default function ProyectosError({ error, reset }) {
  return <ErrorScreen error={error} reset={reset} />;
}
