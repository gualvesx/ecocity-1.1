
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Save,
  Eye,
  X,
  Plus
} from 'lucide-react';
import { BlogFormData } from '@/types/blog';

interface RichTextEditorProps {
  initialPost?: Partial<BlogFormData>;
  onSave: (post: BlogFormData) => void;
  onCancel: () => void;
}

export function RichTextEditor({ initialPost, onSave, onCancel }: RichTextEditorProps) {
  const [post, setPost] = useState<BlogFormData>(initialPost || {
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    category: '',
    image: '',
    featured: false,
    status: 'draft',
    metaTitle: '',
    metaDescription: ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const categories = [
    'Sustentabilidade',
    'Meio Ambiente',
    'Energia Renovável',
    'Reciclagem',
    'Mudanças Climáticas',
    'Biodiversidade',
    'Tecnologia Verde',
    'Educação Ambiental'
  ];

  const formatText = (command: string, value?: string) => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    
    switch (command) {
      case 'bold':
        formattedText = `**${selectedText || 'texto em negrito'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'texto em itálico'}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText || 'texto sublinhado'}</u>`;
        break;
      case 'h1':
        formattedText = `# ${selectedText || 'Título Principal'}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText || 'Subtítulo'}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText || 'Título Menor'}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText || 'Citação importante'}`;
        break;
      case 'list':
        formattedText = `- ${selectedText || 'Item da lista'}`;
        break;
      case 'orderedList':
        formattedText = `1. ${selectedText || 'Item numerado'}`;
        break;
      case 'link':
        formattedText = `[${selectedText || 'texto do link'}](${value || 'https://exemplo.com'})`;
        break;
      case 'image':
        formattedText = `![${selectedText || 'descrição da imagem'}](${value || 'https://exemplo.com/imagem.jpg'})`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);
    
    setPost(prev => ({ ...prev, content: newContent }));
    
    // Reposicionar cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const insertImage = () => {
    const imageUrl = prompt('URL da imagem:');
    if (imageUrl) {
      formatText('image', imageUrl);
    }
  };

  const insertLink = () => {
    const linkUrl = prompt('URL do link:');
    if (linkUrl) {
      formatText('link', linkUrl);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !post.tags.includes(newTag.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    if (!post.title.trim() || !post.content.trim()) {
      alert('Título e conteúdo são obrigatórios!');
      return;
    }
    onSave(post);
  };

  const renderPreview = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-eco-green-dark">
          {initialPost ? 'Editar Post' : 'Criar Novo Post'}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Editar' : 'Visualizar'}
          </Button>
          <Button onClick={handleSave} className="bg-eco-green hover:bg-eco-green-dark">
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Principal */}
        <div className="lg:col-span-2 space-y-4">
          {!previewMode ? (
            <>
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={post.title}
                      onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Digite o título do post..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt">Resumo *</Label>
                    <Textarea
                      id="excerpt"
                      value={post.excerpt}
                      onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Breve descrição do post..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image">URL da Imagem de Capa</Label>
                    <Input
                      id="image"
                      value={post.image}
                      onChange={(e) => setPost(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SEO */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO (Opcional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Título</Label>
                    <Input
                      id="metaTitle"
                      value={post.metaTitle || ''}
                      onChange={(e) => setPost(prev => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder="Título para SEO (deixe vazio para usar o título principal)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="metaDescription">Meta Descrição</Label>
                    <Textarea
                      id="metaDescription"
                      value={post.metaDescription || ''}
                      onChange={(e) => setPost(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="Descrição para motores de busca..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Barra de Ferramentas */}
              <Card>
                <CardHeader>
                  <CardTitle>Ferramentas de Formatação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => formatText('bold')}>
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => formatText('italic')}>
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => formatText('underline')}>
                      <Underline className="h-4 w-4" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <Button size="sm" variant="outline" onClick={() => formatText('h1')}>
                      H1
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => formatText('h2')}>
                      H2
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => formatText('h3')}>
                      H3
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <Button size="sm" variant="outline" onClick={() => formatText('list')}>
                      <List className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => formatText('orderedList')}>
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => formatText('quote')}>
                      <Quote className="h-4 w-4" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <Button size="sm" variant="outline" onClick={insertLink}>
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={insertImage}>
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Editor de Conteúdo */}
              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo do Post *</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    ref={contentRef}
                    value={post.content}
                    onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Digite o conteúdo do post usando Markdown..."
                    rows={20}
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Use Markdown para formatação. Selecione texto e use os botões acima para formatação rápida.
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Preview */
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <CardTitle className="text-2xl">{post.title || 'Título do Post'}</CardTitle>
                    <p className="text-muted-foreground mt-2">
                      {post.excerpt || 'Resumo do post...'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: renderPreview(post.content || 'Conteúdo do post...') 
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Painel Lateral */}
        <div className="space-y-4">
          {/* Status e Configurações */}
          <Card>
            <CardHeader>
              <CardTitle>Publicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={post.status} onValueChange={(value: 'draft' | 'published') => setPost(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={post.category} onValueChange={(value) => setPost(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={post.featured}
                  onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                />
                <Label htmlFor="featured">Post em destaque</Label>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nova tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button size="sm" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ajuda */}
          <Card>
            <CardHeader>
              <CardTitle>Ajuda - Markdown</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><code>**negrito**</code> = <strong>negrito</strong></p>
              <p><code>*itálico*</code> = <em>itálico</em></p>
              <p><code># Título</code> = Título principal</p>
              <p><code>## Subtítulo</code> = Subtítulo</p>
              <p><code>- Lista</code> = Lista com marcadores</p>
              <p><code>1. Lista</code> = Lista numerada</p>
              <p><code>&gt; Citação</code> = Citação</p>
              <p><code>[texto](url)</code> = Link</p>
              <p><code>![alt](url)</code> = Imagem</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
