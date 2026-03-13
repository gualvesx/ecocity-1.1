
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Edit } from "lucide-react";

export const ProfileCompletionModal = () => {
  const [open, setOpen] = useState(false);
  const { user, checkProfileCompletion } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in, has never completed their profile
    if (user && !checkProfileCompletion()) {
      const hasSeenModal = localStorage.getItem(`profile-modal-seen-${user.id}`);
      if (!hasSeenModal) {
        const timer = setTimeout(() => {
          setOpen(true);
        }, 2000); // Show after 2 seconds

        return () => clearTimeout(timer);
      }
    }
  }, [user, checkProfileCompletion]);

  const handleComplete = () => {
    navigate("/profile");
    setOpen(false);
    if (user) {
      localStorage.setItem(`profile-modal-seen-${user.id}`, "true");
    }
  };

  const handleSkip = () => {
    setOpen(false);
    if (user) {
      localStorage.setItem(`profile-modal-seen-${user.id}`, "true");
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-eco-green" />
            Complete seu perfil
          </DialogTitle>
          <DialogDescription>
            Adicione informações ao seu perfil para uma experiência mais personalizada.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Como novo usuário, gostaríamos que você completasse seu perfil adicionando uma pequena 
            biografia e, se desejar, uma foto. Isso ajudará a comunidade a conhecer melhor quem está 
            contribuindo para as iniciativas ecológicas.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleSkip}
            className="sm:mr-auto"
          >
            Completar depois
          </Button>
          <Button 
            onClick={handleComplete}
            className="bg-eco-green hover:bg-eco-green-dark"
          >
            <Edit className="mr-2 h-4 w-4" />
            Completar agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
