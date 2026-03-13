
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag, Share2, Heart, BookOpen, Eye, Phone, Globe } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { blogPosts } from '@/data/blogPosts';
import { useBlogs } from '@/hooks/useBlogs';

// Função auxiliar para processar tags
const processTags = (tags: any, topics: any): string[] => {
  // Se tags já é um array válido, usar ele
  if (Array.isArray(tags) && tags.length > 0) {
    return tags;
  }
  
  // Se tags é uma string, dividir por vírgula
  if (typeof tags === 'string' && tags.trim()) {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  
  // Se topics é uma string, dividir por vírgula
  if (typeof topics === 'string' && topics.trim()) {
    return topics.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  
  // Fallback para array vazio
  return [];
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogs, isLoading: blogsLoading } = useBlogs();
  const [post, setPost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    console.log('BlogPost: URL slug capturado:', slug);
    console.log('BlogPost: Blogs do Firebase:', blogs);
    console.log('BlogPost: Posts estáticos:', blogPosts);
    
    setIsLoading(true);
    
    // Verificar se temos um slug válido
    if (!slug || slug === 'undefined') {
      console.log('BlogPost: Slug é inválido:', slug);
      setPost(null);
      setIsLoading(false);
      return;
    }
    
    // Aguardar os blogs do Firebase carregarem se ainda estão carregando
    if (blogsLoading) {
      console.log('BlogPost: Aguardando blogs carregarem...');
      return;
    }
    
    // Primeiro tentar encontrar nos blogs do Firebase
    let found = blogs.find(b => {
      console.log('Comparando blog do Firebase:', {
        blogSlug: b.slug,
        blogId: b.id,
        blogTitle: b.title || b.name,
        searchSlug: slug
      });
      return b.slug === slug || b.id === slug;
    });
    
    // Se não encontrar, tentar nos posts estáticos
    if (!found) {
      found = blogPosts.find(p => {
        console.log('Comparando post estático:', {
          postSlug: p.slug,
          postId: p.id,
          postTitle: p.title,
          searchSlug: slug
        });
        return p.slug === slug || p.id === slug;
      });
    }
    
    console.log('BlogPost: Post encontrado:', found);
    setPost(found || null);
    setIsLoading(false);
    
    if (found) {
      window.scrollTo(0, 0);
    }
  }, [slug, blogs, blogsLoading]);

  if (isLoading || blogsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-eco-green border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4">Carregando artigo...</p>
      </div>
    );
  }

  if (!slug || slug === 'undefined') {
    return (
      <div className="min-h-screen flex flex-col pt-20">
        <div className="container px-4 py-8">
          <Link to="/blog" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para o Blog</span>
          </Link>
          
          <Alert variant="destructive" className="mt-8">
            <AlertTitle>URL inválida</AlertTitle>
            <AlertDescription>
              A URL do artigo está incompleta ou malformada. Slug: {slug || 'não definido'}
            </AlertDescription>
          </Alert>
          
          <Button variant="default" className="mt-6 bg-eco-green hover:bg-eco-green-dark" asChild>
            <Link to="/blog">Voltar para o Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col pt-20">
        <div className="container px-4 py-8">
          <Link to="/blog" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para o Blog</span>
          </Link>
          
          <Alert variant="destructive" className="mt-8">
            <AlertTitle>Artigo não encontrado</AlertTitle>
            <AlertDescription>
              O artigo com slug "{slug}" não foi encontrado. Pode ter sido removido ou a URL está incorreta.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 space-y-4">
            <Button variant="default" className="bg-eco-green hover:bg-eco-green-dark" asChild>
              <Link to="/blog">Voltar para o Blog</Link>
            </Button>
            
            {/* Mostrar posts disponíveis para debug */}
            <details className="bg-gray-50 p-4 rounded">
              <summary className="cursor-pointer text-sm font-medium">Posts disponíveis (debug)</summary>
              <div className="mt-2 space-y-2 text-xs">
                <div>
                  <strong>Firebase Blogs ({blogs.length}):</strong>
                  {blogs.map(b => (
                    <div key={b.id} className="ml-2">
                      • {b.title || b.name} (slug: {b.slug || 'sem slug'})
                    </div>
                  ))}
                </div>
                <div>
                  <strong>Posts Estáticos ({blogPosts.length}):</strong>
                  {blogPosts.map(p => (
                    <div key={p.id} className="ml-2">
                      • {p.title} (slug: {p.slug})
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  }

  // Adaptar campos do Firebase vs posts estáticos
  const title = post.title || post.name;
  const category = post.category || post.theme;
  const publishedDate = post.publishedAt || post.createdAt;
  const tags = processTags(post.tags, post.topics);

  const relatedPosts = [...blogs, ...blogPosts].filter(p => 
    p.id !== post.id && 
    ((p.category || p.theme) === category || 
     (tags.length > 0 && tags.some((tag: string) => {
       const pTags = processTags(p.tags, p.topics);
       return pTags.includes(tag);
     })))
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para o Blog</span>
        </Link>
        
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header da Imagem */}
          <div className="relative h-64 md:h-96">
            <img 
              src={post.image} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6">
              <Badge className="bg-eco-green text-white text-sm font-medium px-3 py-2">
                {category}
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {title}
              </h1>
            </div>
          </div>
          
          {/* Conteúdo Principal */}
          <div className="p-6 md:p-8">
            {/* Meta informações */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-eco-green" />
                <span>Por <strong>{post.author}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-eco-green" />
                <span>{new Date(publishedDate).toLocaleDateString('pt-BR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-eco-green" />
                <span>{post.readTime} de leitura</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-eco-green" />
                <span>{post.views || 0} visualizações</span>
              </div>
            </div>

            {/* Informações de Contato (se disponíveis) */}
            {(post.openingHours || post.contact || post.website) && (
              <div className="bg-eco-sand/20 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-eco-green-dark mb-4">Informações de Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {post.openingHours && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Horário de Funcionamento</div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-eco-green mt-0.5 shrink-0" />
                        <span className="text-sm">{post.openingHours}</span>
                      </div>
                    </div>
                  )}
                  
                  {post.contact && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contato</div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-eco-green mt-0.5 shrink-0" />
                        <span className="text-sm">{post.contact}</span>
                      </div>
                    </div>
                  )}
                  
                  {post.website && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Website</div>
                      <div className="flex items-start gap-2">
                        <Globe className="h-4 w-4 text-eco-green mt-0.5 shrink-0" />
                        <a 
                          href={post.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-eco-green hover:text-eco-green-dark underline break-all"
                        >
                          {post.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Resumo */}
            <div className="bg-eco-sand/20 p-6 rounded-lg mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-3 mb-8">
              <Button
                variant="outline"
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 ${
                  isLiked ? "text-red-500 border-red-500 bg-red-50" : ""
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Curtido" : "Curtir"} ({(post.likes || 0) + (isLiked ? 1 : 0)})
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>

            <Separator className="mb-8" />
            
            {/* Conteúdo do Artigo */}
            <div className="prose prose-lg max-w-none prose-eco prose-headings:text-eco-green-dark prose-a:text-eco-green prose-strong:text-eco-green-dark prose-blockquote:border-eco-green prose-blockquote:bg-eco-sand/10">
              <MarkdownRenderer content={post.content || 'Conteúdo não disponível.'} />
            </div>

            {/* Call to Action */}
            <div className="mt-12 p-6 bg-gradient-to-r from-eco-green/10 to-eco-sand/20 rounded-lg">
              <h3 className="text-xl font-bold text-eco-green-dark mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Gostou deste artigo?
              </h3>
              <p className="text-gray-700 mb-4">
                Explore mais conteúdos sobre sustentabilidade e descubra como você pode fazer a diferença no meio ambiente.
              </p>
              <div className="flex gap-3">
                <Link to="/blog">
                  <Button className="bg-eco-green hover:bg-eco-green-dark">
                    Ver mais artigos
                  </Button>
                </Link>
                <Button variant="outline">
                  Inscrever-se na newsletter
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Artigos Relacionados */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-eco-green-dark mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Recomendações para você
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Card key={related.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-40">
                    <img 
                      src={related.image} 
                      alt={related.title || related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white/90 text-eco-green-dark text-xs">
                        {related.category || related.theme}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-eco-green transition-colors">
                      {related.title || related.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {related.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{related.author}</span>
                      <span>{related.readTime}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to={`/blog/${related.slug || related.id}`}>Ler artigo</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
