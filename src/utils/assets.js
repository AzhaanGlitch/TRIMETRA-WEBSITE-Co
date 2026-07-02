const imageModules = import.meta.glob('../../assets/images/*', {
    eager: true,
    query: '?url',
    import: 'default'
});

export function imageUrl(path) {
    if (!path) return '';

    const normalized = path.replaceAll('\\', '/');
    const key = `../../${normalized}`;

    return imageModules[key] || `/${normalized}`;
}

export function whatsappLink(number, message) {
    const digits = String(number || '').replace(/\D/g, '');
    const whatsappNumber = digits.length === 10 ? `91${digits}` : digits;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
