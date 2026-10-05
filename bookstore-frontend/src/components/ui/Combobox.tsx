import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string;
}

interface ComboboxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Combobox({ options, value, onChange, placeholder = "Select...", disabled }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[activeIndex]) {
          onChange(filteredOptions[activeIndex].value);
          setIsOpen(false);
          setSearchTerm('');
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setActiveIndex(0);
          setIsOpen(!isOpen);
          setSearchTerm('');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-muted-foreground"
        )}
      >
        <span className="truncate">{displayValue || placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1" ref={listRef}>
            {filteredOptions.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">No options found.</p>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    value === option.value && "bg-accent/50 text-accent-foreground font-medium",
                    activeIndex === index && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {value === option.value && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
