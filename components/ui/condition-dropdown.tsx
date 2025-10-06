'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ConditionOption {
  value: string;
  label: string;
  description: string;
}

interface ConditionDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const conditionOptions: ConditionOption[] = [
  {
    value: 'new',
    label: 'Nytt skick - Helt ny',
    description: 'Obruten förpackning eller lappen är kvar, varan är aldrig använd.'
  },
  {
    value: 'excellent',
    label: 'Mycket bra skick - Som ny',
    description: 'Det finns inga tecken på användning men varan kan vara använd någon enstaka gång.'
  },
  {
    value: 'good',
    label: 'Bra skick - Sparsamt använd',
    description: 'Det finns få tecken på användning och varan är väl omhändertagen.'
  },
  {
    value: 'fair',
    label: 'Okej skick - Synligt använd',
    description: 'Det finns flera tecken på användning som skador, repor och hål.'
  },
  {
    value: 'broken',
    label: 'Funkar inte - Kan fixas',
    description: 'Trasig eller saknar viktiga delar som påverkar funktionaliteten.'
  }
];

export function ConditionDropdown({
  value,
  onChange,
  placeholder = "Välj från listan",
  className = ""
}: ConditionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = conditionOptions.find(option => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background shadow-lg">
          <div className="max-h-60 overflow-auto">
            {conditionOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className="w-full px-3 py-3 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              >
                <div className="font-medium text-sm text-foreground mb-1">
                  {option.label}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export the condition options for use in other components
export { conditionOptions };
