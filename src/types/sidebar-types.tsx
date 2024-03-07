import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLProps } from "react";

export interface NavItemProps extends SignOutButtonProps {
  link: string;
  isActive?: boolean;
  isCategory?: boolean;
}

export interface SignOutButtonProps {
  icon?: string;
  tooltip?: string;
  signout?: () => void;
}