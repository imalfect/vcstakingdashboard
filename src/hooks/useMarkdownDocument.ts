import { serialize, SerializeResult } from 'next-mdx-remote-client/serialize';
import { useEffect, useState } from 'react';

export default function useMarkdownDocument(id: string) {
	const [body, setBody] = useState<SerializeResult | null>();
	useEffect(() => {
		fetch('/document/' + id + '.mdx')
			.then((res) => res.text())
			.then((mdxSource) =>
				serialize({
					source: mdxSource
				})
			)
			.then((mdxSource) => mdxSource)
			.then(setBody)
			.catch(() => setBody(null));
	}, [id]);
	return body;
}
