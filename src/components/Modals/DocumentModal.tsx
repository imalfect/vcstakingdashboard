import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import useMarkdownDocument from '@/hooks/useMarkdownDocument';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MDXRemote } from 'next-mdx-remote';
export default function DocumentModal(props: {
	id: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const doc = useMarkdownDocument(props.id);
	const isDesktop = useMediaQuery('(min-width: 768px)');
	if (isDesktop) {
		return (
			<Dialog open={props.open} onOpenChange={props.onOpenChange}>
				<DialogContent className="doc sm:max-w-[425px]">
					{doc ? (
						<MDXRemote compiledSource={doc} frontmatter={''} scope={''} />
					) : (
						<p>Document not found.</p>
					)}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={props.open} onOpenChange={props.onOpenChange}>
			<DrawerContent className={'doc px-6 pb-6'}>
				{doc ? (
					<MDXRemote compiledSource={doc} frontmatter={''} scope={''} />
				) : (
					<p>Document not found.</p>
				)}
			</DrawerContent>
		</Drawer>
	);
}
