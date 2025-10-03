
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { generateCarDescription } from '@/ai/flows/generate-car-description';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, Sparkles } from 'lucide-react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from './auth-provider';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export function AiPostGenerator() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = async () => {
    if (!imageDataUrl || !imageFile) {
      toast({
        title: 'Error',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedDescription('');

    try {
      const result = await generateCarDescription({ photoDataUri: imageDataUrl });
      setGeneratedDescription(result.description);
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate description. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to create a post.", variant: "destructive" });
        return;
    }
    if (!generatedDescription || !imageFile) {
        toast({
            title: 'Error',
            description: 'Please upload an image and generate a description.',
            variant: 'destructive',
        });
        return;
    }
    setIsPosting(true);

    try {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const downloadUrl = await getDownloadURL(storageRef);
        
        // Save post to Firestore
        const postsCollection = collection(db, 'posts');
        await addDoc(postsCollection, {
            authorRef: doc(db, 'users', user.uid),
            content: generatedDescription,
            imageUrl: downloadUrl,
            imageHint: "user upload",
            likes: 0,
            comments: [],
            createdAt: serverTimestamp(),
        });

        toast({
            title: 'Post Created!',
            description: 'Your post is now live on the feed.',
        });
        
        router.push('/');

    } catch (error) {
        console.error("Error creating post:", error);
        toast({ title: "Error", description: "Failed to create post. Please try again.", variant: "destructive" });
    } finally {
        setIsPosting(false);
    }
  }

  const isLoading = isGenerating || isPosting;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-accent" />
          AI Post Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
          >
            {imageDataUrl ? (
              <Image
                src={imageDataUrl}
                alt="Uploaded car"
                width={200}
                height={150}
                className="object-contain h-full py-2"
              />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
              </div>
            )}
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <Button onClick={handleGenerateDescription} disabled={!imageFile || isLoading} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Description'
          )}
        </Button>

        <div>
          <Textarea
            placeholder="Your generated description will appear here..."
            value={generatedDescription}
            onChange={(e) => setGeneratedDescription(e.target.value)}
            rows={6}
            className="text-base"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!generatedDescription || isLoading} onClick={handleCreatePost}>
           {isPosting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            'Create Post'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
