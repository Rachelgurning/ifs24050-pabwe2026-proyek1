import { useEffect } from 'react';
import { APP_NAME } from '../utils/constants.js';

function setDescription(content) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/** Mengatur judul tab dan meta description unik untuk setiap halaman (SEO & aksesibilitas). */
export function useDocumentMeta(title, description) {
  useEffect(() => {
    document.title = title === APP_NAME ? title : `${title} | ${APP_NAME}`;
    if (description) setDescription(description);
  }, [title, description]);
}
