'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { BLOG_CATEGORIES, generateSlug } from '@/types/blog';

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState<BlogCategory>('guides');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Load post
  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/blog?id=${postId}`);
        if (response.ok) {
          const data = await response.json();
          const p = data.post;
          setPost(p);
          setTitle(p.title || '');
          setSlug(p.slug || '');
          setExcerpt(p.excerpt || '');
          setContent(p.content || '');
          setCoverImage(p.cover_image || '');
          setCategory(p.category || 'guides');
          setTags(p.tags || []);
          setFeatured(p.featured || false);
          setSeoTitle(p.seo_title || '');
          setSeoDescription(p.seo_description || '');
        } else {
          router.push('/admin/blog');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        router.push('/admin/blog');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [postId, router]);

  // Track changes
  useEffect(() => {
    if (post) {
      const changed =
        title !== (post.title || '') ||
        slug !== (post.slug || '') ||
        excerpt !== (post.excerpt || '') ||
        content !== (post.content || '') ||
        coverImage !== (post.cover_image || '') ||
        category !== (post.category || 'guides') ||
        JSON.stringify(tags) !== JSON.stringify(post.tags || []) ||
        featured !== (post.featured || false) ||
        seoTitle !== (post.seo_title || '') ||
        seoDescription !== (post.seo_description || '');
      setHasChanges(changed);
    }
  }, [post, title, slug, excerpt, content, coverImage, category, tags, featured, seoTitle, seoDescription]);

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!post?.slug || post.slug === generateSlug(post.title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Save post
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          title,
          slug,
          excerpt,
          content,
          cover_image: coverImage || null,
          category,
          tags,
          featured,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
        setHasChanges(false);
      } else {
        alert('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  // Publish post
  const handlePublish = async () => {
    if (!confirm('Publish this post? It will be visible on the public site.')) return;

    setPublishing(true);
    try {
      const response = await fetch('/api/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          title,
          slug,
          excerpt,
          content,
          cover_image: coverImage || null,
          category,
          tags,
          featured,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null,
          status: 'published',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
        setHasChanges(false);
      } else {
        alert('Failed to publish post');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post');
    } finally {
      setPublishing(false);
    }
  };

  // Unpublish post
  const handleUnpublish = async () => {
    if (!confirm('Unpublish this post? It will be hidden from the public site.')) return;

    try {
      const response = await fetch('/api/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          status: 'draft',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      }
    } catch (error) {
      console.error('Error unpublishing post:', error);
      alert('Failed to unpublish post');
    }
  };

  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Simple markdown to HTML for preview
  const renderMarkdown = useCallback((md: string) => {
    return md
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-boerne-gold hover:underline">$1</a>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-boerne-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Post not found</p>
        <Link href="/admin/blog" className="text-boerne-gold hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blog"
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                  {title || 'Untitled Post'}
                </h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    post.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {post.status}
                  </span>
                  {hasChanges && (
                    <span className="text-orange-600">Unsaved changes</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Preview link for published posts */}
              {post.status === 'published' && (
                <Link
                  href={`/guides/${post.slug}`}
                  target="_blank"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View
                </Link>
              )}

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Draft'
                )}
              </button>

              {/* Publish/Unpublish button */}
              {post.status === 'published' ? (
                <button
                  onClick={handleUnpublish}
                  className="px-4 py-2 border border-yellow-500 text-yellow-600 font-medium rounded-lg hover:bg-yellow-50"
                >
                  Unpublish
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={publishing || !title || !content}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {publishing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    'Publish'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title..."
                className="w-full px-4 py-3 text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
            </div>

            {/* Content tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'edit'
                        ? 'border-b-2 border-boerne-gold text-boerne-navy'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'preview'
                        ? 'border-b-2 border-boerne-gold text-boerne-navy'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'edit' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt
                      </label>
                      <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief summary for listings and SEO..."
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content (Markdown)
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content using Markdown..."
                        rows={20}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent font-mono text-sm resize-none"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Supports Markdown: **bold**, *italic*, [links](url), ## headings, - lists
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    {excerpt && (
                      <p className="text-lg text-gray-600 italic mb-6">{excerpt}</p>
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<p class="mb-4">${renderMarkdown(content || 'No content yet...')}</p>`
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Slug */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm">/guides/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BlogCategory)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              >
                {Object.entries(BLOG_CATEGORIES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type tag and press Enter..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent text-sm"
              />
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent text-sm"
              />
              {coverImage && (
                <div className="mt-3">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>

            {/* Featured toggle */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 text-boerne-gold rounded focus:ring-boerne-gold"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured Post
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Featured posts appear prominently on the guides page
              </p>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || 'Custom title for search engines...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {(seoTitle || title).length}/60 characters
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    SEO Description
                  </label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={excerpt || 'Custom description for search engines...'}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {(seoDescription || excerpt).length}/160 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Post info */}
            <div className="bg-gray-100 rounded-xl p-6 text-sm text-gray-600">
              <div className="flex justify-between mb-2">
                <span>Created:</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Updated:</span>
                <span>{new Date(post.updated_at).toLocaleDateString()}</span>
              </div>
              {post.published_at && (
                <div className="flex justify-between">
                  <span>Published:</span>
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
