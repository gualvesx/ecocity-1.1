
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RichTextEditor } from './RichTextEditor';
import { firebaseFirestore } from '@/services/firebaseFirestore';
import { useAuth } from '@/contexts/AuthContext';
import { useBlogs } from '@/hooks/useBlogs';
import { toast } from 'sonner';
import { BlogFormData } from '@/types/blog';

export function EditBlogPost() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user } = useAuth();
  const { blogs, isLoading: blogsLoading } = useBlogs();
  const [existingPost, setExistingPost] = useState<Partial<BlogFormData> | undefined>(undefined);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  // Verificar se é um novo post ou edição
  const isNewPost = !slug;

  // Processar tags para o formato correto
  const processTags = (tags: any): string[] => {
    if (Array.isArray(tags)) {
      return tags;
    }
    if (typeof tags === 'string' && tags.trim()) {
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    return [];
  };

  useEffect(() => {
    const loadExistingPost = async () => {
      console.log('EditBlogPost: Verificando se é novo post ou edição, slug:', slug);
      
      // Se não há slug, é um novo post - não tentar carregar dados
      if (isNewPost) {
        console.log('EditBlogPost: Novo post detectado, não carregando dados existentes');
        setExistingPost(undefined);
        setIsLoadingPost(false);
        return;
      }

      // Se há slug mas ainda está carregando blogs, esperar
      if (blogsLoading) {
        setIsLoadingPost(true);
        return;
      }

      setIsLoadingPost(true);

      try {
        // Procurar o blog pelo slug nos dados já carregados
        const foundBlog = blogs.find(blog => blog.slug === slug || blog.id === slug);
        
        if (foundBlog) {
          console.log('EditBlogPost: Blog encontrado para edição:', foundBlog);
          
          // Converter dados do Firebase para o formato do formulário
          const postData: Partial<BlogFormData> = {
            title: foundBlog.title || foundBlog.name || '',
            excerpt: foundBlog.excerpt || '',
            content: foundBlog.content || '',
            tags: processTags(foundBlog.tags || foundBlog.topics),
            category: foundBlog.category || foundBlog.theme || '',
            image: foundBlog.image || '',
            featured: foundBlog.featured || false,
            status: foundBlog.status === 'published' ? 'published' : 'draft',
            metaTitle: foundBlog.metaTitle || foundBlog.title || foundBlog.name || '',
            metaDescription: foundBlog.metaDescription || foundBlog.excerpt || ''
          };
          
          console.log('EditBlogPost: Dados do post carregados para edição:', postData);
          setExistingPost(postData);
        } else {
          console.log('EditBlogPost: Blog não encontrado com slug:', slug);
          toast.error('Post não encontrado');
        }
      } catch (error) {
        console.error('EditBlogPost: Erro ao carregar post:', error);
        toast.error('Erro ao carregar o post');
      } finally {
        setIsLoadingPost(false);
      }
    };

    loadExistingPost();
  }, [slug, blogs, blogsLoading, isNewPost]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();
  };

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de leitura`;
  };

  const handleSave = async (postData: BlogFormData) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar um blog.');
      return;
    }

    try {
      console.log('EditBlogPost: Salvando post:', postData);
      
      const slugToUse = generateSlug(postData.title);
      const readTime = calculateReadTime(postData.content);
      const now = new Date().toISOString();
      
      if (isNewPost) {
        // Criar novo post
        console.log('EditBlogPost: Criando novo post');
        
        const newBlogPost: any = {
          title: postData.title,
          slug: slugToUse,
          excerpt: postData.excerpt,
          content: postData.content,
          author: user.name || user.email,
          authorId: user.id,
          createdAt: now,
          updatedAt: now,
          status: postData.status,
          featured: postData.featured,
          category: postData.category,
          tags: postData.tags.join(', '), // Firebase armazena como string
          image: postData.image,
          readTime: readTime,
          views: 0,
          likes: 0,
          metaTitle: postData.metaTitle || postData.title,
          metaDescription: postData.metaDescription || postData.excerpt,
          // Campos do schema atual do Firebase
          name: postData.title,
          theme: postData.category,
          topics: postData.tags.join(', ')
        };

        // Adicionar publishedAt se estiver publicando
        if (postData.status === 'published') {
          newBlogPost.publishedAt = now;
        }

        console.log('EditBlogPost: Dados do novo blog:', newBlogPost);

        // Usar a função add que existe no firebaseFirestore.blogs
        await firebaseFirestore.blogs.add(newBlogPost);
        
        toast.success('Post criado com sucesso!');
        
      } else {
        // Atualizar post existente
        const existingBlog = blogs.find(blog => blog.slug === slug || blog.id === slug);
        
        if (!existingBlog) {
          toast.error('Post original não encontrado');
          return;
        }

        const updatedBlogPost: any = {
          title: postData.title,
          slug: slugToUse,
          excerpt: postData.excerpt,
          content: postData.content,
          author: existingBlog.author || user.name || user.email,
          authorId: existingBlog.authorId || user.id,
          createdAt: existingBlog.createdAt || now,
          updatedAt: now,
          status: postData.status,
          featured: postData.featured,
          category: postData.category,
          tags: postData.tags.join(', '),
          image: postData.image,
          readTime: readTime,
          views: existingBlog.views || 0,
          likes: existingBlog.likes || 0,
          metaTitle: postData.metaTitle || postData.title,
          metaDescription: postData.metaDescription || postData.excerpt,
          name: postData.title,
          theme: postData.category,
          topics: postData.tags.join(', ')
        };

        if (postData.status === 'published') {
          updatedBlogPost.publishedAt = existingBlog.publishedAt || now;
        } else {
          if (existingBlog.publishedAt) {
            updatedBlogPost.publishedAt = existingBlog.publishedAt;
          }
        }

        console.log('EditBlogPost: Dados do blog antes de atualizar:', updatedBlogPost);
        
        // Usar a função update que existe no firebaseFirestore.blogs
        await firebaseFirestore.blogs.update(existingBlog.id, updatedBlogPost);
        
        toast.success('Post atualizado com sucesso!');
      }

      navigate('/blog');
    } catch (error) {
      console.error('EditBlogPost: Erro ao salvar blog post:', error);
      toast.error('Erro ao salvar o post. Tente novamente.');
    }
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  if (isLoadingPost) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-eco-green border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4">Carregando dados do post...</p>
        </div>
      </div>
    );
  }

  if (!isNewPost && !existingPost && !blogsLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Post não encontrado</h2>
          <p className="text-gray-600 mb-4">O post que você tentou editar não foi encontrado.</p>
          <button 
            onClick={() => navigate('/blog')}
            className="bg-eco-green text-white px-4 py-2 rounded hover:bg-eco-green-dark"
          >
            Voltar ao Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <RichTextEditor
        initialPost={existingPost}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
