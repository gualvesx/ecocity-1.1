
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showRequirements?: boolean;
  required?: boolean;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'Pelo menos 6 caracteres',
    test: (password) => password.length >= 6
  },
  {
    label: 'Pelo menos 1 caractere maiúsculo',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    label: 'Pelo menos 1 caractere minúsculo',
    test: (password) => /[a-z]/.test(password)
  },
  {
    label: 'Pelo menos 1 caractere especial',
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
  },
  {
    label: 'Pelo menos 1 número',
    test: (password) => /\d/.test(password)
  }
];

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "Digite sua senha",
  showRequirements = false,
  required = false,
  className
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={cn("pr-10", className)}
          value={value}
          onChange={onChange}
          required={required}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          </span>
        </Button>
      </div>
      
      {showRequirements && value && (
        <div className="space-y-2 p-3 bg-muted/50 rounded-md">
          <p className="text-sm font-medium text-muted-foreground">Requisitos da senha:</p>
          <div className="space-y-1">
            {passwordRequirements.map((requirement, index) => {
              const isValid = requirement.test(value);
              return (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {isValid ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span className={cn(
                    isValid ? 'text-green-600' : 'text-red-500'
                  )}>
                    {requirement.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
