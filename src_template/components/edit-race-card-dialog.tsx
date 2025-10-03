
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from './auth-provider';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface EditRaceCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRaceCardDialog({ open, onOpenChange }: EditRaceCardDialogProps) {
  const { toast } = useToast();
  const { appUser } = useAuth();
  
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null]);
  const [imageDataUrls, setImageDataUrls] = useState<(string | null)[]>([null, null, null]);
  const [carName, setCarName] = useState(appUser?.raceCarName || '');
  const [description, setDescription] = useState(appUser?.raceCardDescription || '');

  React.useEffect(() => {
    if (appUser) {
        setCarName(appUser.raceCarName || '');
        setDescription(appUser.raceCardDescription || '');
        const existingUrls = appUser.raceCardImageUrls || [];
        const newUrls = [...existingUrls, ...Array(3 - existingUrls.length).fill(null)];
        setImageDataUrls(newUrls);
    }
  }, [appUser]);

  const handleSaveChanges = async () => {
    if (!appUser) {
      toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }
    
    try {
        const uploadPromises = imageFiles.map((file, index) => {
            if (file) {
                const storageRef = ref(storage, `race-cards/${appUser.id}/${Date.now()}_${index}`);
                return uploadBytes(storageRef, file).then(snapshot => getDownloadURL(snapshot.ref));
            }
            return Promise.resolve(imageDataUrls[index]); // Keep existing URL if no new file
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        const finalUrls = uploadedUrls.filter((url): url is string => url !== null);

        const userDocRef = doc(db, 'users', appUser.id);
        await updateDoc(userDocRef, {
            raceCarName: carName,
            raceCardDescription: description,
            raceCardImageUrls: finalUrls.length > 0 ? finalUrls : ['https://placehold.co/600x800'],
        });

        toast({
            title: 'Card Updated',
            description: 'Your Speed Dating card has been saved.',
        });
        onOpenChange(false);
    } catch (error) {
        console.error("Error saving card:", error);
        toast({
            title: 'Save Failed',
            description: 'There was an error saving your card.',
            variant: 'destructive',
        });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFiles = [...imageFiles];
      newFiles[index] = file;
      setImageFiles(newFiles);

      const reader = new FileReader();
      reader.onload = (e) => {
        const newUrls = [...imageDataUrls];
        newUrls[index] = e.target?.result as string;
        setImageDataUrls(newUrls);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90vh]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Edit Speed Dating Card</DialogTitle>
          <DialogDescription>
            Customize how your car appears to others in the Speed Dating stack. Add up to 3 photos.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="overflow-y-auto">
        <div className="grid gap-4 py-4 px-6">
          <div className="space-y-2">
            <Label>Vehicle Photos</Label>
            <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(index => (
                    <label
                        key={index}
                        htmlFor={`race-card-image-upload-${index}`}
                        className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
                    >
                        {imageDataUrls[index] ? (
                        <Image
                            src={imageDataUrls[index]!}
                            alt={`Uploaded car ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                            />
                        ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Upload className="w-6 h-6 mb-1" />
                            <p className="text-xs text-center">Photo {index+1}</p>
                        </div>
                        )}
                        <input
                            id={`race-card-image-upload-${index}`}
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => handleImageChange(e, index)}
                        />
                    </label>
                ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle-model">Vehicle Model</Label>
            <Input id="vehicle-model" placeholder="e.g., Ford Mustang GT" value={carName} onChange={e => setCarName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description/Mods</Label>
            <Textarea
              id="description"
              placeholder="e.g., 5.0L V8, custom exhaust, tuned..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-0">
          <Button type="button" onClick={handleSaveChanges} className="w-full">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
