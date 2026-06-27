import { useEffect, useMemo, useState } from 'react';

function parseHash() {
    const rawHash = window.location.hash || '#/home';
    const route = rawHash.slice(1) || '/home';
    const [pathPart, queryString = ''] = route.split('?');
    const query = Object.fromEntries(new URLSearchParams(queryString));

    return {
        path: pathPart || '/home',
        query,
        rawHash
    };
}

export function useHashRoute() {
    const [route, setRoute] = useState(parseHash);

    useEffect(() => {
        const handleRouteChange = () => {
            setRoute(parseHash());
            window.scrollTo({ top: 0, behavior: 'instant' });
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
