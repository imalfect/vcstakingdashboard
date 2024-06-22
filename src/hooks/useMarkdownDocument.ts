import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';

export default function useMarkdownDocument(id: string) {
	const [body, setBody] = useState<string | null>(null);
	useEffect(() => {
		fetch('/document/' + id + '.mdx')
			.then((res) => res.text())
			.then((mdxSource) => serialize(mdxSource))
			.then((mdxSource) => mdxSource.compiledSource)
			.then(setBody)
			.catch(() => setBody(null));
	}, [id]);
	return body;
}
