
import { useState, useEffect } from 'react';
import { firebaseFirestore } from '@/services/firebaseFirestore';

interface Blog {
  id: string;
  title?: string;
  name?: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt?: string;
  createdAt?: string;
  readTime: string;
  category?: string;
  theme?: string;
  tags?: string[];
  topics?: string;
  views?: number;
  likes?: number;
  slug: string;
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  content?: string;
}

// Função para gerar slug a partir do título
const generateSlug = (title: string): string => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens do início e fim
    .trim();
};

// Função para processar tags corretamente
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

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      console.log('useBlogs: Iniciando busca de blogs do Firebase...');
      
      // Buscar blogs do Firebase Firestore
      const blogsData = await firebaseFirestore.blogs?.getAll();
      console.log('useBlogs: Dados brutos do Firebase:', blogsData);
      
      // Filtrar apenas posts publicados ou mostrar todos dependendo do contexto
      const processedBlogs = (blogsData || []).map(blog => {
        const title = blog.name || blog.title || 'Sem título';
        let slug = blog.slug;
        
        // Se não tem slug, gerar um baseado no título
        if (!slug || slug.trim() === '') {
          slug = generateSlug(title);
          console.log('useBlogs: Slug gerado para', title, ':', slug);
        }
        
        // Processar tags corretamente
        const processedTags = processTags(blog.tags, blog.topics);
        
        console.log('useBlogs: Processando blog:', {
          id: blog.id,
          title,
          originalSlug: blog.slug,
          finalSlug: slug,
          status: blog.status,
          tags: processedTags
        });
        
        return {
          ...blog,
          // Garantir que o título seja consistente
          title: title,
          name: title,
          // Garantir que temos um slug válido
          slug: slug,
          // Garantir que publishedAt seja usado corretamente
          publishedAt: blog.publishedAt || blog.createdAt,
          // Garantir que temos valores padrão
          status: blog.status || 'draft',
          featured: blog.featured || false,
          excerpt: blog.excerpt || 'Sem descrição disponível.',
          readTime: blog.readTime || '5 min de leitura',
          views: blog.views || 0,
          likes: blog.likes || 0,
          // Garantir que tags é sempre um array
          tags: processedTags,
          // Garantir que temos uma imagem padrão
          image: blog.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'
        };
      });
      
      console.log('useBlogs: Blogs processados:', processedBlogs);
      setBlogs(processedBlogs);
    } catch (error) {
      console.error('useBlogs: Erro ao buscar blogs:', error);
      setBlogs([]);
    } finally {
      setIsLoading(false);
      console.log('useBlogs: Busca finalizada');
    }
  };

  const refetch = async () => {
    await fetchBlogs();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    isLoading,
    refetch
  };
};
