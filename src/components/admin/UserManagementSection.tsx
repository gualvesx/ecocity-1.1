
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, UserCheck, UserX, UserPlus, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';

// Esquema de validação para o formulário de criação de usuário
const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  isAdmin: z.boolean().default(false)
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const UserManagementSection = () => {
  const { user } = useAuth();
  const { users, isLoading, error, fetchUsers, updateUserAdminStatus, createUser } = useFirebaseUsers();
  const [showUserForm, setShowUserForm] = useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      isAdmin: false
    }
  });

  console.log("UserManagementSection - Current user:", user);
  console.log("UserManagementSection - Users from Firebase:", users);

  const handleToggleAdmin = async (userId: string, makeAdmin: boolean) => {
    try {
      console.log(`UserManagement: Attempting to update user ${userId} to admin status: ${makeAdmin}`);
      const success = await updateUserAdminStatus(userId, makeAdmin);
      
      if (success) {
        toast.success(`Usuário ${makeAdmin ? 'promovido a administrador' : 'removido de administrador'} com sucesso!`);
      } else {
        toast.error('Falha ao atualizar status do usuário');
      }
    } catch (error) {
      toast.error('Erro ao atualizar status do usuário');
      console.error(error);
    }
  };

  const onSubmitCreateUser = async (data: CreateUserFormValues) => {
    try {
      console.log("UserManagement: Creating new user with data:", {
        ...data,
        password: "[REDACTED]"
      });
      
      const success = await createUser(data.name, data.email, data.password, data.isAdmin);
      
      if (success) {
        toast.success('Usuário criado com sucesso!');
        form.reset();
        setShowUserForm(false);
      } else {
        toast.error('Falha ao criar usuário');
      }
    } catch (error) {
      toast.error('Erro ao criar usuário');
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'N/A';
    }
  };

  // If user is not admin, don't show anything
  if (!user?.isAdmin) {
    console.log("User is not admin, not showing user management section");
    return (
      <div className="text-center py-8 text-muted-foreground">
        Você não tem permissão para gerenciar usuários
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Erro ao carregar usuários: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-eco-green" />
          <h2 className="text-xl font-semibold">Usuários Cadastrados ({users.length})</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={fetchUsers}
            variant="outline"
            disabled={isLoading}
            className="h-9 w-9 p-0"
            title="Atualizar lista de usuários"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button 
            onClick={() => setShowUserForm(!showUserForm)} 
            className="bg-eco-green hover:bg-eco-green-dark"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {showUserForm ? 'Cancelar' : 'Adicionar Usuário'}
          </Button>
        </div>
      </div>
      
      {showUserForm && (
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Adicionar Novo Usuário</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCreateUser)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md py-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-eco-green focus:ring-eco-green"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Usuário Administrador
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-eco-green hover:bg-eco-green-dark"
                >
                  {isLoading ? 'Criando...' : 'Criar Usuário'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Bio</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Data de Criação</th>
                <th className="px-4 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(userItem => (
                <tr key={userItem.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{userItem.name}</td>
                  <td className="px-4 py-3">{userItem.email}</td>
                  <td className="px-4 py-3 max-w-32 truncate">{userItem.bio || 'Sem bio'}</td>
                  <td className="px-4 py-3">
                    {userItem.isAdmin || userItem.role === 'admin' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-eco-green text-white">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Usuário
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{formatDate(userItem.createdAt || '')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {userItem.isAdmin || userItem.role === 'admin' ? (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          disabled={isLoading}
                          onClick={() => handleToggleAdmin(userItem.id, false)}
                          className="text-xs"
                        >
                          <UserX className="h-3 w-3 mr-1" />
                          Remover Admin
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => handleToggleAdmin(userItem.id, true)}
                          className="text-xs"
                        >
                          <UserCheck className="h-3 w-3 mr-1" />
                          Tornar Admin
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {isLoading ? 'Carregando usuários...' : 'Nenhum usuário encontrado'}
          </div>
        )}
      </div>
    </div>
  );
};
