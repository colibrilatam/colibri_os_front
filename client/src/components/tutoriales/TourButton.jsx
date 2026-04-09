"use client";
import { useOnborda } from "onborda";
import Button from "@/components/Button";

export default function TourButton({ tourName }) {
  const { startOnborda } = useOnborda();
  return (
    <Button content="Iniciar tour" onClick={() => startOnborda(tourName)} />
  );
}