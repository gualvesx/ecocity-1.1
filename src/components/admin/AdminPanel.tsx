import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Users, Shield, UserCheck, UserX, UserPlus, RefreshCw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { userService } from '@/services/userService';
import { User } from '@/types/user';

// Esquema de validação para o formulário de criação de usuário
const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  isAdmin: z.boolean().default(false)
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

const AdminPanel = () => {
  const { user, updateUserAdminStatus, createUserByAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      isAdmin: false
    }
  });

  // Fetch users from userService
  const fetchUsers = async () => {
    if (!user?.isAdmin) return;
    
    setIsLoading(true);
    try {
      console.log("AdminPanel: Fetching users from userService");
      const fetchedUsers = await userService.getAllUsers();
      console.log("AdminPanel: Users fetched successfully:", fetchedUsers);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("AdminPanel: Error fetching users:", error);
      toast.error('Erro ao carregar usuários');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("AdminPanel - Current user:", user);
    console.log("Admin status:", user?.isAdmin);
    
    // Redirect if not admin or not logged in
    if (!user) {
      console.log("User not logged in, redirecting to login");
      navigate('/login');
    } else if (!user.isAdmin) {
      console.log("User is not admin, redirecting to map");
      navigate('/map');
    } else {
      console.log("User is admin, loading user list");
      fetchUsers();
    }
  }, [user, navigate, refreshTrigger]);

  // Early return with loading state while checking user and admin status
  if (isLoading && !users.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Carregando painel administrativo...</p>
      </div>
    );
  }

  // Keep this check to prevent rendering if user is not admin
  if (!user?.isAdmin) {
    return null;
  }

  const handleToggleAdmin = async (userId: string, makeAdmin: boolean) => {
    setIsLoading(true);
    try {
      console.log(`AdminPanel: Attempting to update user ${userId} to admin status: ${makeAdmin}`);
      const success = await updateUserAdminStatus(userId, makeAdmin);
      
      if (success) {
        toast.success(`Usuário ${makeAdmin ? 'promovido a administrador' : 'removido de administrador'} com sucesso!`);
        // Trigger a refresh
        setRefreshTrigger(prev => prev + 1);
      } else {
        toast.error('Falha ao atualizar status do usuário');
      }
    } catch (error) {
      toast.error('Erro ao atualizar status do usuário');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user.id) {
      toast.error('Você não pode excluir sua própria conta');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`AdminPanel: Attempting to delete user ${userId}`);
      const success = await userService.deleteUser(userId);
      
      if (success) {
        toast.success('Usuário excluído com sucesso!');
        setRefreshTrigger(prev => prev + 1);
      } else {
        toast.error('Falha ao excluir usuário');
      }
    } catch (error) {
      toast.error('Erro ao excluir usuário');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCreateUser = async (data: CreateUserFormValues) => {
    setIsLoading(true);
    try {
      console.log("AdminPanel: Creating new user with data:", {
        ...data,
        password: "[REDACTED]"
      });
      
      const success = await createUserByAdmin(data.name, data.email, data.password, data.isAdmin);
      
      if (success) {
        toast.success('Usuário criado com sucesso!');
        form.reset();
        setShowUserForm(false);
        // Trigger a refresh - increase the delay to ensure Firestore has time to update
        setTimeout(() => {
          setRefreshTrigger(prev => prev + 1);
        }, 1000);
      } else {
        toast.error('Falha ao criar usuário');
      }
    } catch (error) {
      toast.error('Erro ao criar usuário');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add manual refresh function
  const handleManualRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <Link to="/map" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Mapa</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-eco-green" />
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">Painel de Administração</h1>
          </div>
          
          <p className="text-lg text-muted-foreground">
            Gerencie usuários e tenha acesso a informações privilegiadas
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-eco-green" />
                <h2 className="text-xl font-semibold">Usuários Cadastrados ({users.length})</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleManualRefresh}
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Bio</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(userItem => (
                      <TableRow key={userItem.id}>
                        <TableCell className="font-medium">{userItem.name}</TableCell>
                        <TableCell>{userItem.email}</TableCell>
                        <TableCell className="max-w-32 truncate">{userItem.bio || 'Sem bio'}</TableCell>
                        <TableCell>
                          {userItem.isAdmin || userItem.role === 'admin' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-eco-green text-white">
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Usuário
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(userItem.createdAt || '')}</TableCell>
                        <TableCell>
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
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  disabled={isLoading || userItem.id === user.id}
                                  className="text-xs"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Excluir
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o usuário "{userItem.name}"? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteUser(userItem.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {isLoading ? 'Carregando usuários...' : 'Nenhum usuário encontrado'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
