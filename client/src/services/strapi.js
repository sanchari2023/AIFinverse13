// src/services/strapi.js
// src/services/strapi.js
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://3.211.146.27:1337";

export function formatArticle(strapiArticle) {
  const attributes = strapiArticle;
  
  let fullHtml = "";
  let plainText = "";
  
  console.log("Processing article:", attributes.Title);
  
  if (attributes.Content && Array.isArray(attributes.Content)) {
    console.log("Content blocks count:", attributes.Content.length);
    
    for (let i = 0; i < attributes.Content.length; i++) {
      const block = attributes.Content[i];
      console.log(`Block ${i}:`, block.__component);
      
      // Handle TextBlock
      if (block.__component === "content.text-block") {
        if (Array.isArray(block.text)) {
          block.text.forEach((para) => {
            if (!para.children) return;

            // extract paragraph text
            const paraText = para.children
              .map(child => child.text || "")
              .join("")
              .trim();

            // skip empty
            if (!paraText) return;

            // ✅ MATCH YOUR HARDCODED ARTICLE STYLE
            fullHtml += `<p style="
              margin-bottom: 1.5rem;
              line-height: 1.625;
              color: #d1d5db;
              font-size: 0.875rem;
            ">
              ${paraText}
            </p>`;

            plainText += paraText + " ";
          });
        }
        // Handle plain text (if not rich text)
        else if (typeof block.text === 'string') {
          const lines = block.text.split('\n');
          for (const line of lines) {
            if (line.trim()) {
              fullHtml += `<p style="margin-bottom: 1.5rem; line-height: 1.625; color: #d1d5db; font-size: 0.875rem;">${line.trim()}</p>`;
              plainText += line.trim();
            }
          }
        }
      }
      
      // Handle ImageBlock
      else if (block.__component === "content.image-block") {
        console.log("Found ImageBlock, images:", block.images);
        
        if (block.images && Array.isArray(block.images)) {
          for (const img of block.images) {
            if (img.url) {
              const imageUrl = `${STRAPI_URL}${img.url}`;
              fullHtml += `<div style="margin: 2rem 0; display: flex; justify-content: center;">
                <img src="${imageUrl}" alt="${img.alternativeText || ''}" style="max-width: 100%; height: auto; border-radius: 0.5rem; border: 1px solid rgba(51, 65, 85, 0.5);" />
              </div>`;
              plainText += " [IMAGE] ";
              console.log("Added image:", imageUrl);
            }
          }
        }
        else if (block.images && block.images.data && Array.isArray(block.images.data)) {
          for (const img of block.images.data) {
            if (img.attributes && img.attributes.url) {
              const imageUrl = `${STRAPI_URL}${img.attributes.url}`;
              fullHtml += `<div style="margin: 2rem 0; display: flex; justify-content: center;">
                <img src="${imageUrl}" style="max-width: 100%; height: auto; border-radius: 0.5rem; border: 1px solid rgba(51, 65, 85, 0.5);" />
              </div>`;
              plainText += " [IMAGE] ";
            }
          }
        }
      }
    }
  }
  
  console.log("Generated HTML length:", fullHtml.length);
  
  return {
    id: attributes.id,
    title: attributes.Title || "Untitled",
    description: fullHtml || "<p>No description available</p>",
    descriptionPlainText: plainText,
    descriptionPlainTextLength: plainText.length,
    date: attributes.date,
    author: attributes.author,
    category: attributes.Category || "General"
  };
}

export async function getStrapiArticles() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles?populate[Content][populate]=*`);
    const data = await response.json();
    
    console.log("API Response:", data);
    
    if (data.data && data.data.length > 0) {
      // Sort by date descending (newest first)
      const sortedArticles = [...data.data].sort((a, b) => {
        const dateA = new Date(a.attributes?.date || a.date);
        const dateB = new Date(b.attributes?.date || b.date);
        return dateB - dateA;
      });
      return sortedArticles.map(item => formatArticle(item));
    }
    return [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}