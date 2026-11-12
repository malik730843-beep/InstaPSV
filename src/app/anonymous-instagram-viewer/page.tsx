import ToolGuidePage, { guideMetadata } from '@/components/seo/ToolGuidePage';
import { toolGuides } from '@/lib/toolGuides';

const guide = toolGuides.find(g => g.slug === 'anonymous-instagram-viewer')!;
export const metadata = guideMetadata(guide);

export default function Page() {
    return <ToolGuidePage guide={guide} />;
}
