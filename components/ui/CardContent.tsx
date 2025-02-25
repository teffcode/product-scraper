import { ReactNode } from "react";

interface CardContentProps {
  children: ReactNode;
}

export const CardContent = ({ children }: CardContentProps) => {
  return <div className="mt-2">{children}</div>;
};
