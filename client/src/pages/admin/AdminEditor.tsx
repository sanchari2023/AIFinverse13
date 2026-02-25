import { useState, useRef } from "react";
import { useLocation } from "wouter";

export default function AdminEditor() {
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setLocation("/admin/login");
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://api.aifinverse.com/admin/posts/images/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      const imageMarkdown = `\n\n![${file.name}](${imageUrl})\n\n`;
      setContent(content + imageMarkdown);
    } catch (error) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Clear the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const insertImage = () => {
    fileInputRef.current?.click();
  };

  const insertBold = () => {
    setContent(content + "**bold text**");
  };

  const insertItalic = () => {
    setContent(content + "*italic text*");
  };

  const insertStrikethrough = () => {
    setContent(content + "~~strikethrough~~");
  };

  const insertHeading = () => {
    setContent(content + "\n\n## Heading\n\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://api.aifinverse.com/admin/posts/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            subtitle,
            content,
            excerpt: content.replace(/!\[.*\]\(.*\)/g, '').substring(0, 200),
            featured_image_url: featuredImage,
            status,
            category,
            tags: tags.split(",").map(tag => tag.trim()),
            meta_description: content.replace(/!\[.*\]\(.*\)/g, '').substring(0, 160),
            is_featured: false
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Post created successfully!");
        setLocation("/newsletter");
      } else {
        alert(data.detail || "Error creating post");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const toolbarButtonStyle = (buttonName: string) => ({
    padding: "6px 12px",
    background: hoveredButton === buttonName ? "#e5e7eb" : "none",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#374151",
    transition: "background 0.2s",
    opacity: isUploading && buttonName === 'image' ? 0.5 : 1
  });

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "#f3f4f6",
      padding: "40px"
    }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{ display: 'none' }}
      />

      {/* Header */}
      <div style={{
        maxWidth: "900px",
        margin: "0 auto 30px auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111" }}>
          ✦ New post
        </h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "white",
              fontSize: "0.95rem",
              color: "#374151",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="draft">Save as Draft</option>
            <option value="published">Publish Now</option>
          </select>
          <button
            onClick={handleSubmit}
            style={{
              padding: "8px 24px",
              background: "#111",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        overflow: "hidden"
      }}>
        
        
           
        {/* Title and Subtitle */}
        <div style={{ padding: "24px 24px 0 24px" }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 0",
              border: "none",
              fontSize: "2.5rem",
              fontWeight: "700",
              outline: "none",
              marginBottom: "8px",
              color: "#111"
            }}
          />
          
          <input
            type="text"
            placeholder="Add a subtitle..."
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 0",
              border: "none",
              fontSize: "1.25rem",
              color: "#6b7280",
              outline: "none",
              marginBottom: "24px"
            }}
          />
        </div>

        {/* Formatting Toolbar */}
        <div style={{
          padding: "12px 24px",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
          background: "#fafafa",
          display: "flex",
          gap: "8px",
          alignItems: "center"
        }}>
          <span style={{ fontSize: "0.9rem", color: "#6b7280", marginRight: "8px" }}>
            Style ▼
          </span>
          
          <button
            type="button"
            onClick={insertBold}
            style={toolbarButtonStyle('bold')}
            onMouseEnter={() => setHoveredButton('bold')}
            onMouseLeave={() => setHoveredButton(null)}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          
          <button
            type="button"
            onClick={insertItalic}
            style={toolbarButtonStyle('italic')}
            onMouseEnter={() => setHoveredButton('italic')}
            onMouseLeave={() => setHoveredButton(null)}
            title="Italic"
          >
            <em>I</em>
          </button>
          
          <button
            type="button"
            onClick={insertStrikethrough}
            style={toolbarButtonStyle('strike')}
            onMouseEnter={() => setHoveredButton('strike')}
            onMouseLeave={() => setHoveredButton(null)}
            title="Strikethrough"
          >
            <span style={{ textDecoration: "line-through" }}>S</span>
          </button>
          
          <div style={{ width: "1px", height: "24px", background: "#e5e7eb", margin: "0 8px" }} />
          
          <button
            type="button"
            onClick={insertHeading}
            style={toolbarButtonStyle('heading')}
            onMouseEnter={() => setHoveredButton('heading')}
            onMouseLeave={() => setHoveredButton(null)}
            title="Heading"
          >
            H
          </button>
          
          <button
            type="button"
            onClick={insertImage}
            disabled={isUploading}
            style={toolbarButtonStyle('image')}
            onMouseEnter={() => setHoveredButton('image')}
            onMouseLeave={() => setHoveredButton(null)}
            title="Insert image"
          >
            {isUploading ? (
              <span style={{ fontSize: "1.1rem" }}>⏳</span>
            ) : (
              <span style={{ fontSize: "1.1rem" }}>🖼️</span>
            )}
          </button>
          
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              Email header / footer
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: "24px" }}>
          <textarea
            rows={20}
            placeholder="Write your story... (Click the 🖼️ button to insert images from your computer)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "1rem",
              lineHeight: "1.8",
              color: "#111",
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />
        </div>

        {/* Footer Metadata */}
        <div style={{
          padding: "20px 24px",
          borderTop: "1px solid #f0f0f0",
          background: "#fafafa",
          display: "flex",
          gap: "24px",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>Category:</span>
            <input
              type="text"
              placeholder="Add category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                fontSize: "0.9rem",
                outline: "none",
                background: "white"
              }}
            />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "250px" }}>
            <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>Tags:</span>
            <input
              type="text"
              placeholder="AI, Markets, Trading (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{
                flex: 1,
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                fontSize: "0.9rem",
                outline: "none",
                background: "white"
              }}
            />
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "6px 16px",
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "0.9rem",
              cursor: "pointer",
              color: "#6b7280",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Author hint */}
      <div style={{
        maxWidth: "900px",
        margin: "20px auto 0 auto",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#6b7280",
        fontSize: "0.9rem"
      }}>
        <span>sanchari ghatak</span>
        <span style={{ fontSize: "1.2rem", lineHeight: "1" }}>✨</span>
        <span style={{ 
          background: "#e5e7eb", 
          padding: "2px 8px", 
          borderRadius: "12px",
          fontSize: "0.8rem"
        }}>
          +
        </span>
        <span>j am</span>
      </div>
    </div>
  );
}