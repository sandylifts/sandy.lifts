"use client";
import { useEffect } from "react";

export default function IntakePage() {
  useEffect(() => {
    window.location.replace("/#intake");
  }, []);
  return null;
}
