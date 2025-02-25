import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export const Card = ({ children }: CardProps) => {
  return (
    <div className="border rounded-2xl shadow-md p-4 bg-white">{children}</div>
  );
};
