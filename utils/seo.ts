// Helper function to update/create meta tags
export const updateMeta = (name: string, content: string, property?: string) => {
  let element;
  if (property) {
    element = document.querySelector(`meta[property="${property}"]`);
  } else {
    element = document.querySelector(`meta[name="${name}"]`);
  }

  if (!element) {
    element = document.createElement('meta');
    if (property) element.setAttribute('property', property);
    else element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

// Helper function to update/create canonical link
export const updateCanonical = (url: string) => {
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};
