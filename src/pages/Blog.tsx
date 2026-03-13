import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Search, Plus, Edit, Calendar, User, Clock, Eye, Heart, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useBlogs } from '@/hooks/useBlogs';
import { firebaseFirestore } from '@/services/firebaseFirestore';
import { toast } from 'sonner';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { blogs, isLoading, refetch } = useBlogs();
  
  const filteredPosts = blogs.filter(post =>
    (post.title || post.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.category || post.theme || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredPosts = blogs.filter(post => post.featured);

  const handleDeletePost = async (postId: string, postTitle: string) => {
    try {
      console.log('Blog: Excluindo post:', postId, postTitle);
      await firebaseFirestore.blogs.delete(postId);
      toast.success(`Post "${postTitle}" excluído com sucesso!`);
      await refetch(); // Recarregar a lista de posts
    } catch (error) {
      console.error('Blog: Erro ao excluir post:', error);
      toast.error('Erro ao excluir o post. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col pt-20">
        <div className="container px-4 py-8">
          <div className="flex justify-center items-center h-60">
            <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao início</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-eco-green-dark">Blog EcoCity</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Notícias e artigos sobre sustentabilidade e meio ambiente
            </p>
          </div>
          
          {user?.isAdmin && (
            <Link to="/blog/new">
              <Button className="bg-eco-green hover:bg-eco-green-dark">
                <Plus className="mr-2 h-4 w-4" />
                Novo Post
              </Button>
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar posts por título, conteúdo, categoria ou tags..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Featured Posts Carousel */}
        {!searchTerm && featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-eco-green-dark mb-6">Posts em Destaque</h2>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredPosts.map((post) => (
                  <CarouselItem key={post.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title || post.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-eco-green hover:bg-eco-green-dark text-white">
                            Destaque
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-white/90 text-eco-green-dark">
                            {post.category || post.theme}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-2 mb-3 group-hover:text-eco-green transition-colors">
                              {post.title || post.name}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground mb-3">
                              {post.excerpt}
                            </CardDescription>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{format(new Date(post.publishedAt || post.createdAt), "d 'de' MMM", { locale: ptBR })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                          </div>
                          
                          {user?.isAdmin && (
                            <div className="flex gap-1">
                              <Link to={`/blog/edit/${post.slug}`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o post "{post.title || post.name}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeletePost(post.id, post.title || post.name)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      
                      
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(post.tags || []).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{post.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{post.likes || 0}</span>
                            </div>
                          </div>
                          
                          <Link to={`/blog/${post.slug}`}>
                            <Button className="bg-eco-green hover:bg-eco-green-dark">
                              Ler mais
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}

        {/* All Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-eco-green-dark mb-6">
            {searchTerm ? 'Resultados da Busca' : 'Todos os Posts'}
          </h2>
          
          {filteredPosts.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum post encontrado para sua busca.' : 'Nenhum post disponível no momento.'}
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Limpar busca
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title || post.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 text-eco-green-dark text-xs">
                        {post.category || post.theme}
                      </Badge>
                    </div>
                    {post.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-eco-green hover:bg-eco-green-dark text-white text-xs">
                          Destaque
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2 mb-2 text-lg group-hover:text-eco-green transition-colors">
                          {post.title || post.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </CardDescription>
                      </div>
                      
                      {user?.isAdmin && (
                        <div className="flex gap-1">
                          <Link to={`/blog/edit/${post.slug}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o post "{post.title || post.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeletePost(post.id, post.title || post.name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  
                  <CardContent>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(post.publishedAt || post.createdAt), "d/MM", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(post.tags || []).slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(post.tags || []).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(post.tags || []).length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.likes || 0}</span>
                        </div>
                      </div>
                      
                      <Link to={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm">
                          Ler mais
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
