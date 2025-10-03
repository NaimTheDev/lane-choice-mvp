import { AiPostGenerator } from '@/components/ai-post-generator';

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center font-headline">Create a New Post</h1>
      <AiPostGenerator />
    </div>
  );
}
