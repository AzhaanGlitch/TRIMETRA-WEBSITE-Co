import { useEffect, useMemo, useState } from 'react';

function parseHash() {
    const rawHash = window.location.hash || '#/home';
    const route = rawHash.slice(1) || '/home';
    const [pathWithQuery, anchor = ''] = route.split('#');
    const [pathPart, queryString = ''] = pathWithQuery.split('?');
    const query = Object.fromEntries(new URLSearchParams(queryString));

    let path = pathPart || '/home';
    if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    return {
        path,
        query,
        anchor,
        rawHash
    };
}

export function useHashRoute() {
    const [route, setRoute] = useState(parseHash);

    useEffect(() => {
        const handleRouteChange = () => {
            const parsed = parseHash();
            setRoute((prevRoute) => {
                if (prevRoute.path !== parsed.path) {
                    window.scrollTo({ top: 0, behavior: 'instant' });
                }
                return parsed;
            });
        };

        window.addEventListener('hashchange', handleRouteChange);
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('hashchange', handleRouteChange);
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

    return useMemo(() => route, [route]);
}
