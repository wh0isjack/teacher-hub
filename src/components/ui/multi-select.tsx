import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Badge } from "./badge";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

export function MultiSelect({ options, selected = [], onChange, placeholder = "Selecione..." }) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selected.length > 0 ? `${selected.length} selecionado(s)` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandGroup>
            <ScrollArea className="max-h-[200px]">
              {options.map((option) => (
                <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                  <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selected.includes(option.value) ? "bg-primary text-primary-foreground" : "opacity-50")}>
                    {selected.includes(option.value) && <Check className="h-4 w-4" />}
                  </div>
                  {option.label}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>

      <div className="mt-2 flex flex-wrap gap-1">
        {selected.map((value) => {
          const label = options.find((o) => o.value === value)?.label ?? value;
          return (
            <Badge key={value} variant="secondary" className="flex items-center gap-1">
              {label}
              <X onClick={() => handleRemove(value)} className="ml-1 h-3 w-3 cursor-pointer" />
            </Badge>
          );
        })}
      </div>
    </Popover>
  );
}
