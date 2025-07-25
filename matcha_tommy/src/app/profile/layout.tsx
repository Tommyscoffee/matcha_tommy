"use client";
import { RegisterProvider } from "~/src/context/ProfileContext";

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <RegisterProvider>
      {children}
    </RegisterProvider>
  );
}
