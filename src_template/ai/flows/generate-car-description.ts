'use server';

/**
 * @fileOverview An AI agent to generate car descriptions based on images.
 *
 * - generateCarDescription - A function that generates a car description.
 * - GenerateCarDescriptionInput - The input type for the generateCarDescription function.
 * - GenerateCarDescriptionOutput - The return type for the generateCarDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCarDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a car, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateCarDescriptionInput = z.infer<typeof GenerateCarDescriptionInputSchema>;

const GenerateCarDescriptionOutputSchema = z.object({
  description: z.string().describe('A creative and engaging description of the car.'),
});
export type GenerateCarDescriptionOutput = z.infer<typeof GenerateCarDescriptionOutputSchema>;

export async function generateCarDescription(
  input: GenerateCarDescriptionInput
): Promise<GenerateCarDescriptionOutput> {
  return generateCarDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCarDescriptionPrompt',
  input: {schema: GenerateCarDescriptionInputSchema},
  output: {schema: GenerateCarDescriptionOutputSchema},
  prompt: `You are an expert automotive copywriter. Generate a creative and engaging description for a social media post about the car in the photo. Be descriptive and include interesting details.

Photo: {{media url=photoDataUri}}`,
});

const generateCarDescriptionFlow = ai.defineFlow(
  {
    name: 'generateCarDescriptionFlow',
    inputSchema: GenerateCarDescriptionInputSchema,
    outputSchema: GenerateCarDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
