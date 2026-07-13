import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface AppSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function AppSelect({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  className,
}: AppSelectProps) {
  const items = Object.fromEntries(options.map((option) => [option.value, option.label]));

  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next ?? "")}
      items={items}
      disabled={disabled}
      modal
    >
      <SelectTrigger className={cn("h-10 w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} sideOffset={6}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
